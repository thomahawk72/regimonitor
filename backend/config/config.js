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
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Polling intervaller (i sekunder)
    POLLING_INTERVALS: {
        CLOCK: process.env.CLOCK_INTERVAL || 1,        // 1 sekund for klokke
        NETWORK: process.env.NETWORK_INTERVAL || 10,   // 10 sekunder for nettverk
        BROADCAST: process.env.BROADCAST_INTERVAL || 2, // 2 sekunder for broadcast
        SYSTEM: process.env.SYSTEM_INTERVAL || 60      // 60 sekunder for system
    },
    
    // Eksterne API-er
    IP_API_URL: 'http://ip-api.com/json',
    
    // api.video konfigurasjon
    API_VIDEO: {
        API_KEY: process.env.API_VIDEO_API_KEY || '',
        STREAM_ID: process.env.API_VIDEO_STREAM_ID || '',
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