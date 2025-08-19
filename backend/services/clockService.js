class ClockService {
    constructor() {
        this.timezone = 'Europe/Oslo';
    }

    getCurrentTime() {
        const now = new Date();
        
        return {
            timestamp: now.toISOString(),
            localTime: now.toLocaleTimeString('nb-NO', {
                timeZone: this.timezone,
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            localDate: now.toLocaleDateString('nb-NO', {
                timeZone: this.timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            timezone: this.timezone,
            unixTimestamp: Math.floor(now.getTime() / 1000),
            serverUptime: process.uptime()
        };
    }

    getTimeStatus() {
        const time = this.getCurrentTime();
        const hour = new Date().getHours();
        
        let status = 'NORMAL';
        let statusColor = 'green';
        
        // Definer arbeidstid (8:00 - 17:00)
        if (hour >= 8 && hour < 17) {
            status = 'ARBEIDSTID';
            statusColor = 'blue';
        } else if (hour >= 17 && hour < 22) {
            status = 'KVELD';
            statusColor = 'orange';
        } else {
            status = 'NATT';
            statusColor = 'purple';
        }
        
        return {
            ...time,
            status,
            statusColor,
            isWorkingHours: hour >= 8 && hour < 17
        };
    }
}

module.exports = new ClockService(); 