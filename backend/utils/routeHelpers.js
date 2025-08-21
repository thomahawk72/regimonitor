// Felles utility-funksjoner for routes
class RouteHelpers {
    /**
     * Standard suksess-respons for API-endepunkter
     */
    static success(res, data, message) {
        return res.json({
            success: true,
            data,
            message
        });
    }

    /**
     * Standard feil-respons for API-endepunkter
     */
    static error(res, error, message, statusCode = 500) {
        console.error(`API Error: ${message}`, error);
        return res.status(statusCode).json({
            success: false,
            error: error.message || error,
            message
        });
    }

    /**
     * Async wrapper som automatisk håndterer try/catch og feilrespons
     */
    static asyncHandler(serviceMethod, successMessage, errorMessage) {
        return async (req, res) => {
            try {
                const data = await serviceMethod();
                this.success(res, data, successMessage);
            } catch (error) {
                this.error(res, error, errorMessage);
            }
        };
    }

    /**
     * Sync wrapper som automatisk håndterer try/catch og feilrespons
     */
    static syncHandler(serviceMethod, successMessage, errorMessage) {
        return (req, res) => {
            try {
                const data = serviceMethod();
                this.success(res, data, successMessage);
            } catch (error) {
                this.error(res, error, errorMessage);
            }
        };
    }

    /**
     * Generell info-endpoint for tjenester
     */
    static createInfoEndpoint(serviceName, version, endpoints, description) {
        return (req, res) => {
            res.json({
                message: `RegiMonitor ${serviceName} API er aktiv`,
                version,
                endpoints,
                description
            });
        };
    }
}

module.exports = RouteHelpers;