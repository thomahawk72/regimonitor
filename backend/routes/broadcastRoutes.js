const express = require('express');
const router = express.Router();
const broadcastService = require('../services/broadcastService');

// GET /api/broadcast/status - Hent broadcast-status
router.get('/status', async (req, res) => {
    try {
        const broadcastStatus = await broadcastService.getBroadcastStatus();
        
        res.json({
            success: true,
            data: broadcastStatus,
            message: 'Broadcast-status hentet'
        });
    } catch (error) {
        console.error('Feil ved henting av broadcast-status:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke hente broadcast-status'
        });
    }
});

// GET /api/broadcast/test - Test API-tilkobling
router.get('/test', async (req, res) => {
    try {
        const testResult = await broadcastService.testConnection();
        
        if (testResult.success) {
            res.json({
                success: true,
                message: testResult.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                success: false,
                error: testResult.message,
                message: 'API-tilkoblingstest feilet'
            });
        }
    } catch (error) {
        console.error('Feil ved API-test:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke teste API-tilkobling'
        });
    }
});

// GET /api/broadcast - Generell info om broadcast-tjenesten
router.get('/', (req, res) => {
    res.json({
        message: 'RegiMonitor Broadcast API er aktiv',
        version: '1.0.0',
        endpoints: {
            status: '/api/broadcast/status',
            test: '/api/broadcast/test',
            root: '/api/broadcast'
        },
        description: 'API for overvåkning av api.video live streaming status'
    });
});

module.exports = router;