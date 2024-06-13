const mysql = require('mysql2/promise');
const config = require('config');
const DB_HOST = process.env.NODE_ENV === 'development' ? 'localhost' : config.get('DB_HOST');
const DB_NAME = process.env.NODE_ENV === 'development' ? 'deklarator' : config.get('DB_NAME');
const DB_USERNAME = process.env.NODE_ENV === 'development' ? 'root' : config.get('DB_USERNAME');
const DB_PASSWORD = process.env.NODE_ENV === 'development' ? '' : config.get('DB_PASSWORD');

const connectionOptions = {
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
};

const pool = mysql.createPool(connectionOptions);
const connectToMySQL = async () => {
    try {
        await pool.getConnection();
        console.log('MySQL database connected!');
    } catch (err) {
        console.log('MySQL database connection error!');
        process.exit(1);
    }
};
connectToMySQL().then();

module.exports = pool;
