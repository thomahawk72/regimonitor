# RegiMonitor 📊

**Sanntids streaming og nettverksovervåking for RTMP broadcast**

RegiMonitor er et komplett overvåkingssystem som gir deg full kontroll over streaming-kvalitet, nettverksstatus og re-stream destinasjoner. Perfekt for live streaming, broadcast og video-produksjon.

## ✨ Hovedfunksjoner

### 🎯 **Smart Dashboard**
- **4 sanntidspaneler** med automatisk oppdatering
- **Trafikklys-system** for rask kvalitetsvurdering  
- **Responsivt design** som fungerer på alle enheter
- **Minimal ressursbruk** (< 10 MB RAM, < 1% CPU)

### 🌐 **Nettverkskvalitet**
- **ICMP ping-målinger** til konfigurerbar server
- **Jitter-analyse** med glidende gjennomsnitt
- **Intelligente terskelverdier** (UTMERKET/BRA/DÅRLIG)
- **Sanntids-alerting** ved kvalitetsproblemer

### 📡 **Broadcast-overvåking**
- **Live status** fra api.video streaming
- **RTMP-tilkoblingsstatus** og stream-helse
- **HLS playback URLs** for testing
- **Stream key management** (sikkerhet-fokusert)

### 🎛️ **Re-stream destinasjoner**
- **Automatisk oppdaging** av konfigurerte destinasjoner
- **Multi-platform streaming** (YouTube, Facebook, osv.)
- **Destinasjonsstatus** og tilgjengelighetsjekk
- **Sikkerhetsmasking** av sensitive nøkler

### 🔗 **Nettverksinformasjon**
- **ISP-deteksjon** og tilkoblingstype (5G/LAN/WiFi)
- **Geografisk lokasjon** og IP-informasjon
- **Automatisk klassifisering** av mobiloperatører
- **Tilkoblingsstabilitet** og status

## 🏗️ Arkitektur

```
regimonitor/
├── 🔧 backend/              # Express.js API server
│   ├── server.js           # Hovedserver og routing
│   ├── config/             # Konfigurasjon og miljøvariabler
│   ├── routes/             # API-endepunkter (5 moduler)
│   ├── services/           # Forretningslogikk (5 tjenester)
│   └── utils/              # Felles hjelpefunksjoner
├── 🎨 frontend/             # Vanilla JS dashboard  
│   └── public/
│       └── index.html      # Single-page application
├── 📚 docs/                # Omfattende dokumentasjon
│   ├── DASHBOARD_GUIDE.md  # Dashboard brukerveiledning
│   ├── INSTALLATION_GUIDE.md # Steg-for-steg installasjon
│   ├── API_REFERENCE.md    # Fullstendig API-dokumentasjon
│   └── README.md           # Detaljert teknisk dokumentasjon
└── 📦 package.json         # Prosjektmetadata og scripts
```

## 🚀 Kom i gang

### Rask start (5 minutter)
```bash
# 1. Klon prosjekt
git clone https://github.com/your-username/regimonitor.git
cd regimonitor

# 2. Installer alt
npm run install:all

# 3. Konfigurer (valgfritt)
cp .env.example .env
# Rediger .env for api.video integration

# 4. Start systemet
npm start

# 5. Åpne dashboard
open http://localhost:3000
```

### Utviklingsmodus
```bash
# Start med auto-reload
npm run dev

# Eller med detaljert logging
DEBUG=* npm run dev
```

## 📊 Dashboard-paneler

### 🎯 Destinasjoner
Viser re-stream destinasjoner fra api.video
- **Grønn:** Destinasjoner konfigurert og klar
- **Grå:** Ingen destinasjoner funnet  
- **Rød:** API-feil eller tilkoblingsproblem

### 📡 Broadcast  
Live streaming status og RTMP-tilkobling
- **"LIVE" (rød):** Stream er aktiv
- **"OFFLINE" (grå):** Stream er stoppet
- **"FEIL" (rød):** Kan ikke nå streaming-API

### 🌐 Kvalitet
Nettverkskvalitet med ping og jitter
- **🟢 UTMERKET:** Ping < 50ms, Jitter < 10ms
- **🟡 BRA:** Ping 50-100ms eller Jitter 10-30ms  
- **🟠 DÅRLIG:** Ping 100-200ms eller Jitter 30-50ms
- **🔴 KRITISK:** Ping > 200ms eller Jitter > 50ms

### 🔗 Nettverk
ISP, IP og tilkoblingsinformasjon
- **Tilkoblingstype:** 5G, LAN, WiFi
- **ISP-deteksjon:** Automatisk klassifisering
- **Geografisk data:** Land, region, by

## ⚙️ Konfigurasjon

