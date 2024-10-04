const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile'));
require('dotenv').config();


// Import the controller
const tradingController = require('./controllers/tradingBotController');

// Define routes
app.get('/start', tradingController.startBot);
app.get('/stop', tradingController.stopBot);
app.get('/status', tradingController.getStatus);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await knex.migrate.latest();
    console.log(`Server running on port ${PORT}`);
});