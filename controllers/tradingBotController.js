const tradingService = require('../services/tradingBotService');

exports.startBot = (req, res) => {
    try {
        tradingService.startTrading();
        res.status(200).json({ message: 'Trading bot started.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start the bot.' });
    }
};

exports.stopBot = (req, res) => {
    try {
        tradingService.stopTrading();
        res.status(200).json({ message: 'Trading bot stopped.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop the bot.' });
    }
};

exports.getStatus = (req, res) => {
    try {
        const status = tradingService.getBotStatus();
        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bot status.' });
    }
};