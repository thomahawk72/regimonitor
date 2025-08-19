const config = require('../config/config');
const https = require('https');
const http = require('http');

class NetworkService {
    constructor() {
        this.ispList = config.ISP_LIST;
        this.apiUrl = config.IP_API_URL;
        this.cachedData = null;
        this.lastFetch = null;
        this.cacheTimeout = 60000; // 1 minutt cache
    }

    async fetchIPInfo() {
        try {
            const url = new URL(this.apiUrl);
            const protocol = url.protocol === 'https:' ? https : http;
            
            return new Promise((resolve, reject) => {
                const req = protocol.get(this.apiUrl, (res) => {
                    let data = '';
                    
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    res.on('end', () => {
                        try {
                            const jsonData = JSON.parse(data);
                            resolve(jsonData);
                        } catch (error) {
                            reject(new Error('Kunne ikke parse JSON respons'));
                        }
                    });
                });
                
                req.on('error', (error) => {
                    reject(error);
                });
                
                req.setTimeout(5000, () => {
                    req.destroy();
                    reject(new Error('Timeout ved henting av IP-info'));
                });
            });
        } catch (error) {
            throw new Error(`Feil ved henting av IP-info: ${error.message}`);
        }
    }

    determineConnectionType(isp) {
        if (!isp) return 'UKJENT';
        
        // Sjekk om ISP matcher noen av 5G-operatørene
        const is5G = this.ispList.some(operator => 
            isp.toLowerCase().includes(operator.toLowerCase())
        );
        
        return is5G ? '5G' : 'LAN';
    }

    async getNetworkInfo() {
        const now = Date.now();
        
        // Bruk cache hvis data er nyere enn timeout
        if (this.cachedData && this.lastFetch && (now - this.lastFetch) < this.cacheTimeout) {
            return this.cachedData;
        }
        
        try {
            const ipInfo = await this.fetchIPInfo();
            
            if (ipInfo.status !== 'success') {
                throw new Error('IP API returnerte feil status');
            }
            
            const connectionType = this.determineConnectionType(ipInfo.isp);
            
            const networkData = {
                connectionType,
                isp: ipInfo.isp || 'Ukjent',
                org: ipInfo.org || 'Ukjent',
                country: ipInfo.country || 'Ukjent',
                city: ipInfo.city || 'Ukjent',
                region: ipInfo.regionName || 'Ukjent',
                timezone: ipInfo.timezone || 'Ukjent',
                ip: ipInfo.query || 'Ukjent',
                lat: ipInfo.lat || null,
                lon: ipInfo.lon || null,
                timestamp: new Date().toISOString(),
                cached: false
            };
            
            // Oppdater cache
            this.cachedData = { ...networkData, cached: false };
            this.lastFetch = now;
            
            return networkData;
            
        } catch (error) {
            // Returner cached data hvis tilgjengelig, ellers feil
            if (this.cachedData) {
                return { ...this.cachedData, cached: true, error: error.message };
            }
            
            throw error;
        }
    }

    async getNetworkStatus() {
        try {
            const networkInfo = await this.getNetworkInfo();
            
            let status = 'TILKOBLET';
            let statusColor = 'green';
            let detail = networkInfo.connectionType;
            
            if (networkInfo.cached) {
                status = 'CACHE';
                statusColor = 'yellow';
            }
            
            if (networkInfo.error) {
                status = 'FEIL';
                statusColor = 'red';
                detail = 'INGEN KONTAKT';
            }
            
            return {
                ...networkInfo,
                status,
                statusColor,
                detail,
                isOnline: !networkInfo.error
            };
            
        } catch (error) {
            return {
                connectionType: 'UKJENT',
                isp: 'Ukjent',
                status: 'FEIL',
                statusColor: 'red',
                detail: 'INGEN KONTAKT',
                isOnline: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = new NetworkService();