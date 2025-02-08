const os = require('os');
const knex = require('knex')(require('../knexfile'));
const logger = require('../utils/logger');

class HealthService {
    constructor() {
        this.monitoringInterval = null;
    }

    getCPUUsage() {
        const cpus = os.cpus();
        const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
        const totalTick = cpus.reduce((acc, cpu) =>
            acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0), 0);
        return ((1 - totalIdle / totalTick) * 100).toFixed(2);
    }

    getMemoryUsage() {
        const used = process.memoryUsage().heapUsed;
        const total = os.totalmem();
        return ((used / total) * 100).toFixed(2);
    }

    async recordHealthMetrics(tradingBot) {
        try {
            const metrics = {
                cpu_usage: parseFloat(this.getCPUUsage()),
                memory_usage: parseFloat(this.getMemoryUsage()),
                active_positions: tradingBot.positions.length,
                current_balance: tradingBot.balance,
                status: tradingBot.intervalId ? 'running' : 'stopped',
                last_price: tradingBot.stockPrice,
                error_message: null
            };

            await knex('bot_health').insert(metrics);
            logger.info('Health metrics recorded', metrics);
        } catch (error) {
            logger.error('Failed to record health metrics:', error);
        }
    }

    async getLatestHealth() {
        try {
            const [metrics] = await knex('bot_health')
                .orderBy('timestamp', 'desc')
                .limit(1);

            const healthStatus = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                metrics: metrics || {},
                uptime: process.uptime(),
                version: process.version,
                memoryUsage: {
                    total: os.totalmem(),
                    free: os.freemem(),
                    used: os.totalmem() - os.freemem()
                }
            };

            return healthStatus;
        } catch (error) {
            logger.error('Failed to get health metrics:', error);
            throw error;
        }
    }

    startMonitoring(tradingBot) {
        if (this.monitoringInterval) return;

        this.monitoringInterval = setInterval(() => {
            this.recordHealthMetrics(tradingBot);
        }, 60000); // Record metrics every minute

        logger.info('Health monitoring started');
    }

    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            logger.info('Health monitoring stopped');
        }
    }
}

module.exports = new HealthService(); 