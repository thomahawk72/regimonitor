// Last .env-fil fra root-mappen
require('dotenv').config({ path: '../.env' });

const express = require('express');
const config = require('./config/config');
const networkQualityService = require('./services/networkQualityService');

const app = express();
const PORT = config.PORT;

// Middleware
app.use(express.json());

// Health check endpoint (for overvåking/systemd)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'RegiMonitor - datainnsamling og webhook',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      root: '/api'
    }
  });
});

// Start bakgrunnsjobb: samler nettverksdata og sender til webhook
function startBackgroundJobs() {
  const intervalMs = config.POLLING_INTERVALS.QUALITY * 1000;
  console.log(`⏱️ Starter datainnsamling hvert ${config.POLLING_INTERVALS.QUALITY} sekund`);

  setInterval(async () => {
    try {
      await networkQualityService.getNetworkQuality();
      if (process.env.DEBUG) {
        console.log('Nettverksmetrikk sendt til webhook');
      }
    } catch (error) {
      console.warn('Feil i datainnsamling:', error.message || error);
    }
  }, intervalMs);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RegiMonitor kjører på port ${PORT}`);
  startBackgroundJobs();
});
