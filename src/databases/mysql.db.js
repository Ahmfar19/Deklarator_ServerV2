// const mysql = require('mysql2/promise');

// const connectionOptions = {
//     db1: {
//         host: 'localhost',
//         user: 'root',
//         database: 'db1'
//     },
//     db2: {
//         host: 'localhost',
//         user: 'root',
//         database: 'db2'
//     },
//     db3: {
//         host: 'localhost',
//         user: 'root',
//         database: 'db3'
//     },
//     db4: {
//         host: 'localhost',
//         user: 'root',
//         database: 'db4'
//     },
//     db5: {
//         host: 'localhost',
//         user: 'root',
//         database: 'db5'
//     }
// };

// const pools = {};

// const connectToMySQL = async () => {
//     for (const key in connectionOptions) {
//         try {
//             const pool = await mysql.createPool(connectionOptions[key]);
//             pools[key] = pool;
//             console.log(`Connected to ${key} database!`);
//         } catch (err) {
//             console.error(`Error connecting to ${key} database: ${err.message}`);
//             process.exit(1);
//         }
//     }
// };

// connectToMySQL().then();

// module.exports = {
//     getConnection: (connectionName) => pools[connectionName]
// };