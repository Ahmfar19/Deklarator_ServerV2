const pool = require('../databases/mysql.db');

class Tamplate {
    constructor(options) {
        this.template_body = options.template_body;
    }
    async save() {
        const sql = `INSERT INTO tamplate (
            template_body
        ) VALUES (
            "${this.template_body}"
        )`;
        const result = await pool.execute(sql);     
        this.tamplate_id  = result[0].insertId;
        return this.tamplate_id ;
    }
    static async getAll() {
        const sql = 'SELECT * FROM tamplate';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async update_tamplate(id) {
        const sql = `UPDATE tamplate SET 
        template_body = '${this.template_body}'
        WHERE template_id = ${id}`;

        console.error('sql', sql);
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Tamplate;
