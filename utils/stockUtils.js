// Advanced stock price simulation with trends and volatility
const simulateStockPrice = (currentPrice, trend = 0) => {
    // Base volatility between -1 and +1
    const baseVolatility = (Math.random() - 0.5) * 2;

    // Add market trend influence (-0.5 to 0.5)
    const trendInfluence = trend * (Math.random() * 0.5);

    // Add some randomized market sentiment (-0.3 to 0.3)
    const marketSentiment = (Math.random() - 0.5) * 0.6;

    // Combine all factors
    const priceChange = baseVolatility + trendInfluence + marketSentiment;

    // Ensure price doesn't go below 1
    const newPrice = Math.max(1, currentPrice + priceChange);
    return parseFloat(newPrice.toFixed(2));
};

// Calculate RSI (Relative Strength Index)
const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {
        const difference = prices[i] - prices[i - 1];
        if (difference >= 0) {
            gains += difference;
        } else {
            losses -= difference;
        }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return parseFloat(rsi.toFixed(2));
};

module.exports = {
    simulateStockPrice,
    calculateRSI
};