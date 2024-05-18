const pool = require('../databases/mysql.db');

class Tamplate {
    constructor(options) {
        this.tamplate_name = options.tamplate_name;
    }

    static async getAll() {
        const sql = 'SELECT * FROM tamplate';
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Tamplate;
