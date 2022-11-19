const { Client } = require('pg');

const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'unhan_modul_17',
    password: 'postgres',
    port: '5432',
});

module.exports = db;