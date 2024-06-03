const mysql = require('mysql2/promise');

class MySQLConnectionManager {
  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
    this.pools = {};
  }

  async connect() {
    for (const key in this.connectionOptions) {
      try {
        const pool = await mysql.createPool(this.connectionOptions[key]);
        this.pools[key] = pool;
        console.log(`Connected to ${key} database!`);
      } catch (err) {
        console.error(`Error connecting to ${key} database: ${err.message}`);
        process.exit(1);
      }
    }
  }

  getConnection(connectionName) {
    return this.pools[connectionName];
  }

  async executeQuery(connectionName, sql) {
    try {
     
      const pool = this.pools[connectionName];
  
      if (!pool) {
        throw new Error(`Connection pool for ${connectionName} not found`);
      }
     
      const [rows] = await pool.execute(sql);
      return rows;

    } catch (error) {
         console.error(error.message);
    }
  }
}

const connectionOptions = {
  db1: {
    host: 'localhost',
    user: 'root',
    database: 'db1'
  },
  db2: {
    host: 'localhost',
    user: 'root',
    database: 'db2'
  },
  db3: {
    host: 'localhost',
    user: 'root',
    database: 'db3'
  },
  db4: {
    host: 'localhost',
    user: 'root',
    database: 'db4'
  },
  db5: {
    host: 'localhost',
    user: 'root',
    database: 'db5'
  }
};

const connectionManager = new MySQLConnectionManager(connectionOptions);
connectionManager.connect().then();

module.exports = connectionManager;