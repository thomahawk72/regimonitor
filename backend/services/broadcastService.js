const config = require('../config/config');
const https = require('https');

class BroadcastService {
    constructor() {
        this.apiKey = config.API_VIDEO.API_KEY;
        this.streamId = config.API_VIDEO.STREAM_ID;
        this.baseUrl = config.API_VIDEO.BASE_URL;
        this.environment = config.API_VIDEO.ENVIRONMENT;
        this.lastStatus = null;
        this.lastCheck = null;
        this.cacheTimeout = 30000; // 30 sekunder cache
    }

    async fetchStreamStatus() {
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

    async getBroadcastStatus() {
        try {
            // Sjekk cache
            const now = Date.now();
            if (this.lastStatus && this.lastCheck && (now - this.lastCheck) < this.cacheTimeout) {
                return {
                    ...this.lastStatus,
                    cached: true
                };
            }

            const streamData = await this.fetchStreamStatus();
            
            // Konverter api.video data til vårt format
            const status = this.parseStreamStatus(streamData);
            
            // Cache resultatet
            this.lastStatus = status;
            this.lastCheck = now;
            
            return {
                ...status,
                cached: false
            };
            
        } catch (error) {
            // Returner cache hvis tilgjengelig ved feil
            if (this.lastStatus) {
                return {
                    ...this.lastStatus,
                    cached: true,
                    error: error.message
                };
            }
            
            // Fallback status
            return {
                streamId: this.streamId,
                status: 'FEIL',
                statusText: 'IKKE TILGJENGELIG',
                broadcasting: false,
                streamName: 'Ukjent',
                environment: this.environment,
                error: error.message,
                timestamp: new Date().toISOString(),
                cached: false
            };
        }
    }

    parseStreamStatus(streamData) {
        const broadcasting = streamData.broadcasting || false;
        
        let status = 'OFFLINE';
        let statusText = 'IKKE AKTIV';
        
        if (broadcasting) {
            status = 'LIVE';
            statusText = 'SENDER';
        }
        
        return {
            streamId: streamData.liveStreamId,
            streamKey: streamData.streamKey,
            streamName: streamData.name || 'Ukjent Stream',
            status: status,
            statusText: statusText,
            broadcasting: broadcasting,
            public: streamData.public || false,
            environment: this.environment,
            createdAt: streamData.createdAt,
            updatedAt: streamData.updatedAt,
            assets: streamData.assets || {},
            timestamp: new Date().toISOString()
        };
    }

    // Hjelpemetode for å teste API-tilkobling
    async testConnection() {
        try {
            await this.fetchStreamStatus();
            return { success: true, message: 'API-tilkobling OK' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

module.exports = new BroadcastService();