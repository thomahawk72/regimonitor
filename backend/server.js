// Last .env-fil fra root-mappen
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Import routes
const networkRoutes = require('./routes/networkRoutes');
const broadcastRoutes = require('./routes/broadcastRoutes');
const qualityRoutes = require('./routes/qualityRoutes');
const restreamRoutes = require('./routes/restreamRoutes');

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version
  };
  
  res.json(healthData);
});

// Config endpoint
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    data: {
      pollingIntervals: {
        network: config.POLLING_INTERVALS.NETWORK * 1000,
        broadcast: config.POLLING_INTERVALS.BROADCAST * 1000,
        quality: config.POLLING_INTERVALS.QUALITY * 1000,
        restream: config.POLLING_INTERVALS.BROADCAST * 1000 // Samme som broadcast
      }
    },
    message: 'Konfigurasjon hentet'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'RegiMonitor API er aktiv',
    version: '1.0.0',
          endpoints: {
        health: '/api/health',
        network: '/api/network',
        broadcast: '/api/broadcast',
        quality: '/api/quality',
        restream: '/api/restream',
        config: '/api/config',
        root: '/api'
      }
  });
});

// Use routes
app.use('/api/network', networkRoutes);
app.use('/api/broadcast', broadcastRoutes);
app.use('/api/quality', qualityRoutes);
app.use('/api/restream', restreamRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RegiMonitor server kjører på port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
}); 