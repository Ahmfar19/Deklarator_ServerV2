const pool = require('../databases/mysql.db');

class CompanyType {
    constructor(options) {
        this.type_name = options.type_name;
    }
    // create
    async save() {
        const sql = `INSERT INTO company_type (
            type_name
        ) VALUES (
            "${this.type_name}"
        )`;
        const result = await pool.execute(sql);
        this.type_id = result[0].insertId;
        return this.type_id;
    }
    // get all
    static async getAll() {
        const sql = 'SELECT * FROM company_type';
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = CompanyType;
