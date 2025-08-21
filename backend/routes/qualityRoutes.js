const express = require('express');
const router = express.Router();
const networkQualityService = require('../services/networkQualityService');
const RouteHelpers = require('../utils/routeHelpers');

// GET /api/quality/network - Hent nettverkskvalitet
router.get('/network', RouteHelpers.asyncHandler(
    () => networkQualityService.getNetworkQuality(),
    'Nettverkskvalitet hentet',
    'Kunne ikke hente nettverkskvalitet'
));

// GET /api/quality - Generell info om kvalitets-tjenesten
router.get('/', RouteHelpers.createInfoEndpoint(
    'Quality',
    '1.0.0',
    {
        network: '/api/quality/network',
        root: '/api/quality'
    },
    'API for overvåkning av nettverkskvalitet mot streaming-servere'
));

module.exports = router;