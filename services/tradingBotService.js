const { simulateStockPrice, calculateRSI } = require('../utils/stockUtils');
const { saveTrade, getAllTrades } = require('../db');
const logger = require('../utils/logger');
const healthService = require('./healthService');

class TradingBot {
    constructor() {
        this.balance = 10000;
        this.positions = [];
        this.profitLoss = 0;
        this.stockPrice = 100;
        this.intervalId = null;
        this.priceHistory = [];
        this.shortTermPeriod = 5;
        this.longTermPeriod = 20;
        this.rsiPeriod = 14;
        this.marketTrend = 0;
        this.tradingStrategy = 'MA'; // Default strategy
    }

    calculateMovingAverage(period) {
        if (this.priceHistory.length < period) return null;
        const prices = this.priceHistory.slice(-period);
        return prices.reduce((acc, price) => acc + price, 0) / period;
    }

    async buyStock(quantity) {
        try {
            if (this.balance < this.stockPrice * quantity) {
                logger.warn('Insufficient funds for purchase');
                return false;
            }

            const tradeTime = new Date().toISOString();
            this.positions.push({
                price: this.stockPrice,
                quantity,
                time: tradeTime
            });
            this.balance -= this.stockPrice * quantity;

            await saveTrade({
                type: 'buy',
                time: tradeTime,
                price: this.stockPrice,
                quantity
            });

            logger.info(`Bought ${quantity} stocks at $${this.stockPrice}`);
            return true;
        } catch (error) {
            logger.error('Buy order failed:', error);
            return false;
        }
    }

    async sellStock() {
        try {
            if (this.positions.length === 0) return false;

            const position = this.positions.pop();
            const profit = (this.stockPrice - position.price) * position.quantity;
            this.balance += this.stockPrice * position.quantity;
            this.profitLoss += profit;

            await saveTrade({
                type: 'sell',
                time: new Date().toISOString(),
                price: this.stockPrice,
                quantity: position.quantity,
                profit: profit.toFixed(2)
            });

            logger.info(`Sold ${position.quantity} stocks at $${this.stockPrice}. Profit: $${profit.toFixed(2)}`);
            return true;
        } catch (error) {
            logger.error('Sell order failed:', error);
            return false;
        }
    }

    // Check for moving average crossover signals
    checkMovingAverageCrossover() {
        this.stockPrice = simulateStockPrice(this.stockPrice, this.marketTrend);
        this.priceHistory.push(this.stockPrice);

        // Calculate moving averages
        const shortTermMA = this.calculateMovingAverage(this.shortTermPeriod);
        const longTermMA = this.calculateMovingAverage(this.longTermPeriod);

        if (!shortTermMA || !longTermMA) return; // Not enough data for trading

        console.log(`Short-term MA: ${shortTermMA.toFixed(2)}, Long-term MA: ${longTermMA.toFixed(2)}`);

        if (shortTermMA > longTermMA && this.positions.length === 0) {
            this.buyStock(10); // Buy if short-term MA crosses above long-term MA
        } else if (shortTermMA < longTermMA && this.positions.length > 0) {
            this.sellStock();  // Sell if short-term MA crosses below long-term MA
        }
    }

    // Start trading with moving average strategy
    startTradingWithMovingAverages() {
        if (this.intervalId) return;
        this.intervalId = setInterval(this.checkMovingAverageCrossover.bind(this), 1000);
        healthService.startMonitoring(this);  // Start health monitoring
        logger.info('Trading bot with Moving Average strategy started.');
    }

    stopTrading() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            healthService.stopMonitoring();  // Stop health monitoring
            logger.info('Trading bot stopped.');
        }
    }

    // Get the bot status with all trades from MySQL
    getBotStatus = async (callback) => {
        try {
            const trades = await getAllTrades();
            callback({
                balance: this.balance.toFixed(2),
                openPositions: this.positions.length,
                profitLoss: this.profitLoss.toFixed(2),
                trades
            });
        } catch (err) {
            console.error('Error getting bot status:', err);
        }
    }

    checkTradingSignals() {
        this.stockPrice = simulateStockPrice(this.stockPrice, this.marketTrend);
        this.priceHistory.push(this.stockPrice);

        // Implement different trading strategies
        switch (this.tradingStrategy) {
            case 'MA':
                this.movingAverageStrategy();
                break;
            case 'RSI':
                this.rsiStrategy();
                break;
            case 'HYBRID':
                this.hybridStrategy();
                break;
        }

        // Update market trend
        this.updateMarketTrend();
    }

    // New method to update market trend
    updateMarketTrend() {
        if (this.priceHistory.length < 10) return;

        const recentPrices = this.priceHistory.slice(-10);
        const priceChange = recentPrices[recentPrices.length - 1] - recentPrices[0];
        this.marketTrend = Math.max(-0.5, Math.min(0.5, priceChange / 10));
    }

    // ... Add new trading strategies ...
}

// Create singleton instance
const tradingBot = new TradingBot();

module.exports = tradingBot;
