const express = require('express');
const router = express.Router();
const clockService = require('../services/clockService');

// GET /api/clock - Hent nåværende tid
router.get('/', (req, res) => {
    try {
        const timeData = clockService.getCurrentTime();
        res.json({
            success: true,
            data: timeData,
            message: 'Klokke-data hentet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke hente klokke-data'
        });
    }
});

// GET /api/clock/status - Hent tid med status
router.get('/status', (req, res) => {
    try {
        const statusData = clockService.getTimeStatus();
        res.json({
            success: true,
            data: statusData,
            message: 'Klokke-status hentet'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Kunne ikke hente klokke-status'
        });
    }
});

// GET /api/clock/time - Kun tid (enkel respons)
router.get('/time', (req, res) => {
    try {
        const timeData = clockService.getCurrentTime();
        res.json({
            time: timeData.localTime,
            date: timeData.localDate
        });
    } catch (error) {
        res.status(500).json({
            error: 'Kunne ikke hente tid'
        });
    }
});

module.exports = router; 