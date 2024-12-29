const pool = require('../databases/mysql.db');

class CommonModel {
    static async getAll(tableName) {
        const sql = `SELECT * FROM ${tableName}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = CommonModel;
