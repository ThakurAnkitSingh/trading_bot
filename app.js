const express = require('express');
const app = express();
const knex = require('knex')(require('./knexfile'));
require('dotenv').config();

// Import controllers
const tradingController = require('./controllers/tradingBotController');
const healthController = require('./controllers/healthController');

// Middleware for JSON parsing
app.use(express.json());

// Trading routes
app.get('/start', tradingController.startBot);
app.get('/stop', tradingController.stopBot);
app.get('/status', tradingController.getStatus);

// Health routes
app.get('/health', healthController.getHealth);
app.get('/metrics', healthController.getDetailedMetrics);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await knex.migrate.latest();
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Starting graceful shutdown...');
    // Add cleanup logic here
    process.exit(0);
});