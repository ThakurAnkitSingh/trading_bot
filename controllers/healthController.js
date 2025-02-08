const healthService = require('../services/healthService');
const logger = require('../utils/logger');

exports.getHealth = async (req, res) => {
    try {
        const healthStatus = await healthService.getLatestHealth();
        res.status(200).json(healthStatus);
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            error: 'Failed to retrieve health metrics',
            timestamp: new Date().toISOString()
        });
    }
};

exports.getDetailedMetrics = async (req, res) => {
    try {
        const metrics = await healthService.getDetailedMetrics();
        res.status(200).json(metrics);
    } catch (error) {
        logger.error('Failed to retrieve detailed metrics:', error);
        res.status(500).json({ error: 'Failed to retrieve detailed metrics' });
    }
}; 