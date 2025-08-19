// Konfigurasjon for RegiMonitor backend
module.exports = {
    // ISP-liste for 5G-operatører
    ISP_LIST: [
        'Telenor Mobil',
        'Telia', 
        'Ice',
        'Altibox AS',
        'OneCall',
        'Chilimobil',
        'TalkMore',
        'Phonero'
    ],
    
    // Server konfigurasjon
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    
    // Polling intervaller (i sekunder) - alle fra .env
    POLLING_INTERVALS: {
        CLOCK: process.env.CLOCK_INTERVAL,
        NETWORK: process.env.NETWORK_INTERVAL,
        BROADCAST: process.env.BROADCAST_INTERVAL,
        QUALITY: process.env.QUALITY_INTERVAL,
        SYSTEM: process.env.SYSTEM_INTERVAL
    },
    
    // Eksterne API-er
    IP_API_URL: process.env.IP_API_URL,
    
    // api.video konfigurasjon
    API_VIDEO: {
        API_KEY: process.env.API_VIDEO_API_KEY,
        STREAM_ID: process.env.API_VIDEO_STREAM_ID,
        // Auto-detect environment basert på API-nøkkel, eller bruk eksplisitt setting
        get ENVIRONMENT() {
            if (process.env.API_VIDEO_ENVIRONMENT) {
                return process.env.API_VIDEO_ENVIRONMENT;
            }
            // Auto-detect: Production API-nøkler starter vanligvis annerledes enn sandbox
            // For nå, default til sandbox hvis ikke spesifisert
            return 'sandbox';
        },
        get BASE_URL() {
            return this.ENVIRONMENT === 'production' 
                ? 'https://ws.api.video' 
                : 'https://sandbox.api.video';
        }
    }
};