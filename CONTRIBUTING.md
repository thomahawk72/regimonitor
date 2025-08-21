# Bidrag til RegiMonitor 🤝

Takk for at du vurderer å bidra til RegiMonitor! Dette dokumentet gir retningslinjer for hvordan du kan bidra til prosjektet.

## 📋 Innholdsfortegnelse

- [Kom i gang](#kom-i-gang)
- [Utviklingsoppsett](#utviklingsoppsett)
- [Bidragstyper](#bidragstyper)
- [Koding-standarder](#koding-standarder)
- [Commit-meldinger](#commit-meldinger)
- [Pull Request prosess](#pull-request-prosess)
- [Rapportering av bugs](#rapportering-av-bugs)
- [Kode-stil](#kode-stil)

## 🚀 Kom i gang

1. **Fork** repository-et på GitHub
2. **Klon** din fork lokalt
3. **Opprett** en ny branch for ditt bidrag
4. **Gjør** endringene dine
5. **Test** at alt fungerer
6. **Commit** endringene med beskrivende meldinger
7. **Push** til din fork
8. **Opprett** en Pull Request

## 🛠️ Utviklingsoppsett

### Forutsetninger
- Node.js v18.0.0 eller nyere
- npm v8.0.0 eller nyere
- Git

### Installasjon
```bash
# Klon din fork
git clone https://github.com/your-username/regimonitor.git
cd regimonitor

# Legg til upstream remote
git remote add upstream https://github.com/original-username/regimonitor.git

# Installer avhengigheter
npm run install:all

# Start utviklingsserver
npm run dev
```

### Utviklingsmiljø
```bash
# Start backend i utviklingsmodus (nodemon)
cd backend && npm run dev

# Test API-endepunkter
curl http://localhost:3000/api/health

# Åpne dashboard
open http://localhost:3000
```

## 🎯 Bidragstyper

### 🐛 Bug Fixes
- Fiks kjente bugs listert i Issues
- Rapporter og fiks nye bugs du finner
- Forbedre feilhåndtering

### ✨ Nye funksjoner
- Implementer funksjoner fra roadmap
- Foreslå og implementer nye paneler
- Utvid API med nye endepunkter

### 📚 Dokumentasjon
- Forbedre README og guides
- Legg til kodekommentarer
- Opprett tutorials og eksempler

### 🧪 Testing
- Skriv unit tests
- Legg til integration tests
- Forbedre test coverage

### 🎨 Design og UX
- Forbedre dashboard-design
- Optimalisere responsivt design
- Forbedre tilgjengelighet

## 📝 Koding-standarder

### Backend (Node.js)
```javascript
// Bruk moderne JavaScript (ES6+)
const express = require('express');

// Konsistent feilhåndtering
try {
    const result = await someAsyncOperation();
    return result;
} catch (error) {
    console.error('Beskrivende feilmelding:', error);
    throw error;
}

// Bruk RouteHelpers for konsistente API-responser
router.get('/endpoint', RouteHelpers.asyncHandler(
    () => service.getData(),
    'Suksessmelding',
    'Feilmelding'
));
```

### Frontend (Vanilla JS)
```javascript
// Bruk moderne JavaScript og async/await
async function updatePanel() {
    try {
        const data = await this.fetchData('/api/endpoint');
        DashboardHelpers.updateElement('element-id', data.value);
    } catch (error) {
        console.error('Panel update failed:', error);
        DashboardHelpers.showError('panel', 'element-id', null, 'card-id', 'Feilmelding');
    }
}

// Konsistent DOM-manipulasjon
DashboardHelpers.updateElement('id', 'content');
DashboardHelpers.updateCardClass('card-id', 'new-class');
```

### CSS
```css
/* Bruk konsistente CSS-variabler */
:root {
    --excellent-color: #00ff88;
    --good-color: #ffd700;
    --poor-color: #ff8c00;
    --critical-color: #ff4757;
}

/* Responsivt design */
@media (max-width: 768px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
}
```

## 💬 Commit-meldinger

Bruk konvensjonelle commit-meldinger:

```
type(scope): beskrivelse

[valgfri body]

[valgfri footer]
```

### Typer
- `feat`: Ny funksjon
- `fix`: Bug fix
- `docs`: Dokumentasjonsendringer
- `style`: Formatering, manglende semikolon, etc.
- `refactor`: Koderefaktorering
- `test`: Legge til eller endre tester
- `chore`: Vedlikehold, build-endringer

### Eksempler
```
feat(quality): legg til ICMP ping-støtte

Erstatter HTTP HEAD requests med ICMP ping for mer
nøyaktige nettverksmålinger for streaming.

Closes #123
```

```
fix(frontend): løs trafikklys-bug ved feil kvalitet

Trafikklysene viste ikke riktig farge når kvaliteten
var 'critical'. Fikset mapping i updateTrafficLights().

Fixes #456
```

## 🔄 Pull Request prosess

1. **Synkroniser** med upstream før du starter:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Opprett** en feature branch:
   ```bash
   git checkout -b feature/beskrivende-navn
   ```

3. **Gjør** endringene dine og commit:
   ```bash
   git add .
   git commit -m "feat(scope): beskrivelse"
   ```

4. **Test** at alt fungerer:
   ```bash
   npm start
   # Test manuelt i browser
   # Kjør tester hvis tilgjengelig
   ```

5. **Push** til din fork:
   ```bash
   git push origin feature/beskrivende-navn
   ```

6. **Opprett** Pull Request på GitHub

### PR-sjekkliste
- [ ] Koden følger prosjektets stil-guide
- [ ] Endringene er testet lokalt
- [ ] Dokumentasjon er oppdatert hvis nødvendig
- [ ] Commit-meldinger følger konvensjoner
- [ ] PR-beskrivelsen forklarer endringene

## 🐛 Rapportering av bugs

Bruk GitHub Issues med bug report template:

1. **Beskrivelse** av problemet
2. **Steg** for å reprodusere
3. **Forventet** oppførsel
4. **Faktisk** oppførsel
5. **Miljøinformasjon** (OS, Node.js versjon, etc.)
6. **Screenshots** hvis relevant
7. **Loggfiler** eller feilmeldinger

## 🎨 Kode-stil

### Generelle prinsipper
- **Klarhet over cleverness** - Skriv kode som er lett å forstå
- **Konsistens** - Følg eksisterende mønstre i kodebasen
- **DRY** - Don't Repeat Yourself, bruk hjelpefunksjoner
- **Separation of Concerns** - Hold logikk separert (routes, services, helpers)

### Navngivning
```javascript
// Variabler og funksjoner: camelCase
const networkQuality = await getNetworkQuality();

// Konstanter: UPPER_SNAKE_CASE
const QUALITY_THRESHOLD = 50;

// Klasser: PascalCase
class DashboardHelpers {
    static updateElement(id, content) {
        // ...
    }
}

// Filer: kebab-case
// network-quality-service.js
// dashboard-helpers.js
```

### Kommentarer
```javascript
// Enkle forklaringer for kompleks logikk
const quality = determineQuality(ping, jitter); // Bruker worst-case logikk

/**
 * Beregner nettverkskvalitet basert på ping og jitter
 * @param {number} ping - Ping-tid i millisekunder
 * @param {number} jitter - Jitter i millisekunder
 * @returns {string} Kvalitetsnivå: 'excellent', 'good', 'poor', 'critical'
 */
function determineQuality(ping, jitter) {
    // Implementasjon...
}
```

## 🤔 Spørsmål?

Hvis du har spørsmål eller trenger hjelp:

1. **Sjekk** eksisterende Issues og Discussions
2. **Opprett** en ny Discussion for generelle spørsmål
3. **Opprett** en Issue for spesifikke problemer
4. **Kontakt** maintainers direkte hvis nødvendig

## 🙏 Takk!

Takk for at du bidrar til RegiMonitor! Hvert bidrag, stort eller lite, hjelper til med å gjøre prosjektet bedre for alle.

---

*Dette dokumentet er levende og vil bli oppdatert etter behov. Foreslå gjerne forbedringer!*