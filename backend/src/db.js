require('dotenv').config();

const {Pool} = require('pg');

const PostgresDB = () => {
    const pool = new Pool({
        host: 'localhost',
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB
    });

    return pool;
}

module.exports = PostgresDB;