# RegiMonitor - Installasjonsveiledning

## Systemkrav

- **Node.js:** v18.0.0 eller nyere
- **npm:** v8.0.0 eller nyere
- **RAM:** 512 MB
- **Nettverk:** Internettilkobling
- **Linux:** `iputils-ping` for ICMP-måling

## Installasjon

### 1. Installer Node.js

**macOS (Homebrew):**
```bash
brew install node
```

**Linux (NodeSource):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Klon og installer

```bash
git clone https://github.com/your-username/regimonitor.git
cd regimonitor
npm run install:all
```

### 3. Konfigurer

```bash
cp .env.example .env
nano .env
```

Påkrevde variabler for webhook:
```bash
WEBHOOK_METRICS_URL=https://din-webhook-url
WEBHOOK_METRICS_API_KEY=din-api-nøkkel
```

### 4. Start

```bash
npm start
```

### 5. Verifiser

```bash
curl http://localhost:3000/api/health
```

## Systemd (Linux)

```ini
[Unit]
Description=RegiMonitor - datainnsamling og webhook
After=network.target

[Service]
Type=simple
User=regimonitor
WorkingDirectory=/path/to/regimonitor
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable regimonitor
sudo systemctl start regimonitor
```

## Raspberry Pi

Bruk Linux-installasjonen over. Raspberry Pi OS er Debian-basert.

```bash
sudo apt install -y iputils-ping
```

## Docker

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
