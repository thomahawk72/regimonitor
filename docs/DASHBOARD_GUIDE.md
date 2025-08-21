# RegiMonitor Dashboard - Brukerveiledning

## 📊 Oversikt

RegiMonitor Dashboard er et sanntids-overvåkingssystem for streaming og nettverkskvalitet. Dashboardet viser fire hovedpaneler som hver overvåker kritiske aspekter av streaming-oppsettet ditt.

## 🎛️ Paneler

### 1. 🎯 Destinasjoner Panel
**Hva det viser:**
- Re-stream destinasjoner konfigurert i api.video
- Navn på hver destinasjon (f.eks. "YouTube", "Facebook")
- Status: Aktiv (grønn), Inaktiv (grå), eller Feil (rød)

**Datakilder:**
- api.video API via `/api/restream/destinations`
- Oppdateres hver 15. sekund

**Tolkning:**
- **Grønn:** Destinasjoner er konfigurert og tilgjengelige
- **Grå:** Ingen destinasjoner funnet
- **Rød:** Feil ved henting av destinasjonsdata

### 2. 📡 Broadcast Panel
**Hva det viser:**
- Status på live streaming via api.video
- Om sendingen er aktiv eller ikke

**Datakilder:**
- api.video API via `/api/broadcast/status`
- Oppdateres hver 15. sekund

**Tolkning:**
- **"LIVE"** (rød): Stream er aktiv
- **"OFFLINE"** (grå): Stream er ikke aktiv
- **"FEIL"** (rød): Kunne ikke hente broadcast-status

### 3. 🌐 Kvalitet Panel
**Hva det viser:**
- **Ping:** Nettverkslatens til streaming-server (ms)
- **Jitter:** Variasjon i ping over tid (ms, glidende gjennomsnitt)
- **Trafikklys:** Visuell kvalitetsindikator
- **Status:** UTMERKET, BRA, DÅRLIG, eller FEIL

**Datakilder:**
- ICMP ping til konfigurerbar server (standard: google.com)
- Oppdateres hver 5. sekund
- Bruker 45-sekunders glidende gjennomsnitt for jitter

**Terskelverdier:**
- 🟢 **UTMERKET:** Ping < 50ms OG Jitter < 10ms
- 🟡 **BRA:** Ping 50-100ms ELLER Jitter 10-30ms
- 🟠 **DÅRLIG:** Ping 100-200ms ELLER Jitter 30-50ms
- 🔴 **KRITISK:** Ping > 200ms ELLER Jitter > 50ms

**Viktig:** Systemet bruker "verste-case"-logikk - hvis enten ping eller jitter er dårlig, blir hele kvaliteten dårlig.

### 4. 🔗 Nettverk Panel
**Hva det viser:**
- **Status:** Tilkoblingsstatus
- **Type:** Tilkoblingstype (5G, LAN, WiFi)
- **ISP:** Internet Service Provider
- **IP:** Offentlig IP-adresse

**Datakilder:**
- ip-api.com for IP-informasjon
- Automatisk deteksjon av tilkoblingstype basert på ISP
- Oppdateres hver 30. sekund

**Tolkning:**
- **Grønn:** Stabil nettverkstilkobling
- **Rød:** Feil ved henting av nettverksdata

## ⚙️ Konfigurasjon og Settings

### Miljøvariabler (.env fil)

```bash
# Server konfigurasjon
PORT=3000
NODE_ENV=development

# Polling intervaller (sekunder)
NETWORK_INTERVAL=30
BROADCAST_INTERVAL=15
QUALITY_INTERVAL=5

# API konfigurasjoner
IP_API_URL=http://ip-api.com/json

# Kvalitetsterskler
QUALITY_PING_EXCELLENT_MAX=50
QUALITY_PING_GOOD_MAX=100
QUALITY_PING_POOR_MAX=200
QUALITY_JITTER_EXCELLENT_MAX=10
QUALITY_JITTER_GOOD_MAX=30
QUALITY_JITTER_POOR_MAX=50

# Kvalitetsovervåking
QUALITY_PING_INTERVAL_SECONDS=5
QUALITY_JITTER_WINDOW_SECONDS=45
QUALITY_CONSECUTIVE_THRESHOLD_COUNT=3
QUALITY_JITTER_SAMPLES_PER_MEASUREMENT=5
QUALITY_PING_SERVER=google.com

# api.video konfigurasjon
API_VIDEO_API_KEY=your_api_key_here
API_VIDEO_STREAM_ID=your_stream_id_here
API_VIDEO_ENVIRONMENT=sandbox
```

