# RegiMonitor

Et komplett system med Node.js backend API og frontend dashboard for overvåking av systemer.

## 🏗️ Prosjektstruktur

```
regimonitor/
├── backend/           # Express API server
│   ├── server.js     # Hovedserver fil
│   ├── package.json  # Backend avhengigheter
│   └── node_modules/ # Backend pakker
├── frontend/          # Frontend dashboard
│   └── public/       # Statiske filer
│       └── index.html # Health service dashboard
├── docs/             # Dokumentasjon
│   └── README.md     # Detaljert dokumentasjon
├── package.json      # Hovedprosjekt fil
└── .gitignore        # Git ignore regler
```

## 🚀 Kom i gang

### 1. Installer alle avhengigheter
```bash
npm run install:all
```

### 2. Start backend serveren
```bash
# Produksjon
npm start

# Utvikling (med auto-reload)
npm run dev
```

### 3. Åpne frontend
Gå til http://localhost:3000 i nettleseren

## 📚 Dokumentasjon

Se [docs/README.md](docs/README.md) for detaljert dokumentasjon av backend API og frontend funksjonalitet.

## 🛠️ Utvikling

- **Backend**: Express.js API med health service
- **Frontend**: Vanilla HTML/CSS/JavaScript dashboard
- **Port**: 3000 (konfigurerbar via miljøvariabler)

## 🌐 Endepunkter

- **Frontend**: http://localhost:3000
- **Health API**: http://localhost:3000/api/health
- **API Info**: http://localhost:3000/api

## 📦 Scripts

- `npm run install:all` - Installer alle avhengigheter
- `npm start` - Start backend server
- `npm run dev` - Start backend i utviklingsmodus
- `npm run clean` - Rydd opp i node_modules 