const knex = require('knex')(require('./knexfile')); // Import Knex instance

// Save a trade to the database
const saveTrade = async (trade) => {
    try {
        const [id] = await knex('trades').insert({
            type: trade.type,
            time: trade.time,
            price: trade.price,
            quantity: trade.quantity,
            profit: trade.profit || null
        });
        console.log('Trade saved with ID:', id);
    } catch (err) {
        console.error('Error saving trade:', err);
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