### Tilpasbare innstillinger

#### 1. Ping Server
**Standard:** google.com
**Alternativ:** 8.8.8.8, cloudflare.com, sandbox.api.video
```bash
QUALITY_PING_SERVER=8.8.8.8
```

#### 2. Kvalitetsterskler
Juster terskelverdiene basert på dine behov:
```bash
# Strengere krav
QUALITY_PING_EXCELLENT_MAX=30
QUALITY_JITTER_EXCELLENT_MAX=5

# Mildere krav
QUALITY_PING_GOOD_MAX=150
QUALITY_JITTER_GOOD_MAX=40
```

#### 3. Polling-frekvens
```bash
# Raskere oppdateringer (mer CPU-bruk)
QUALITY_INTERVAL=2
BROADCAST_INTERVAL=10

# Langsommere oppdateringer (mindre CPU-bruk)
QUALITY_INTERVAL=10
BROADCAST_INTERVAL=30
```

#### 4. Jitter-analyse
```bash
# Kortere glidende gjennomsnitt (mer responsiv)
QUALITY_JITTER_WINDOW_SECONDS=30

# Lengre glidende gjennomsnitt (mer stabil)
QUALITY_JITTER_WINDOW_SECONDS=60
```

## 🚨 Feilsøking

### Panelet viser "FEIL"
1. **Sjekk nettverkstilkobling**
2. **Verifiser API-nøkler** (for broadcast/restream)
3. **Se server-logger** for detaljerte feilmeldinger
4. **Test API-endepunkter manuelt:**
   ```bash
   curl http://localhost:3000/api/quality/network
   curl http://localhost:3000/api/broadcast/status
   ```

### Kvalitetspanel viser feil verdier
1. **Sjekk ping-server tilgjengelighet:**
   ```bash
   ping -c 5 google.com
   ```
2. **Verifiser at ICMP er tillatt** på nettverket
3. **Prøv alternativ ping-server** i .env

### Restream-panel er tomt
1. **Verifiser api.video-konfigurasjon**
2. **Sjekk at stream har konfigurerte destinasjoner**
3. **Test API-nøkkel:**
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://sandbox.api.video/live-streams/YOUR_STREAM_ID
   ```

## 📱 Brukertips

### Optimal visning
- **Anbefalt oppløsning:** 1920x1080 eller høyere
- **Browser:** Chrome, Firefox, Safari (moderne versjoner)
- **Fullskjerm:** F11 for best opplevelse

### Overvåking av streaming
1. **Start stream først** - så åpne dashboard
2. **Følg med på kvalitetspanel** under streaming
3. **Sjekk destinasjoner** før viktige sendinger
4. **Bruk trafikklys** som rask kvalitetsindikator

### Ytelse
- Dashboard bruker ~5-10 MB RAM
- Nettverkstrafikk: ~1 KB/sekund
- CPU-bruk: Minimal (< 1%)

## 🔧 Avanserte innstillinger

### Custom CSS styling
Rediger `/frontend/public/index.html` for å tilpasse utseende:
```css
:root {
    --excellent-color: #00ff88;
    --good-color: #ffd700;
    --poor-color: #ff8c00;
    --critical-color: #ff4757;
}
```

### Egne API-endepunkter
Utvid systemet ved å legge til nye routes i `/backend/routes/`:
```javascript
// customRoutes.js
router.get('/custom', (req, res) => {
    // Din custom logikk her
});
```

## 📊 API-dokumentasjon

Se [API_REFERENCE.md](API_REFERENCE.md) for fullstendig API-dokumentasjon.