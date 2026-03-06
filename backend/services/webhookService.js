const http = require('node:http');
const https = require('node:https');
const config = require('../config/config');

class WebhookService {
    constructor() {
        this.lastMetricsSentAt = null;
    }

    get webhookConfig() {
        return config.WEBHOOK_METRICS || {};
    }

    get minIntervalMs() {
        const cfg = this.webhookConfig;
        return typeof cfg.MIN_INTERVAL_MS === 'number' && !Number.isNaN(cfg.MIN_INTERVAL_MS)
            ? cfg.MIN_INTERVAL_MS
            : 7000;
    }

    canSendMetrics() {
        if (!this.webhookConfig.URL || !this.webhookConfig.API_KEY) {
            return false;
        }

        if (!this.lastMetricsSentAt) {
            return true;
        }

        const elapsed = Date.now() - this.lastMetricsSentAt;
        return elapsed >= this.minIntervalMs;
    }

    async sendMetrics(payload) {
        if (!this.canSendMetrics()) {
            console.warn('Webhook metrics ikke sendt (manglende config eller rate-limit).');
            return {
                success: false,
                skipped: true,
                reason: 'rate_limited_or_missing_config'
            };
        }

        const { URL: urlString, API_KEY } = this.webhookConfig;

        try {
            const url = new URL(urlString);
            const isHttps = url.protocol === 'https:';
            const client = isHttps ? https : http;

            const data = JSON.stringify(payload);

            const options = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + (url.search || ''),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data),
                    'X-API-Key': API_KEY
                },
                timeout: 5000
            };

            this.lastMetricsSentAt = Date.now();

            await new Promise((resolve, reject) => {
                const req = client.request(options, (res) => {
                    let body = '';

                    res.on('data', (chunk) => {
                        body += chunk.toString();
                    });

                    res.on('end', () => {
                        if (res.statusCode && res.statusCode >= 400) {
                            console.warn(
                                'Webhook metrics svarte med feilstatus:',
                                res.statusCode,
                                body || '<tom body>'
                            );
                        } else {
                            console.log(
                                'Webhook metrics sendt OK med status:',
                                res.statusCode
                            );
                        }
                        resolve();
                    });
                });

                req.on('error', (error) => {
                    console.warn('Webhook metrics-kall feilet:', error.message || error);
                    reject(error);
                });

                req.on('timeout', () => {
                    req.destroy();
                    const timeoutError = new Error('Webhook metrics-kall timeout');
                    console.warn(timeoutError.message);
                    reject(timeoutError);
                });

                req.write(data);
                req.end();
            });

            return {
                success: true,
                skipped: false
            };
        } catch (error) {
            console.warn('Webhook metrics-kall kastet feil:', error.message || error);
            return {
                success: false,
                skipped: false,
                error: error.message || String(error)
            };
        }
    }
}

module.exports = new WebhookService();

