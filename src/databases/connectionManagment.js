const mysql = require('mysql2/promise');
const config = require('config');
const CONNECTION_OPTIONS = config.get('CONNECTION_OPTIONS');

class MySQLConnectionManager {
    constructor(connectionOptions) {
        this.defaultOptions = {
            host: 'localhost',
        };
        this.connectionOptions = connectionOptions;
        this.pools = {};
    }

    async connect() {
        for (const key in this.connectionOptions) {
            const connectionOptions = Object.assign(
                {},
                this.defaultOptions,
                this.connectionOptions[key].databaseOption,
            );
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
            this.connectionOptions = Object.assign({}, this.connectionOptions, {
                [key]: {
                    databaseOption,
                    AdminEmail: AdminEmail,
                },
            });
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

const connectionManager = new MySQLConnectionManager(CONNECTION_OPTIONS);
connectionManager.connect().then();

module.exports = { connectionManager, CONNECTION_OPTIONS };
