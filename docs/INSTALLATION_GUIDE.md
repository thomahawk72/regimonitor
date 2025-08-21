# RegiMonitor - Installasjonsveiledning

## 📋 Systemkrav

### Minimum krav
- **Node.js:** v18.0.0 eller nyere
- **npm:** v8.0.0 eller nyere
- **RAM:** 512 MB ledig minne
- **Diskplass:** 100 MB ledig plass
- **Nettverk:** Internettilkobling for API-kall

### Anbefalt
- **Node.js:** v20.0.0 eller nyere
- **RAM:** 1 GB ledig minne
- **CPU:** 2 kjerner eller mer
- **OS:** macOS 12+, Ubuntu 20.04+, eller Windows 10+

## 🍎 Installasjon på macOS

### Steg 1: Installer Node.js

#### Alternativ A: Via Homebrew (anbefalt)
```bash
# Installer Homebrew hvis ikke allerede installert
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js
brew install node

# Verifiser installasjon
node --version
npm --version
```

#### Alternativ B: Via offisiell installer
1. Gå til [nodejs.org](https://nodejs.org/)
2. Last ned macOS installer (.pkg)
3. Kjør installeren og følg instruksjonene

### Steg 2: Klon prosjektet
```bash
# Klon repository
git clone https://github.com/your-username/regimonitor.git
cd regimonitor

# Eller last ned som ZIP og pakk ut
# curl -L https://github.com/your-username/regimonitor/archive/main.zip -o regimonitor.zip
# unzip regimonitor.zip
# cd regimonitor-main
```

### Steg 3: Installer avhengigheter
```bash
# Installer alle avhengigheter (root + backend)
npm run install:all

# Verifiser installasjon
ls backend/node_modules | wc -l  # Skal vise flere pakker
```

### Steg 4: Konfigurer miljøvariabler
```bash
# Opprett .env fil
cp .env.example .env

# Rediger .env fil
nano .env
```

Eksempel `.env` for macOS:
```bash
# Server
PORT=3000
NODE_ENV=development

# Polling (sekunder)
NETWORK_INTERVAL=30
BROADCAST_INTERVAL=15
QUALITY_INTERVAL=5

# API
IP_API_URL=http://ip-api.com/json

# Kvalitet
QUALITY_PING_EXCELLENT_MAX=50
QUALITY_PING_GOOD_MAX=100
QUALITY_PING_POOR_MAX=200
QUALITY_JITTER_EXCELLENT_MAX=10
QUALITY_JITTER_GOOD_MAX=30
QUALITY_JITTER_POOR_MAX=50
QUALITY_PING_SERVER=google.com

# api.video (valgfritt)
API_VIDEO_API_KEY=your_api_key_here
API_VIDEO_STREAM_ID=your_stream_id_here
API_VIDEO_ENVIRONMENT=sandbox
```

### Steg 5: Start systemet
```bash
# Start i produksjonsmodus
npm start

# ELLER start i utviklingsmodus (auto-restart ved endringer)
npm run dev
```

### Steg 6: Verifiser installasjon
```bash
# Test API
curl http://localhost:3000/api/health

# Åpne dashboard
open http://localhost:3000
```

## 🐧 Installasjon på Linux (Ubuntu/Debian)

### Steg 1: Oppdater system
```bash
sudo apt update && sudo apt upgrade -y
```

### Steg 2: Installer Node.js

#### Alternativ A: Via NodeSource repository (anbefalt)
```bash
# Installer curl hvis ikke installert
sudo apt install -y curl

# Legg til NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Installer Node.js
sudo apt install -y nodejs

# Verifiser installasjon
node --version
npm --version
```

#### Alternativ B: Via snap
```bash
sudo snap install node --classic
```

### Steg 3: Installer systemavhengigheter
```bash
# Installer git og andre verktøy
sudo apt install -y git build-essential

# For ICMP ping (valgfritt)
sudo apt install -y iputils-ping
```

### Steg 4: Klon og installer prosjekt
```bash
# Klon prosjekt
git clone https://github.com/your-username/regimonitor.git
cd regimonitor

# Installer avhengigheter
npm run install:all
```

### Steg 5: Konfigurer miljø
```bash
# Opprett .env fil
cp .env.example .env

# Rediger konfigurasjon
nano .env  # eller vim .env
```

### Steg 6: Opprett systemd service (valgfritt)
```bash
# Opprett service fil
sudo nano /etc/systemd/system/regimonitor.service
```

Innhold av service-fil:
```ini
[Unit]
Description=RegiMonitor Dashboard
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/regimonitor
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Aktiver service:
```bash
# Reload systemd og start service
sudo systemctl daemon-reload
sudo systemctl enable regimonitor
sudo systemctl start regimonitor

# Sjekk status
sudo systemctl status regimonitor
```

### Steg 7: Konfigurer brannmur (valgfritt)
```bash
# Tillat port 3000
sudo ufw allow 3000

# Eller kun fra lokalt nettverk
sudo ufw allow from 192.168.0.0/16 to any port 3000
```

## 🔧 Avansert installasjon

### Docker installasjon

#### Opprett Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm run install:all

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

#### Opprett docker-compose.yml
```yaml
version: '3.8'
services:
  regimonitor:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./.env:/app/.env
    restart: unless-stopped
```

#### Kjør med Docker
```bash
# Bygg og start
docker-compose up -d

# Se logger
docker-compose logs -f

# Stopp
docker-compose down
```

### Nginx reverse proxy (Linux)
```bash
# Installer nginx
sudo apt install -y nginx

# Opprett config
sudo nano /etc/nginx/sites-available/regimonitor
```

Nginx konfigurasjon:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktiver konfigurasjon:
```bash
sudo ln -s /etc/nginx/sites-available/regimonitor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🚨 Feilsøking

### Node.js installasjonsproblemer

#### macOS
```bash
# Hvis Homebrew installasjon feiler
brew doctor
brew cleanup

# Reinstaller Node.js
brew uninstall node
brew install node
```

#### Linux
```bash
# Hvis npm permissions feiler
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Eller bruk nvm for brukerinstallasjon
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install node
```

### Port allerede i bruk
```bash
# Finn prosess som bruker port 3000
lsof -i :3000

# Drep prosess
kill -9 <PID>

# Eller bruk annen port
PORT=3001 npm start
```

### ICMP ping problemer
```bash
# Test ICMP tilgjengelighet
ping -c 1 google.com

# Hvis ICMP er blokkert, endre ping server
echo "QUALITY_PING_SERVER=8.8.8.8" >> .env
```

### Minneproblemer
```bash
# Øk Node.js minnegrense
NODE_OPTIONS="--max-old-space-size=1024" npm start
```

## 📊 Ytelse og overvåking

### Systemressurser
```bash
# Sjekk minnebruk
ps aux | grep node

# Sjekk CPU-bruk
top -p $(pgrep -f "node.*server.js")

# Sjekk diskbruk
du -sh regimonitor/
```

### Logging
```bash
# Kjør med logging
npm start 2>&1 | tee regimonitor.log

# Eller med systemd
journalctl -u regimonitor -f
```

### Backup
```bash
# Backup konfigurasjon
cp .env .env.backup

# Backup hele prosjekt
tar -czf regimonitor-backup-$(date +%Y%m%d).tar.gz regimonitor/
```

## 🔄 Oppdatering

### Manuell oppdatering
```bash
# Stopp server
pkill -f "node.*server.js"

# Pull endringer
git pull origin main

# Installer nye avhengigheter
npm run install:all

# Start server
npm start
```

### Automatisk oppdatering (Linux)
Opprett cron job:
```bash
crontab -e

# Legg til (sjekk oppdateringer hver dag kl 02:00)
0 2 * * * cd /path/to/regimonitor && git pull && npm run install:all && systemctl restart regimonitor
```

## 🛡️ Sikkerhet

### Grunnleggende sikkerhet
```bash
# Ikke kjør som root
sudo adduser regimonitor
sudo su - regimonitor

# Begrens nettverkstilgang
sudo ufw deny incoming
sudo ufw allow from 192.168.0.0/16 to any port 3000
```

### HTTPS (med Let's Encrypt)
```bash
# Installer certbot
sudo apt install -y certbot python3-certbot-nginx

# Få SSL-sertifikat
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Legg til: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📞 Support

### Loggfiler
- **Applikasjon:** `console.log` output
- **System (Linux):** `/var/log/syslog`
- **Systemd:** `journalctl -u regimonitor`

### Vanlige problemer
1. **Port i bruk:** Endre PORT i .env
2. **Node.js ikke funnet:** Sjekk PATH og installasjon
3. **Tillatelser:** Sjekk filrettigheter og bruker
4. **API-feil:** Verifiser nettverkstilgang og API-nøkler

### Få hjelp
- **GitHub Issues:** [Rapporter bugs](https://github.com/your-username/regimonitor/issues)
- **Dokumentasjon:** Se `docs/` mappen
- **Logs:** Inkluder alltid relevante loggmeldinger