const pool = require('../databases/mysql.db');

class Tamplate {
    constructor(options) {
        this.tamplate_name = options.tamplate_name;
        this.tamplate_body = options.tamplate_body;
    }
    async save() {
        const sql = `INSERT INTO tamplate (
            tamplate_name,
            tamplate_body
        ) VALUES (
            "${this.tamplate_name}",
            "${this.tamplate_body}"
        )`;
        const result = await pool.execute(sql);
        this.tamplate_id = result[0].insertId;
        return this.tamplate_id;
    }
    static async getAll() {
        const sql = 'SELECT * FROM tamplate';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async update_tamplate(id) {
        const sql = `UPDATE tamplate SET 
        tamplate_name = '${this.tamplate_name}',
        tamplate_body = '${this.tamplate_body}'
        WHERE tamplate_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM tamplate WHERE tamplate_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Tamplate;
