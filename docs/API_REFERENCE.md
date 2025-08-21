# RegiMonitor API Reference

## 📋 Oversikt

RegiMonitor API er en RESTful API bygget med Express.js som leverer sanntidsdata for streaming og nettverksovervåking.

**Base URL:** `http://localhost:3000/api`

## 🔗 Endepunkter

### Health & System

#### GET /api/health
Systemets helsestatus og grunnleggende informasjon.

**Respons:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-21T16:46:21.488Z",
  "uptime": 7.005171834,
  "environment": "development",
  "platform": "darwin",
  "arch": "arm64",
  "nodeVersion": "v24.3.0"
}
```

#### GET /api/config
Konfigurasjonsdata for frontend polling.

**Respons:**
```json
{
  "success": true,
  "data": {
    "pollingIntervals": {
      "clock": 30000,
      "network": 30000,
      "broadcast": 15000,
      "quality": 5000,
      "restream": 15000,
      "system": 60000
    }
  },
  "message": "Konfigurasjon hentet"
}
```

### Quality Monitoring

#### GET /api/quality/network
Nettverkskvalitetsdata med ping og jitter-målinger.

**Respons:**
```json
{
  "success": true,
  "data": {
    "ping": 15,
    "jitter": 2.5,
    "slidingJitter": 3.2,
    "quality": "excellent",
    "qualityText": "UTMERKET",
    "qualityColor": "#00ff88",
    "cached": false,
    "analysis": {
      "ping": {
        "current": 15,
        "consecutive": 0,
        "isAlert": false
      },
      "jitter": {
        "current": 2.5,
        "slidingAverage": 3.2,
        "sampleCount": 5
      }
    },
    "alerts": []
  },
  "message": "Nettverkskvalitet hentet"
}
```

**Kvalitetsnivåer:**
- `excellent`: Ping < 50ms OG Jitter < 10ms
- `good`: Ping 50-100ms ELLER Jitter 10-30ms  
- `poor`: Ping 100-200ms ELLER Jitter 30-50ms
- `critical`: Ping > 200ms ELLER Jitter > 50ms

#### GET /api/quality
Generell informasjon om Quality API.

**Respons:**
```json
{
  "message": "RegiMonitor Quality API er aktiv",
  "version": "1.0.0",
  "endpoints": {
    "network": "/api/quality/network",
    "root": "/api/quality"
  },
  "description": "API for overvåkning av nettverkskvalitet mot streaming-servere"
}
```

### Broadcast Monitoring

#### GET /api/broadcast/status
Live streaming status fra api.video.

**Respons (Live):**
```json
{
  "success": true,
  "data": {
    "status": "LIVE",
    "broadcasting": true,
    "streamId": "li3f1hiC9tzUIJ2RCNdzqGir",
    "streamKey": "abc***xyz",
    "rtmpUrl": "rtmp://broadcast.api.video/s/",
    "hlsUrl": "https://vod.api.video/vod/vi4k0jvEUuaTdRAEjQ4Prklg/hls/manifest.m3u8",
    "timestamp": "2025-08-21T16:45:00.000Z",
    "cached": false
  },
  "message": "Broadcast-status hentet"
}
```

**Respons (Offline):**
```json
{
  "success": true,
  "data": {
    "status": "OFFLINE",
    "broadcasting": false,
    "streamId": "li3f1hiC9tzUIJ2RCNdzqGir",
    "timestamp": "2025-08-21T16:45:00.000Z",
    "cached": false
  },
  "message": "Broadcast-status hentet"
}
```

#### GET /api/broadcast/test
Test API-tilkobling til api.video.

**Respons:**
```json
{
  "success": true,
  "data": {
    "connectionTest": "OK",
    "apiResponse": "Tilkobling vellykket",
    "timestamp": "2025-08-21T16:45:00.000Z"
  },
  "message": "API-tilkobling testet"
}
```

#### GET /api/broadcast
Generell informasjon om Broadcast API.

### Restream Destinations

#### GET /api/restream/destinations
Re-stream destinasjoner konfigurert i api.video.

**Respons:**
```json
{
  "success": true,
  "data": {
    "destinations": [
      {
        "name": "YouTube",
        "serverUrl": "rtmp://a.rtmp.youtube.com/live2/",
        "streamKey": "abc***xyz"
      },
      {
        "name": "Facebook",
        "serverUrl": "rtmps://live-api-s.facebook.com:443/rtmp/",
        "streamKey": "def***uvw"
      }
    ],
    "totalCount": 2,
    "streamId": "li3f1hiC9tzUIJ2RCNdzqGir",
    "timestamp": "2025-08-21T16:45:00.000Z",
    "cached": false
  },
  "message": "Re-stream destinasjoner hentet"
}
```

**Merk:** Stream keys er delvis skjult av sikkerhetshensyn.

#### GET /api/restream
Generell informasjon om Restream API.

### Network Information

#### GET /api/network/status
Detaljert nettverksinformasjon og tilkoblingsstatus.

**Respons:**
```json
{
  "success": true,
  "data": {
    "status": "TILKOBLET",
    "connectionType": "5G",
    "ip": "94.142.241.111",
    "isp": "Telenor Mobil",
    "country": "Norway",
    "region": "Oslo",
    "city": "Oslo",
    "timezone": "Europe/Oslo",
    "timestamp": "2025-08-21T16:45:00.000Z",
    "cached": false
  },
  "message": "Nettverksstatus hentet"
}
```

**Tilkoblingstyper:**
- `5G`: Mobilnettverk (5G)
- `LAN`: Kablet nettverk
- `WiFi`: Trådløst nettverk
- `Unknown`: Ukjent tilkoblingstype

#### GET /api/network
Generell informasjon om Network API.

### Clock Service (Legacy)

#### GET /api/clock
Nåværende tid og dato.

**Respons:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-08-21T16:45:00.000Z",
    "localTime": "18:45:00",
    "localDate": "onsdag 21. august 2025",
    "timezone": "Europe/Oslo",
    "unixTimestamp": 1724258700,
    "serverUptime": 3600.5
  },
  "message": "Klokke-data hentet"
}
```

