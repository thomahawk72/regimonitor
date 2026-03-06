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
    // ISP-liste for 5G-operatører (kommaseparert i .env under ISP)
    ISP_LIST: process.env.ISP
        ? process.env.ISP.split(',').map(s => s.trim()).filter(Boolean)
        : ['Telenor Mobil', 'Telia', 'Ice', 'Altibox AS', 'OneCall', 'Chilimobil', 'TalkMore', 'Phonero'],
    
    // Server konfigurasjon
    PORT: parseInt(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Intervall for datainnsamling og webhook (sekunder)
    POLLING_INTERVALS: {
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
    
    // Kvalitetsmåling (jitter, consecutive alerts)
    QUALITY_MONITORING: {
        JITTER_WINDOW_SECONDS: parseInt(process.env.QUALITY_JITTER_WINDOW_SECONDS) || 45,
        CONSECUTIVE_THRESHOLD_COUNT: parseInt(process.env.QUALITY_CONSECUTIVE_THRESHOLD_COUNT) || 3,
        JITTER_SAMPLES_PER_MEASUREMENT: parseInt(process.env.QUALITY_JITTER_SAMPLES_PER_MEASUREMENT) || 5
    },
    
    // Ping-server for nettverksmåling
    PING_SERVER: process.env.QUALITY_PING_SERVER || 'google.com',

    // Webhook-konfigurasjon for nettverksmetrikk
    WEBHOOK_METRICS: {
        URL: process.env.WEBHOOK_METRICS_URL || null,
        API_KEY: process.env.WEBHOOK_METRICS_API_KEY || null,
        MIN_INTERVAL_MS: parseInt(process.env.WEBHOOK_METRICS_MIN_INTERVAL_MS) || 7000
    }
};