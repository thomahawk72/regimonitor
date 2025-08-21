const express = require('express');
const router = express.Router();
const restreamService = require('../services/restreamService');

// GET /api/restream/destinations - Hent re-stream destinasjoner
router.get('/destinations', async (req, res) => {
    try {
        const restreamData = await restreamService.getRestreams();
        
        res.json({
            success: true,
            data: restreamData,
            message: 'Re-stream destinasjoner hentet'
        });
    } catch (error) {
        console.error('Feil ved henting av re-stream destinasjoner:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke hente re-stream destinasjoner'
        });
    }
});

// GET /api/restream - Generell info om re-stream tjenesten
router.get('/', (req, res) => {
    res.json({
        message: 'RegiMonitor Restream API er aktiv',
        version: '1.0.0',
        endpoints: {
            destinations: '/api/restream/destinations',
            root: '/api/restream'
        },
        description: 'API for overvåkning av re-stream destinasjoner til api.video'
    });
});

module.exports = router;