#### GET /api/clock/status
Tid med arbeidstid-status.

**Respons:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2025-08-21T16:45:00.000Z",
    "localTime": "18:45:00",
    "localDate": "onsdag 21. august 2025",
    "timezone": "Europe/Oslo",
    "unixTimestamp": 1724258700,
    "serverUptime": 3600.5,
    "status": "KVELD",
    "statusColor": "orange",
    "isWorkingHours": false
  },
  "message": "Klokke-status hentet"
}
```

**Status-typer:**
- `ARBEIDSTID` (08:00-17:00): Blå
- `KVELD` (17:00-22:00): Oransje  
- `NATT` (22:00-08:00): Lilla

## 🔧 Feilhåndtering

### Standard feilrespons
```json
{
  "success": false,
  "error": "Detaljert feilmelding",
  "message": "Brukervennlig feilmelding"
}
```

### HTTP statuskoder
- `200 OK`: Vellykket forespørsel
- `404 Not Found`: Endepunkt ikke funnet
- `500 Internal Server Error`: Serverfeil
- `503 Service Unavailable`: Tjeneste midlertidig utilgjengelig

### Vanlige feil

#### API-nøkkel mangler
```json
{
  "success": false,
  "error": "API_VIDEO_API_KEY ikke konfigurert for broadcast",
  "message": "Kunne ikke hente broadcast-status"
}
```

#### Nettverksfeil
```json
{
  "success": false,
  "error": "ICMP ping til google.com feilet: Host unreachable",
  "message": "Kunne ikke hente nettverkskvalitet"
}
```

#### Ekstern API utilgjengelig
```json
{
  "success": false,
  "error": "API-feil (404): Stream not found",
  "message": "Kunne ikke hente broadcast-status"
}
```

## 🚀 Rate Limiting

Ingen rate limiting er implementert per nå, men anbefalt polling-frekvens:

- **Quality:** 5-10 sekunder
- **Broadcast:** 10-30 sekunder  
- **Restream:** 15-60 sekunder
- **Network:** 30-300 sekunder

## 📊 Caching

### Cache-strategi
- **Quality:** Ingen caching (sanntidsdata)
- **Broadcast:** 30 sekunder cache
- **Restream:** 30 sekunder cache  
- **Network:** 60 sekunder cache

### Cache-indikatorer
Alle responser inkluderer `cached: boolean` felt som indikerer om data kommer fra cache.

## 🔐 Autentisering

Per nå kreves ingen autentisering for API-tilgang. For produksjon anbefales:

1. **API-nøkler** for ekstern tilgang
2. **JWT tokens** for brukerautentisering  
3. **Rate limiting** per klient
4. **HTTPS** for sikker kommunikasjon

## 📈 Overvåking og logging

### Logging-nivåer
- **Info:** Normale operasjoner
- **Warn:** Potensielle problemer
- **Error:** Feil som krever oppmerksomhet

### Metrics
API-en logger automatisk:
- Response times
- Error rates  
- Cache hit rates
- External API status

## 🔄 Versjonering

Nåværende API-versjon: **v1.0.0**

Fremtidige versjoner vil bruke URL-basert versjonering:
- `/api/v1/quality/network`
- `/api/v2/quality/network`

## 📞 Support

For API-support:
1. Sjekk `/api/health` for systemstatus
2. Se server-logger for detaljerte feilmeldinger
3. Test individuelle endepunkter med curl/Postman
4. Rapporter bugs via GitHub Issues