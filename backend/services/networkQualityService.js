const config = require('../config/config');
const https = require('https');
const { performance } = require('perf_hooks');
const ping = require('ping');

class NetworkQualityService {
    constructor() {
        this.lastQuality = null;
        this.lastCheck = null;
        this.cacheTimeout = 10000; // 10 sekunder cache
        
        // Avansert overvåking - glidende gjennomsnitt og consecutive tracking
        this.pingHistory = []; // Lagrer ping-verdier med timestamp
        this.jitterHistory = []; // Lagrer jitter-verdier for glidende gjennomsnitt
        this.consecutiveHighPing = 0; // Teller consecutive high ping
        this.consecutiveHighJitter = 0; // Teller consecutive high jitter
        this.lastPingCheck = null;
        
        // Log konfigurerte terskelverdier ved oppstart
        this.logQualityThresholds();
    }
    
    logQualityThresholds() {
        // Minimal logging - kun ved debug
        if (process.env.DEBUG) {
            const server = config.PING_SERVER;
            console.log(`Kvalitetsmåling: ICMP ping til ${server}`);
        }
    }
    
    // Legg til ping-verdi til historikk og beregn consecutive
    addPingToHistory(ping, timestamp = Date.now()) {
        const monitoring = config.QUALITY_MONITORING;
        const thresholds = config.QUALITY_THRESHOLDS;
        
        // Legg til ny ping-verdi
        this.pingHistory.push({ value: ping, timestamp });
        
        // Fjern gamle verdier (behold kun siste 10 målinger for consecutive tracking)
        this.pingHistory = this.pingHistory.slice(-10);
        
        // Sjekk consecutive high ping
        if (ping > thresholds.PING.POOR_MAX) {
            this.consecutiveHighPing++;
        } else {
            this.consecutiveHighPing = 0;
        }
        
        return {
            isConsecutiveAlert: this.consecutiveHighPing >= monitoring.CONSECUTIVE_THRESHOLD_COUNT,
            consecutiveCount: this.consecutiveHighPing
        };
    }
    
    // Legg til jitter-verdi til glidende gjennomsnitt
    addJitterToHistory(jitter, timestamp = Date.now()) {
        const monitoring = config.QUALITY_MONITORING;
        const windowMs = monitoring.JITTER_WINDOW_SECONDS * 1000;
        
        // Legg til ny jitter-verdi
        this.jitterHistory.push({ value: jitter, timestamp });
        
        // Fjern verdier eldre enn vinduet
        const cutoff = timestamp - windowMs;
        this.jitterHistory = this.jitterHistory.filter(entry => entry.timestamp > cutoff);
        
        // Beregn glidende gjennomsnitt
        const slidingAverage = this.jitterHistory.length > 0
            ? this.jitterHistory.reduce((sum, entry) => sum + entry.value, 0) / this.jitterHistory.length
            : jitter;
        
        return {
            currentJitter: jitter,
            slidingAverage: Math.round(slidingAverage * 100) / 100,
            sampleCount: this.jitterHistory.length
        };
    }
    
    // Sjekk om det er tid for ny ping-måling (basert på konfigurerbart intervall)
    shouldMeasurePing() {
        const monitoring = config.QUALITY_MONITORING;
        const intervalMs = monitoring.PING_INTERVAL_SECONDS * 1000;
        
        if (!this.lastPingCheck) {
            this.lastPingCheck = Date.now();
            return true;
        }
        
        const timeSinceLastCheck = Date.now() - this.lastPingCheck;
        if (timeSinceLastCheck >= intervalMs) {
            this.lastPingCheck = Date.now();
            return true;
        }
        
        return false;
    }

    async measurePing(hostname) {
        try {
            // Bruk ICMP ping for ekte nettverkslatens
            const res = await ping.promise.probe(hostname, {
                timeout: 5,
                extra: ['-c', '1'], // Send kun 1 pakke
            });
            
            if (res.alive) {
                // Konverter til millisekunder og rund av
                const pingTime = parseFloat(res.time);
                return Math.round(pingTime);
            } else {
                throw new Error(`Host ${hostname} er ikke tilgjengelig`);
            }
        } catch (error) {
            throw new Error(`ICMP ping til ${hostname} feilet: ${error.message}`);
        }
    }
    