### Miljøvariabler (.env)
```bash
# Server
PORT=3000
NODE_ENV=production

# Polling-intervaller (sekunder)  
QUALITY_INTERVAL=5          # Kvalitetsjekk
BROADCAST_INTERVAL=15       # Broadcast-status
NETWORK_INTERVAL=30         # Nettverksinfo

# Kvalitetsterskler
QUALITY_PING_EXCELLENT_MAX=50
QUALITY_JITTER_EXCELLENT_MAX=10
QUALITY_PING_SERVER=google.com

# api.video integration
API_VIDEO_API_KEY=your_api_key_here
API_VIDEO_STREAM_ID=your_stream_id_here
API_VIDEO_ENVIRONMENT=sandbox
```

### Tilpasbare innstillinger
- **Ping-server:** google.com, 8.8.8.8, cloudflare.com
- **Kvalitetsterskler:** Juster etter dine behov
- **Polling-frekvens:** Balansér ytelse vs. sanntid
- **Jitter-analyse:** Glidende gjennomsnitt-vindu

## 🌐 API-endepunkter

| Endepunkt | Beskrivelse | Oppdateringsfrekvens |
|-----------|-------------|---------------------|
| `/api/quality/network` | Ping og jitter-data | 5 sekunder |
| `/api/broadcast/status` | Live streaming status | 15 sekunder |
| `/api/restream/destinations` | Re-stream destinasjoner | 15 sekunder |
| `/api/network/status` | ISP og IP-informasjon | 30 sekunder |
| `/api/health` | System helsestatus | På forespørsel |
| `/api/config` | Frontend konfigurasjonsdata | På forespørsel |

## 📚 Dokumentasjon

### For brukere
- 📖 **[Dashboard Guide](docs/DASHBOARD_GUIDE.md)** - Komplett brukerveiledning
- 🛠️ **[Installation Guide](docs/INSTALLATION_GUIDE.md)** - Linux og macOS installasjon

### For utviklere  
- 🔧 **[API Reference](docs/API_REFERENCE.md)** - Fullstendig API-dokumentasjon
- 📋 **[Technical Docs](docs/README.md)** - Detaljert teknisk dokumentasjon

## 🔧 Systemkrav

### Minimum
- **Node.js:** v18.0.0+
- **RAM:** 512 MB
- **CPU:** 1 kjerne
- **Nettverk:** Internettilgang for API-kall

### Anbefalt
- **Node.js:** v20.0.0+  
- **RAM:** 1 GB
- **CPU:** 2+ kjerner
- **OS:** macOS 12+, Ubuntu 20.04+, Windows 10+

## 🚨 Feilsøking

### Vanlige problemer
```bash
# Port allerede i bruk
lsof -i :3000
kill -9 <PID>

# Node.js ikke funnet  
node --version
npm --version

# ICMP ping blokkert
ping -c 1 google.com
# Endre QUALITY_PING_SERVER i .env

# API-nøkkel problemer
curl -H "Authorization: Bearer YOUR_KEY" \
     https://sandbox.api.video/live-streams
```

### Logging og debugging
```bash
# Detaljert logging
DEBUG=* npm start

# System-logger (Linux)
journalctl -u regimonitor -f

# Minnebruk
ps aux | grep node
```

## 🛡️ Sikkerhet

- **API-nøkler:** Lagret sikkert i .env
- **Stream keys:** Automatisk maskering i UI
- **CORS:** Konfigurert for sikker cross-origin tilgang
- **Input validering:** Sanitering av brukerdata
- **Rate limiting:** Anbefalt for produksjon

## 📈 Ytelse

### Benchmarks
- **RAM-bruk:** 8-12 MB (stabil)
- **CPU-bruk:** < 1% (normal drift)
- **Nettverkstrafikk:** ~1 KB/sekund
- **Responstid:** < 100ms (lokale API-kall)
- **Oppstartstid:** < 3 sekunder

### Optimalisering
- Justerbar polling-frekvens
- Intelligent caching-strategi
- Minimal DOM-manipulasjon
- Effektiv feilhåndtering

## 🚀 Deployment

### Docker
```bash
docker build -t regimonitor .
docker run -p 3000:3000 --env-file .env regimonitor
```

### Systemd (Linux)
```bash
sudo cp regimonitor.service /etc/systemd/system/
sudo systemctl enable regimonitor
sudo systemctl start regimonitor
```

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## 🤝 Bidrag

Vi ønsker bidrag! Se [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Utviklingsoppsett
```bash
git clone https://github.com/your-username/regimonitor.git
cd regimonitor
npm run install:all
npm run dev
```

## 📄 Lisens

MIT License - se [LICENSE](LICENSE) for detaljer.

## 📞 Support

- **🐛 Bug reports:** [GitHub Issues](https://github.com/your-username/regimonitor/issues)
- **💡 Feature requests:** [GitHub Discussions](https://github.com/your-username/regimonitor/discussions)  
- **📖 Dokumentasjon:** [docs/](docs/) mappen
- **💬 Chat:** [Discord/Slack community]

---

**Laget med ❤️ for streaming-miljøet**

*RegiMonitor - Fordi kvalitet betyr alt i live streaming* 🎥✨ 