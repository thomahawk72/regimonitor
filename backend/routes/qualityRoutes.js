const express = require('express');
const router = express.Router();
const networkQualityService = require('../services/networkQualityService');

// GET /api/quality/network - Hent nettverkskvalitet
router.get('/network', async (req, res) => {
    try {
        const qualityData = await networkQualityService.getNetworkQuality();
        
        res.json({
            success: true,
            data: qualityData,
            message: 'Nettverkskvalitet hentet'
        });
    } catch (error) {
        console.error('Feil ved henting av nettverkskvalitet:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke hente nettverkskvalitet'
        });
    }
});

// GET /api/quality - Generell info om kvalitets-tjenesten
router.get('/', (req, res) => {
    res.json({
        message: 'RegiMonitor Quality API er aktiv',
        version: '1.0.0',
        endpoints: {
            network: '/api/quality/network',
            root: '/api/quality'
        },
        description: 'API for overvåkning av nettverkskvalitet mot streaming-servere'
    });
});

module.exports = router;