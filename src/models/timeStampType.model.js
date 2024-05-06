
const pool = require('../databases/mysql.db');
class TimeStampType {
    constructor(options) {
        this.name_sv = options.name_sv;
    }

    //create
    async save() {
        const sql = `INSERT INTO timestamp_type (
            name_sv
        ) VALUES (
            "${this.name_sv}"
        )`;
        const result = await pool.execute(sql);
        this.type_id = result[0].insertId;
        return this.type_id;
    }

    static async getAll() {
        const sql = 'SELECT * FROM timestamp_type';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getSingle(id) {
        const sql = `SELECT * FROM timestamp_type WHERE type_id  = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async update(id) {
        const sql = `UPDATE timestamp_type SET 
        name_sv = "${this.name_sv}"
        WHERE type_id = ${id}`;
        await pool.execute(sql);
    }

    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM timestamp_type WHERE type_id = "${id}"`;
        await pool.execute(sql);
    }

    static async checkIfTimeStampTypeExisted(id) {
        const sql = `SELECT * FROM timestamp_type WHERE type_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = TimeStampType;
