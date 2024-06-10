const mysql = require('mysql2/promise');
const config = require('config');
const DB_HOST = config.get('DB_HOST');
const DB_USERNAME = config.get('DB_USERNAME');

const ADMIN_EMAIL_1 = config.get('ADMIN_EMAIL_2');
const ADMIN_EMAIL_2 = config.get('ADMIN_EMAIL_2');
const ADMIN_EMAIL_3 = config.get('ADMIN_EMAIL_2');
const ADMIN_EMAIL_4 = config.get('ADMIN_EMAIL_2');
const ADMIN_EMAIL_5 = config.get('ADMIN_EMAIL_2');
const DATABASE_1 = config.get('DATABASE_1');
const DATABASE_2 = config.get('DATABASE_2');
const DATABASE_3 = config.get('DATABASE_3');
const DATABASE_4 = config.get('DATABASE_4');
const DATABASE_5 = config.get('DATABASE_5');

class MySQLConnectionManager {
    constructor(connectionOptions) {
        this.defaultOptions = {
            host: DB_HOST,
            user: DB_USERNAME,
        }
        this.connectionOptions = connectionOptions;
        this.pools = {};
    }

    async connect() {
        for (const key in this.connectionOptions) {
            const connectionOptions = Object.assign({}, this.defaultOptions, this.connectionOptions[key].databaseOption);
            try {
                const pool = mysql.createPool(connectionOptions);
                this.pools[key] = pool;
                console.log(`Connected to ${key} database!`);
            } catch (err) {
                console.error(`Error connecting to ${key} database: ${err.message}`);
                process.exit(1);
            }
        }
    }

    async addConnect(key, option) {
        try {
            const { AdminEmail, databaseOption } = option;
            const connectionOptions = Object.assign({}, this.defaultOptions, databaseOption);
            const pool = mysql.createPool(connectionOptions);
            this.pools[key] = pool;
            this.connectionOptions[key] = {
                databaseOption,
                AdminEmail: AdminEmail
            }
            console.log(`Connected to ${key} database!`);
        } catch (err) {
            console.error(`Error connecting to ${option.key} database: ${err.message}`);
            process.exit(1);
        }
    }

    getConnection(connectionName) {
        return this.pools[connectionName];
    }

    async executeQuery(connectionName, sql, params) {
        try {
            const pool = this.pools[connectionName];

            if (!pool) {
                throw new Error(`Connection pool for ${connectionName} not found`);
            }

            const [rows] = await pool.execute(sql, params);

            return rows;
        } catch (error) {
            console.error(error.message);
        }
    }

    async getConnections() {
        return this.connectionOptions;
    }
}

const connectionOptions = {
    db1: {
        databaseOption: {
            database: DATABASE_1,
            password: ''
        },
        AdminEmail: ADMIN_EMAIL_1
    },
    
     db2: {
        databaseOption: {
            database: DATABASE_2,
            password: ''
        },
        AdminEmail: ADMIN_EMAIL_2 

     }, 
     db3: {
        databaseOption: {
            database: DATABASE_3,
            password: ''
        },
        AdminEmail: ADMIN_EMAIL_3
     }, 
     db4: {
        databaseOption: {
            database: DATABASE_4,
            password: ''
        },
        AdminEmail: ADMIN_EMAIL_4
     }, 
     db5: {
        databaseOption: {
            database: DATABASE_5,
            password: ''
        },
        AdminEmail: ADMIN_EMAIL_5
     }, 
};

const connectionManager = new MySQLConnectionManager(connectionOptions);
connectionManager.connect().then();

module.exports = { connectionManager, connectionOptions };