const express = require('express');
const router = express.Router();
const restreamService = require('../services/restreamService');
const RouteHelpers = require('../utils/routeHelpers');

// GET /api/restream/destinations - Hent re-stream destinasjoner
router.get('/destinations', RouteHelpers.asyncHandler(
    () => restreamService.getRestreams(),
    'Re-stream destinasjoner hentet',
    'Kunne ikke hente re-stream destinasjoner'
));

// GET /api/restream - Generell info om re-stream tjenesten
router.get('/', RouteHelpers.createInfoEndpoint(
    'Restream',
    '1.0.0',
    {
        destinations: '/api/restream/destinations',
        root: '/api/restream'
    },
    'API for overvåkning av re-stream destinasjoner til api.video'
));

module.exports = router;