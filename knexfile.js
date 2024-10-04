require('dotenv').config();

module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB,
        port: process.env.MYSQL_PORT,
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './migrations'
    },
};
