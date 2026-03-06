# RegiMonitor

**Backend-tjeneste som samler nettverksdata og sender til webhook**

RegiMonitor måler nettverkskvalitet (ping, jitter), bestemmer tilkoblingstype (5G/LAN) via ip-api.com, og sender metrikker til en konfigurert webhook. Ingen frontend – kun datainnsamling og webhook.

## Kom i gang

```bash
# 1. Klon og installer
git clone https://github.com/your-username/regimonitor.git
cd regimonitor
npm run install:all

# 2. Konfigurer
cp .env.example .env
# Sett WEBHOOK_METRICS_URL og WEBHOOK_METRICS_API_KEY i .env

# 3. Start
npm start
```

## Konfigurasjon (.env)

| Variabel | Beskrivelse |
|---------|-------------|
| `PORT` | Serverport (default: 3000) |
| `QUALITY_INTERVAL` | Sekunder mellom hver datainnsamling (default: 5) |
| `WEBHOOK_METRICS_URL` | Webhook-URL som mottar metrikker |
| `WEBHOOK_METRICS_API_KEY` | API-nøkkel for webhook-autentisering |
| `ISP` | Kommaseparert liste over 5G-operatører (match mot ip-api.com) |
| `QUALITY_PING_SERVER` | Server for ping-måling (default: google.com) |

## Webhook-payload

Tjenesten sender POST-requester med JSON:

```json
{
  "ping": 24,
  "jitter": 2.1,
  "connectionType": "5G",
  "quality": "excellent",
  "timestamp": "2025-03-06T12:00:00.000Z"
}
```

- **connectionType:** "5G" hvis ISP matcher listen i .env, ellers "LAN"
- **quality:** excellent | good | poor | critical

## API-endepunkter

| Endepunkt | Beskrivelse |
|-----------|-------------|
| `GET /api/health` | Helsesjekk (for overvåking/systemd) |
| `GET /api` | API-info |

## Systemkrav

- Node.js v18+
- Internettilkobling
- ICMP ping tilgjengelig (iputils-ping på Linux)

## Deployment

Se [docs/INSTALLATION_GUIDE.md](docs/INSTALLATION_GUIDE.md) for systemd, Docker og Raspberry Pi.