    async measureJitter(hostname) {
        try {
            const monitoring = config.QUALITY_MONITORING;
            const samples = monitoring.JITTER_SAMPLES_PER_MEASUREMENT;
            const pings = [];
            
            // Utfør flere ping-målinger mot samme server
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
                samples: pings,
                server: hostname
            };
        } catch (error) {
            throw new Error(`Jitter-måling til ${hostname} feilet: ${error.message}`);
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

    determineQuality(ping, jitter, options = {}) {
        // Hent konfigurerbare terskelverdier fra config
        const thresholds = config.QUALITY_THRESHOLDS;
        const timestamp = Date.now();
        
        // Legg til verdier til historikk og få tilbake analyse
        const pingAnalysis = this.addPingToHistory(ping, timestamp);
        const jitterAnalysis = this.addJitterToHistory(jitter, timestamp);
        
        // Bruk glidende gjennomsnitt for jitter-evaluering
        const effectiveJitter = jitterAnalysis.slidingAverage;
        
        // Kvalitetsvurdering basert på ping og glidende jitter
        let quality = 'excellent';
        let alerts = [];
        
        // Sjekk for consecutive ping-problemer
        if (pingAnalysis.isConsecutiveAlert) {
            alerts.push(`⚠️ ${pingAnalysis.consecutiveCount} påfølgende høye ping-verdier`);
        }
        
        // 🔴 KRITISK kvalitet hvis:
        // Ping > POOR_MAX ms ELLER glidende jitter > POOR_MAX ms
        // ELLER consecutive threshold nådd
        if (ping > thresholds.PING.POOR_MAX || 
            effectiveJitter > thresholds.JITTER.POOR_MAX ||
            pingAnalysis.isConsecutiveAlert) {
            quality = 'critical';
        }
        // 🟠 DÅRLIG kvalitet hvis:
        // Ping GOOD_MAX-POOR_MAX ms ELLER glidende jitter GOOD_MAX-POOR_MAX ms
        else if ((ping > thresholds.PING.GOOD_MAX && ping <= thresholds.PING.POOR_MAX) || 
                 (effectiveJitter >= thresholds.JITTER.GOOD_MAX && effectiveJitter <= thresholds.JITTER.POOR_MAX)) {
            quality = 'poor';
        }
        // 🟡 BRA kvalitet hvis:
        // Ping EXCELLENT_MAX-GOOD_MAX ms ELLER glidende jitter EXCELLENT_MAX-GOOD_MAX ms
        else if ((ping >= thresholds.PING.EXCELLENT_MAX && ping <= thresholds.PING.GOOD_MAX) || 
                 (effectiveJitter >= thresholds.JITTER.EXCELLENT_MAX && effectiveJitter <= thresholds.JITTER.GOOD_MAX)) {
            quality = 'good';
        }
        // 🟢 UTMERKET kvalitet hvis:
        // Ping < EXCELLENT_MAX ms OG glidende jitter < EXCELLENT_MAX ms
        // (Dette er standard-verdien satt på linje 214)
        


        return {
            quality,
            alerts,
            analysis: {
                ping: {
                    current: ping,
                    consecutive: pingAnalysis.consecutiveCount,
                    isAlert: pingAnalysis.isConsecutiveAlert
                },
                jitter: {
                    current: jitter,
                    slidingAverage: effectiveJitter,
                    sampleCount: jitterAnalysis.sampleCount
                }
            }
        };
    }

    getQualityColor(quality) {
        const colors = {
            excellent: '#00ff88',  // Grønn
            good: '#ffaa00',       // Gul  
            poor: '#ff8800',       // Oransje
            critical: '#ff4444'    // Rød
        };
        return colors[quality] || colors.critical;
    }

    getQualityText(quality) {
        const texts = {
            excellent: 'UTMERKET',
            good: 'BRA',
            poor: 'DÅRLIG',
            critical: 'KRITISK'
        };
        return texts[quality] || texts.critical;
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

            // Utfør målinger mot konfigurert server
            const hostname = config.PING_SERVER;
            const jitterResult = await this.measureJitter(hostname);

            const ping = jitterResult.averagePing;
            const jitter = jitterResult.jitter;
            const qualityResult = this.determineQuality(ping, jitter);

            const result = {
                ping: ping,
                jitter: jitter,
                quality: qualityResult.quality,
                qualityText: this.getQualityText(qualityResult.quality),
                qualityColor: this.getQualityColor(qualityResult.quality),
                server: hostname,
                timestamp: new Date().toISOString(),
                // Legg til avansert analyse-data
                analysis: qualityResult.analysis,
                alerts: qualityResult.alerts,
                // Legg til glidende jitter for frontend
                slidingJitter: qualityResult.analysis.jitter.slidingAverage
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
                quality: 'critical',
                qualityText: 'FEIL',
                qualityColor: '#ff4444',
                server: config.PING_SERVER,
                error: error.message,
                timestamp: new Date().toISOString(),
                cached: false
            };
        }
    }
}

module.exports = new NetworkQualityService();