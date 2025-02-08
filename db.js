const knex = require('knex')(require('./knexfile')); // Import Knex instance
const logger = require('./utils/logger');

// Save a trade to the database
const saveTrade = async (trade) => {
    try {
        const [id] = await knex('trades')
            .insert({
                type: trade.type,
                time: trade.time,
                price: trade.price,
                quantity: trade.quantity,
                profit: trade.profit || null
            })
            .timeout(5000); // Add timeout

        logger.info(`Trade saved successfully`, { tradeId: id, ...trade });
        return id;
    } catch (err) {
        logger.error('Database error while saving trade:', err);
        throw new Error('Failed to save trade to database');
    }
};

// Retrieve all trades from the database
const getAllTrades = async () => {
    try {
        const trades = await knex('trades').select('*');
        return trades;
    } catch (err) {
        console.error('Error retrieving trades:', err);
        return [];
    }
};

module.exports = {
    saveTrade,
    getAllTrades
};
