# RegiMonitor API Reference

## Oversikt

RegiMonitor er en backend-tjeneste som samler nettverksdata og sender til webhook. API-et eksponerer kun helsesjekk.

**Base URL:** `http://localhost:3000/api`

## Endepunkter

### GET /api/health

Helsesjekk for overvåking og systemd.

**Respons:**
```json
{
  "status": "OK",
  "timestamp": "2025-03-06T12:00:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "platform": "linux",
  "arch": "arm64",
  "nodeVersion": "v20.10.0"
}
```

### GET /api

API-informasjon.

**Respons:**
```json
{
  "message": "RegiMonitor - datainnsamling og webhook",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "root": "/api"
  }
}
```

## Webhook-payload

Tjenesten sender POST til `WEBHOOK_METRICS_URL` med header `X-API-Key`.

**Body:**
```json
{
  "ping": 24,
  "jitter": 2.1,
  "connectionType": "5G",
  "quality": "excellent",
  "timestamp": "2025-03-06T12:00:00.000Z"
}
```

| Felt | Beskrivelse |
|------|-------------|
| ping | Ping-tid i ms |
| jitter | Jitter i ms |
| connectionType | "5G" eller "LAN" (basert på ISP-match) |
| quality | excellent \| good \| poor \| critical |
| timestamp | ISO 8601 |
