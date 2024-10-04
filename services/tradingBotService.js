const { simulateStockPrice } = require('../utils/stockUtils');
const { saveTrade, getAllTrades } = require('../db');

let balance = 10000;
let positions = [];
let profitLoss = 0;
let stockPrice = 100;
let intervalId = null;
let priceHistory = [];
const shortTermPeriod = 5;  // Short-term moving average period
const longTermPeriod = 20;  // Long-term moving average period

// Helper function to calculate moving average
const calculateMovingAverage = (period) => {
    if (priceHistory.length < period) return null;
    const prices = priceHistory.slice(-period); // Get the most recent prices
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / period;
};

const buyStock = (quantity) => {
    const tradeTime = new Date().toISOString();
    positions.push({ price: stockPrice, quantity });
    balance -= stockPrice * quantity;

    const trade = { type: 'buy', time: tradeTime, price: stockPrice, quantity };
    saveTrade(trade);  // Save trade to MySQL
    console.log(`Bought ${quantity} stocks at $${stockPrice}`);
};

const sellStock = () => {
    if (positions.length === 0) return;

    const position = positions.pop();
    const sellPrice = stockPrice;
    const profit = (sellPrice - position.price) * position.quantity;
    balance += sellPrice * position.quantity;
    profitLoss += profit;

    const tradeTime = new Date().toISOString();
    const trade = {
        type: 'sell',
        time: tradeTime,
        price: sellPrice,
        quantity: position.quantity,
        profit: profit.toFixed(2)
    };

    saveTrade(trade);  // Save trade to MySQL
    console.log(`Sold ${position.quantity} stocks at $${sellPrice}. Profit: $${profit.toFixed(2)}`);
};

// Check for moving average crossover signals
const checkMovingAverageCrossover = () => {
    stockPrice = simulateStockPrice(stockPrice); // Simulate stock price
    priceHistory.push(stockPrice); // Add the current price to history

    // Calculate moving averages
    const shortTermMA = calculateMovingAverage(shortTermPeriod);
    const longTermMA = calculateMovingAverage(longTermPeriod);

    if (!shortTermMA || !longTermMA) return; // Not enough data for trading

    console.log(`Short-term MA: ${shortTermMA.toFixed(2)}, Long-term MA: ${longTermMA.toFixed(2)}`);

    if (shortTermMA > longTermMA && positions.length === 0) {
        buyStock(10); // Buy if short-term MA crosses above long-term MA
    } else if (shortTermMA < longTermMA && positions.length > 0) {
        sellStock();  // Sell if short-term MA crosses below long-term MA
    }
};

// Start trading with moving average strategy
const startTradingWithMovingAverages = () => {
    if (intervalId) return;
    intervalId = setInterval(checkMovingAverageCrossover, 1000);
    console.log('Trading bot with Moving Average strategy started.');
};

const stopTrading = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Trading bot stopped.');
    }
};

// Get the bot status with all trades from MySQL
const getBotStatus = async (callback) => {
    try {
        const trades = await getAllTrades();
        callback({
            balance: balance.toFixed(2),
            openPositions: positions.length,
            profitLoss: profitLoss.toFixed(2),
            trades
        });
    } catch (err) {
        console.error('Error getting bot status:', err);
    }
};

module.exports = {
    startTradingWithMovingAverages,
    stopTrading,
    getBotStatus
};
