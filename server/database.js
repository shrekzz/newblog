const mysql = require('mysql');
const config = require('./config');

const database = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
});

database.connect();
console.log('connected success')

module.exports = database;