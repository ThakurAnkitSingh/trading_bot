/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('bot_health', function (table) {
        table.increments('id').primary();
        table.timestamp('timestamp').defaultTo(knex.fn.now());
        table.decimal('cpu_usage', 5, 2);  // CPU usage percentage
        table.decimal('memory_usage', 5, 2);  // Memory usage percentage
        table.integer('active_positions');
        table.decimal('current_balance', 10, 2);
        table.string('status', 50);  // Current bot status
        table.decimal('last_price', 10, 2);  // Last recorded stock price
        table.text('error_message').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('bot_health');
}; 