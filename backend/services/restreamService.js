const config = require('../config/config');
const https = require('https');

class RestreamService {
    constructor() {
        this.apiKey = config.API_VIDEO.API_KEY;
        this.streamId = config.API_VIDEO.STREAM_ID;
        this.baseUrl = config.API_VIDEO.BASE_URL;
        this.environment = config.API_VIDEO.ENVIRONMENT;
        this.lastRestreams = null;
        this.lastCheck = null;
        this.cacheTimeout = 30000; // 30 sekunder cache
    }

    async fetchRestreams() {
        return new Promise((resolve, reject) => {
            if (!this.apiKey) {
                reject(new Error('API_VIDEO_API_KEY ikke konfigurert'));
                return;
            }

            if (!this.streamId) {
                reject(new Error('API_VIDEO_STREAM_ID ikke konfigurert'));
                return;
            }

            const url = `${this.baseUrl}/live-streams/${this.streamId}`;
            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                    'User-Agent': 'RegiMonitor/1.0'
                }
            };

            const req = https.request(url, options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode === 200) {
                            const streamData = JSON.parse(data);
                            resolve(streamData);
                        } else if (res.statusCode === 404) {
                            reject(new Error('Stream ikke funnet - sjekk STREAM_ID'));
                        } else if (res.statusCode === 401) {
                            reject(new Error('Ugyldig API-nøkkel'));
                        } else {
                            reject(new Error(`API-feil: ${res.statusCode} - ${data}`));
                        }
                    } catch (parseError) {
                        reject(new Error(`Kunne ikke parse API-respons: ${parseError.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Nettverksfeil: ${error.message}`));
            });

            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('API-kall timeout'));
            });

            req.end();
        });
    }

    async getRestreams() {
        try {
            // Sjekk cache
            const now = Date.now();
            if (this.lastRestreams && this.lastCheck && (now - this.lastCheck) < this.cacheTimeout) {
                return {
                    ...this.lastRestreams,
                    cached: true
                };
            }

            // Hent stream-data fra api.video
            const streamData = await this.fetchRestreams();
            
            // Ekstraher restreams
            const restreams = streamData.restreams || [];
            
            const result = {
                destinations: restreams.map(restream => ({
                    name: restream.name,
                    serverUrl: restream.serverUrl,
                    streamKey: restream.streamKey ? '***' + restream.streamKey.slice(-4) : 'N/A' // Skjul stream key
                })),
                totalCount: restreams.length,
                streamId: this.streamId,
                timestamp: new Date().toISOString(),
                cached: false
            };

            // Cache resultatet
            this.lastRestreams = result;
            this.lastCheck = now;

            return result;

        } catch (error) {
            // Returner cache hvis tilgjengelig ved feil
            if (this.lastRestreams) {
                return {
                    ...this.lastRestreams,
                    cached: true,
                    error: error.message
                };
            }

            // Fallback data
            return {
                destinations: [],
                totalCount: 0,
                streamId: this.streamId,
                error: error.message,
                timestamp: new Date().toISOString(),
                cached: false
            };
        }
    }
}

module.exports = new RestreamService();