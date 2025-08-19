const config = require('../config/config');
const https = require('https');
const { performance } = require('perf_hooks');

class NetworkQualityService {
    constructor() {
        // Bruk api.video servere for testing
        this.testServers = {
            sandbox: 'sandbox.api.video',
            production: 'ws.api.video'
        };
        this.lastQuality = null;
        this.lastCheck = null;
        this.cacheTimeout = 10000; // 10 sekunder cache
    }

    async measurePing(hostname) {
        return new Promise((resolve, reject) => {
            const start = performance.now();
            
            const req = https.request({
                hostname: hostname,
                port: 443,
                path: '/',
                method: 'HEAD',
                timeout: 5000
            }, (res) => {
                const end = performance.now();
                const ping = Math.round(end - start);
                resolve(ping);
            });

            req.on('error', (error) => {
                reject(new Error(`Ping feilet: ${error.message}`));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Ping timeout'));
            });

            req.end();
        });
    }

    async measureJitter(hostname, samples = 5) {
        try {
            const pings = [];
            
            // Utfør flere ping-målinger
            for (let i = 0; i < samples; i++) {
                const ping = await this.measurePing(hostname);
                pings.push(ping);
                
                // Kort pause mellom målinger
                if (i < samples - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            // Beregn jitter (standardavvik)
            const avgPing = pings.reduce((sum, ping) => sum + ping, 0) / pings.length;
            const variance = pings.reduce((sum, ping) => sum + Math.pow(ping - avgPing, 2), 0) / pings.length;
            const jitter = Math.sqrt(variance);

            return {
                averagePing: Math.round(avgPing),
                jitter: Math.round(jitter * 100) / 100,
                samples: pings
            };
        } catch (error) {
            throw new Error(`Jitter-måling feilet: ${error.message}`);
        }
    }

    async measureBandwidth(hostname) {
        return new Promise((resolve, reject) => {
            // Simulert båndbredde-test (enkel HTTP HEAD request timing)
            const start = performance.now();
            let dataReceived = 0;

            const req = https.request({
                hostname: hostname,
                port: 443,
                path: '/',
                method: 'GET',
                timeout: 10000
            }, (res) => {
                res.on('data', (chunk) => {
                    dataReceived += chunk.length;
                });

                res.on('end', () => {
                    const end = performance.now();
                    const durationSeconds = (end - start) / 1000;
                    const bytesPerSecond = dataReceived / durationSeconds;
                    const mbps = (bytesPerSecond * 8) / (1024 * 1024); // Konverter til Mbps
                    
                    resolve(Math.round(mbps * 100) / 100);
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Båndbredde-måling feilet: ${error.message}`));
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Båndbredde-måling timeout'));
            });

            req.end();
        });
    }

    determineQuality(ping, jitter) {
        // Kvalitetsvurdering basert på ping og jitter (uten bitrate)
        let quality = 'excellent';
        
        // 🔴 Rød kvalitet hvis:
        // Ping > 100 ms ELLER Jitter > 50 ms
        if (ping > 100 || jitter > 50) {
            quality = 'poor';
        }
        // 🟡 Gul kvalitet hvis:
        // Ping 50–100 ms ELLER Jitter 30–50 ms
        else if ((ping >= 50 && ping <= 100) || (jitter >= 30 && jitter <= 50)) {
            quality = 'good';
        }
        // 🟢 Grønn kvalitet hvis:
        // Ping < 50 ms OG Jitter < 30 ms
        // (dette er standard hvis ikke de andre kriteriene treffer)
        
        return quality;
    }

    getQualityColor(quality) {
        const colors = {
            excellent: '#00ff88',
            good: '#ffaa00',
            poor: '#ff4444'
        };
        return colors[quality] || colors.poor;
    }

    getQualityText(quality) {
        const texts = {
            excellent: 'UTMERKET',
            good: 'BRA',
            poor: 'DÅRLIG'
        };
        return texts[quality] || texts.poor;
    }

    async getNetworkQuality() {
        try {
            // Sjekk cache
            const now = Date.now();
            if (this.lastQuality && this.lastCheck && (now - this.lastCheck) < this.cacheTimeout) {
                return {
                    ...this.lastQuality,
                    cached: true
                };
            }

            // Velg server basert på api.video miljø
            const environment = config.API_VIDEO.ENVIRONMENT;
            const hostname = this.testServers[environment] || this.testServers.sandbox;

            // Utfør målinger (kun jitter som inkluderer ping)
            const jitterResult = await this.measureJitter(hostname);

            const ping = jitterResult.averagePing;
            const jitter = jitterResult.jitter;
            const quality = this.determineQuality(ping, jitter);

            const result = {
                ping: ping,
                jitter: jitter,
                quality: quality,
                qualityText: this.getQualityText(quality),
                qualityColor: this.getQualityColor(quality),
                server: hostname,
                environment: environment,
                timestamp: new Date().toISOString()
            };

            // Cache resultatet
            this.lastQuality = result;
            this.lastCheck = now;

            return {
                ...result,
                cached: false
            };

        } catch (error) {
            // Returner cache hvis tilgjengelig ved feil
            if (this.lastQuality) {
                return {
                    ...this.lastQuality,
                    cached: true,
                    error: error.message
                };
            }

            // Fallback kvalitet
            return {
                ping: 999,
                jitter: 999,
                quality: 'poor',
                qualityText: 'FEIL',
                qualityColor: '#ff4444',
                server: 'ukjent',
                environment: config.API_VIDEO.ENVIRONMENT,
                error: error.message,
                timestamp: new Date().toISOString(),
                cached: false
            };
        }
    }
}

module.exports = new NetworkQualityService();