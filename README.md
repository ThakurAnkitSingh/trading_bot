# Trading Bot Project

### A basic trading bot built using Node.js and MySQL that simulates stock trades based on a Moving Average Crossover strategy. The bot automatically buys and sells stocks, tracks the balance, and calculates the profit/loss over time.

# Technologies Used

### Node.js: Backend runtime used for the bot and server logic.

### Express.js: Web framework used for handling API routes.

### Knex.js: SQL query builder used for database interactions with MySQL.

### MySQL: Database used to store trades and manage persistent data.

### dotenv: For managing environment variables.

### Postman/Insomnia: For testing the API endpoints (optional)

### Rest API and MVC Architecture - For Code Well Structure and API


# Setup Instructions

## Prerequisites

 ### Before you begin, ensure you have the following installed on your machine:

### Node.js (version 12.x or higher)

### MySQL (version 5.x or higher)

# Installation

## 1. Clone the repository:

### git clone https://github.com/ThakurAnkitSingh/trading_bot.git

### cd trading-bot

## 2. Install dependencies:

### npm install

## 3. Set up the environment variables:

### MYSQL_HOST=localhost

### MYSQL_USER=root

### MYSQL_PASSWORD=yourpassword

### MYSQL_DB=trading_bot

### MYSQL_PORT=3306

### PORT=3000


# 4. Set up the database:

## Create a MySQL database (e.g., trading_bot) and run the Knex migrations to create the required tables:

### npx knex migrate:latest

# 5. Start the application:

### node app.js or npm run dev or npm start



# API Endpoints


## 1. Start the Trading Bot

### Endpoint: GET /start

### Description: Starts the trading bot and begins simulating stock prices based on a moving average strategy. The bot will automatically execute buy and sell trades based on the stock price trends.

### Request: No parameters required.

#### Ex Request: curl -X GET http://localhost:3000/start

### Ex Response : {
###  "message": "Trading bot started."
### }



# 2. Stop the Trading Bot

## Endpoint: GET /stop

### Description: Stops the trading bot and generates a final report showing the bot’s performance during the session, including final balance, profit/loss, and trade history.

### Request: No parameters required.

### Example Request:

#### curl -X GET http://localhost:3000/stop


### Example Response:

#### json
#### {
####  "message": "Trading bot stopped."
#### }

## Example Console Output (Final Trading Report):

### ===== Final Trading Report =====

#### Final Balance: $10050.00
#### Total Profit/Loss: $50.00
#### Total Trades: 2
#### Trade 1: { type: 'buy', time: '2024-10-03T08:00:00Z', price: 99.50, quantity: 10 }
#### Trade 2: { type: 'sell', time: '2024-10-03T08:02:30Z', price: 103.40, quantity: 10, profit: '39.00' }


# 3. Check Bot Status

## Endpoint: GET /status

### Description: Retrieves the current state of the trading bot, including:

#### Current balance
#### Number of open positions
#### Total profit/loss
#### List of all trades made by the bot

### Example Request:

#### curl -X GET http://localhost:3000/status

### Example Response:

 #### {
  #### "balance": "10050.00",
  #### "openPositions": 0,
  #### "profitLoss": "50.00",
   "trades": [
    { "type": "buy", "time": "2024-10-03T08:00:00Z", "price": 99.50, "quantity": 10 },
    { "type": "sell", "time": "2024-10-03T08:02:30Z", "price": 103.40, "quantity": 10, "profit": "39.00" }
  ]
}



# How the Bot Works

### Trading Strategy: The bot uses a Moving Average Crossover strategy to simulate real-time stock trading.

### Short-term Moving Average: Calculated over the last 5 stock prices.

### Long-term Moving Average: Calculated over the last 20 stock prices.

### The bot buys stocks when the short-term average crosses above the long-term average and sells when the short-term crosses below.

### Price Simulation: The bot simulates stock price fluctuations using the simulateStockPrice() function. The prices fluctuate randomly within a predefined range to simulate real market conditions.

### Database: All trades (buy and sell) are stored in a MySQL database. Each trade is recorded with details such as the price, quantity, and profit.

## Testing the Bot

### Start the Bot: Use the /start endpoint to initialize the bot and begin trading. The bot will execute trades automatically based on the moving average strategy.

### Monitor Performance: Use the /status endpoint to check the current balance, profit/loss, and trades made by the bot in real-time.

### Stop the Bot: Use the /stop endpoint to halt trading and generate a final report on the bot’s performance, including all trades and final profit/loss.

### Database Check: You can manually check the trades table in your MySQL database to ensure that trades are being recorded correctly.

# Conclusion

### This project demonstrates a basic implementation of a trading bot with automatic stock trading based on a simple moving average strategy. Future enhancements could include more complex strategies, integration with real stock price data, and advanced analytics for tracking performance.



