
const pool = require('../databases/mysql.db');
class TimeStampType {
    constructor(options) {
        this.name_sv = options.name_sv;
        this.name_en = options.name_en;
        this.name_ar = options.name_ar;
    }
    //create
    async save() {
        const sql = `INSERT INTO timestamp_type (
            name_sv,
            name_en,
            name_ar
        ) VALUES (
            "${this.name_sv}", 
            "${this.name_en}",
            "${this.name_ar}"
        )`;
        const result = await pool.execute(sql);
        this.type_id = result[0].insertId;
        return this.type_id;
    }
    //get all
    static async getAll() {
        const sql = 'SELECT * FROM timestamp_type';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //get single caseType
    static async getSingle(id) {
        const sql = `SELECT * FROM timestamp_type WHERE type_id  = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async update(id) {
        const sql = `UPDATE timestamp_type SET 
        name_sv = "${this.name_sv}", 
        name_en = "${this.name_en}",
        name_ar = "${this.name_ar}"
        WHERE type_id = ${id}`;
        await pool.execute(sql);
    }
    //delete
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
