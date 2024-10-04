/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('trades', function(table) {
        table.increments('id').primary(); // Auto-incrementing primary key
        table.enu('type', ['buy', 'sell']).notNullable(); // Type of trade
        table.datetime('time').notNullable(); // Time of trade
        table.decimal('price', 10, 2).notNullable(); // Price at which stock was traded
        table.integer('quantity').notNullable(); // Quantity of shares traded
        table.decimal('profit', 10, 2); // Profit from the trade (nullable)
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for when the record was created
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('trades'); // Drop the table if it exists
};
