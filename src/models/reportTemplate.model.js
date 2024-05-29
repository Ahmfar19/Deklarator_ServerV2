const pool = require('../databases/mysql.db');

class ReportTemplate {
    constructor(options) {
        this.text = options.text;
    }
    // create
    async save() {
        const sql = `INSERT INTO report_template (
            text
        ) VALUES (
            "${this.text}"
        )`;
        const result = await pool.execute(sql);
        this.item_id = result[0].insertId;
        return this.item_id;
    }

    static async getAll() {
        const sql = `
        SELECT * FROM report_template`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = ReportTemplate;
