// Konfigurasjon for RegiMonitor backend

// Valider kritiske miljøvariabler
function validateEnvironment() {
    const required = ['PORT'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.warn(`⚠️ Manglende miljøvariabler: ${missing.join(', ')}`);
        console.warn('💡 Bruker fallback-verdier. Se .env.example for konfigurasjonsalternativer.');
    }
    
    // Valider PORT
    const port = parseInt(process.env.PORT) || 3000;
    if (port < 1024 || port > 65535) {
        console.warn(`⚠️ Ugyldig PORT: ${port}. Bruker standard: 3000`);
        process.env.PORT = '3000';
    }
}

// Kjør validering
validateEnvironment();

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
    PORT: parseInt(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Polling intervaller (i sekunder) - alle fra .env
    POLLING_INTERVALS: {
        NETWORK: parseInt(process.env.NETWORK_INTERVAL) || 30,
        BROADCAST: parseInt(process.env.BROADCAST_INTERVAL) || 15,
        QUALITY: parseInt(process.env.QUALITY_INTERVAL) || 5
    },
    
    // Eksterne API-er
    IP_API_URL: process.env.IP_API_URL || 'http://ip-api.com/json',
    
    // Quality Thresholds (Kvalitetsterskler)
    QUALITY_THRESHOLDS: {
        PING: {
            EXCELLENT_MAX: parseInt(process.env.QUALITY_PING_EXCELLENT_MAX) || 50,
            GOOD_MAX: parseInt(process.env.QUALITY_PING_GOOD_MAX) || 100,
            POOR_MAX: parseInt(process.env.QUALITY_PING_POOR_MAX) || 200
        },
        JITTER: {
            EXCELLENT_MAX: parseInt(process.env.QUALITY_JITTER_EXCELLENT_MAX) || 10,
            GOOD_MAX: parseInt(process.env.QUALITY_JITTER_GOOD_MAX) || 30,
            POOR_MAX: parseInt(process.env.QUALITY_JITTER_POOR_MAX) || 50
        }
    },
    
    // Advanced Quality Monitoring Settings
    QUALITY_MONITORING: {
        PING_INTERVAL_SECONDS: parseInt(process.env.QUALITY_PING_INTERVAL_SECONDS) || 5,
        JITTER_WINDOW_SECONDS: parseInt(process.env.QUALITY_JITTER_WINDOW_SECONDS) || 45,
        CONSECUTIVE_THRESHOLD_COUNT: parseInt(process.env.QUALITY_CONSECUTIVE_THRESHOLD_COUNT) || 3,
        JITTER_SAMPLES_PER_MEASUREMENT: parseInt(process.env.QUALITY_JITTER_SAMPLES_PER_MEASUREMENT) || 5
    },
    
    // Ping Server Configuration - Standard til api.video for streaming-relevante målinger
    PING_SERVER: process.env.QUALITY_PING_SERVER || 'sandbox.api.video',
    
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