# RegiMonitor - Detaljert Dokumentasjon

## 📋 Innhold
- [Backend API](#backend-api)
- [Frontend Dashboard](#frontend-dashboard)
- [Prosjektstruktur](#prosjektstruktur)
- [Utvikling](#utvikling)
- [Deployment](#deployment)

## 🔧 Backend API

### Teknisk Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS, JSON parsing, static file serving
- **Port**: 3000 (konfigurerbar via `process.env.PORT`)

### API Endepunkter

#### Health Service
```http
GET /api/health
```

**Respons:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-11T13:38:00.277Z",
  "uptime": 1.62890625,
  "environment": "development",
  "platform": "darwin",
  "arch": "arm64",
  "nodeVersion": "v24.3.0"
}
```

#### API Informasjon
```http
GET /api
```

**Respons:**
```json
{
  "message": "RegiMonitor API er aktiv",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "root": "/api"
  }
}
```

### Server Konfigurasjon
- CORS aktivert for cross-origin requests
- Statisk fil serving for frontend
- JSON parsing middleware
- Automatisk port-konfigurasjon for Heroku

## 🎨 Frontend Dashboard

### Teknisk Stack
- **HTML5**: Semantisk markup
- **CSS3**: Moderne styling med flexbox og grid
- **JavaScript**: Vanilla JS med async/await
- **Responsivt Design**: Fungerer på alle skjermstørrelser

### Funksjonalitet
- **Automatisk oppdatering**: Hver 30. sekund
- **Manuell oppdatering**: Knapp for umiddelbar oppdatering
- **Real-time data**: Viser live system status
- **Feilhåndtering**: Viser feilmeldinger på en brukervennlig måte

### Komponenter
- **Header**: Prosjektnavn og beskrivelse
- **Health Card**: Hovedkomponent for system status
- **Status Indicator**: Animerte status-indikatorer
- **Detail Grid**: Responsivt grid for system informasjon
- **Refresh Button**: Manuell oppdateringsknapp

## 🏗️ Prosjektstruktur

### Backend (`/backend`)
```
backend/
├── server.js          # Express server hovedfil
├── package.json       # Backend avhengigheter
└── node_modules/      # Installerte pakker
```

### Frontend (`/frontend`)
```
frontend/
├── public/            # Statiske filer
│   └── index.html     # Hoveddashboard
└── package.json       # Frontend metadata
```

### Dokumentasjon (`/docs`)
```
docs/
└── README.md          # Denne filen
```

## 🚀 Utvikling

### Lokal utvikling
1. **Start backend**: `npm run dev` (fra root)
2. **Frontend**: Automatisk tilgjengelig på http://localhost:3000
3. **API testing**: Test endepunkter med curl eller Postman

### Hot Reload
- Backend: Nodemon for automatisk restart ved endringer
- Frontend: Manuell refresh eller automatisk hver 30. sekund

### Debugging
- Backend: Console.log i server.js
- Frontend: Browser Developer Tools
- API: Test endepunkter direkte med HTTP-klienter

## 🌐 Deployment

### Heroku
- Backend: Deploy som Node.js app
- Frontend: Kan deployes separat eller som statiske filer
- Miljøvariabler: `PORT` settes automatisk av Heroku

### Andre plattformer
- **Vercel**: Frontend deployment
- **Netlify**: Frontend hosting
- **DigitalOcean**: Backend VPS
- **AWS**: Elastic Beanstalk eller EC2

### Miljøvariabler
```bash
PORT=3000              # Server port
NODE_ENV=production    # Miljø (development/production)
```

## 📊 Overvåking og Logging

### Health Checks
- Automatisk uptime tracking
- Platform informasjon
- Node.js versjon
- Miljø informasjon

### Fremtidige forbedringer
- Logging til filer
- Metrics collection
- Alerting system
- Database integrasjon

## 🔒 Sikkerhet

### Nåværende
- CORS konfigurasjon
- Input validering (grunnleggende)

### Planlagte forbedringer
- Rate limiting
- API autentisering
- HTTPS enforcement
- Input sanitization 