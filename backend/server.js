const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Import routes
const clockRoutes = require('./routes/clockRoutes');
const networkRoutes = require('./routes/networkRoutes');
const broadcastRoutes = require('./routes/broadcastRoutes');

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
        clock: config.POLLING_INTERVALS.CLOCK * 1000,      // Konverter til millisekunder
        network: config.POLLING_INTERVALS.NETWORK * 1000,
        broadcast: config.POLLING_INTERVALS.BROADCAST * 1000,
        system: config.POLLING_INTERVALS.SYSTEM * 1000
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
      clock: '/api/clock',
      network: '/api/network',
      broadcast: '/api/broadcast',
      config: '/api/config',
      root: '/api'
    }
  });
});

// Use routes
app.use('/api/clock', clockRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/broadcast', broadcastRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RegiMonitor server kjører på port ${PORT}`);
  console.log(`📊 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
}); 