const express = require('express');
const router = express.Router();
const networkService = require('../services/networkService');

// GET /api/network - Hent nettverksinfo
router.get('/', async (req, res) => {
    try {
        const networkData = await networkService.getNetworkInfo();
        res.json({
            success: true,
            data: networkData,
            message: 'Nettverksdata hentet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke hente nettverksdata'
        });
    }
});

// GET /api/network/status - Hent nettverk med status
router.get('/status', async (req, res) => {
    try {
        const statusData = await networkService.getNetworkStatus();
        res.json({
            success: true,
            data: statusData,
            message: 'Nettverksstatus hentet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke hente nettverksstatus'
        });
    }
});

// GET /api/network/connection - Kun tilkoblingstype (enkel respons)
router.get('/connection', async (req, res) => {
    try {
        const networkData = await networkService.getNetworkInfo();
        res.json({
            connectionType: networkData.connectionType,
            isp: networkData.isp,
            status: networkData.connectionType === '5G' ? 'Mobil' : 'Fast'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Kunne ikke hente tilkoblingstype',
            connectionType: 'UKJENT'
        });
    }
});

// GET /api/network/test - Test IP API tilkobling
router.get('/test', async (req, res) => {
    try {
        const startTime = Date.now();
        const networkData = await networkService.getNetworkInfo();
        const responseTime = Date.now() - startTime;
        
        res.json({
            success: true,
            data: {
                ...networkData,
                responseTime: `${responseTime}ms`,
                testTime: new Date().toISOString()
            },
            message: 'Nettverkstest fullført'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Nettverkstest feilet'
        });
    }
});

module.exports = router;