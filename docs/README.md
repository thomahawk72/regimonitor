# RegiMonitor - Dokumentasjon

## Innhold

- [API Reference](API_REFERENCE.md) – API-endepunkter og webhook-format
- [Installasjonsveiledning](INSTALLATION_GUIDE.md) – Installasjon og deployment

## Prosjektstruktur

```
regimonitor/
├── backend/
│   ├── server.js           # Express-server og bakgrunnsjobb
│   ├── config/             # Konfigurasjon
│   └── services/           # networkService, networkQualityService, webhookService
├── docs/
└── package.json
```

## Flyt

1. Bakgrunnsjobb kjører hvert N sekund (QUALITY_INTERVAL)
2. networkQualityService måler ping og jitter
3. networkService henter ISP fra ip-api.com, bestemmer 5G/LAN
4. webhookService sender metrikker til konfigurert URL
