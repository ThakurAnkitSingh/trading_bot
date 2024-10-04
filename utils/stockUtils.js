// Simulate stock price movement with random fluctuations
const simulateStockPrice = (currentPrice) => {
    const volatility = (Math.random() - 0.5) * 2; // Random volatility between -1 and +1
    return parseFloat((currentPrice + volatility).toFixed(2));  // Keep precision to 2 decimal places
};

module.exports = {
    simulateStockPrice
};