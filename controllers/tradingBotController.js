const tradingBot = require('../services/tradingBotService');
const logger = require('../utils/logger');

exports.startBot = async (req, res) => {
    try {
        const { strategy = 'MA' } = req.query;

        if (!['MA', 'RSI', 'HYBRID'].includes(strategy)) {
            return res.status(400).json({
                error: 'Invalid trading strategy'
            });
        }

        tradingBot.tradingStrategy = strategy;
        tradingBot.startTrading();

        res.status(200).json({
            message: `Trading bot started with ${strategy} strategy.`
        });
    } catch (error) {
        logger.error('Failed to start bot:', error);
        res.status(500).json({
            error: 'Internal server error while starting bot'
        });
    }
};

exports.stopBot = (req, res) => {
    try {
        tradingBot.stopTrading();
        res.status(200).json({ message: 'Trading bot stopped.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop the bot.' });
    }
};

exports.getStatus = (req, res) => {
    try {
        const status = tradingBot.getBotStatus();
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bot status.' });
    }
};