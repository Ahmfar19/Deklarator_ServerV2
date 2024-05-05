const pool = require('../databases/mysql.db');


class Timer {
    constructor(options) {
        this.staff_id = options.staff_id;
        this.counted_time = options.counted_time;
    }
    //create
    async save() {
        const sql = `INSERT INTO timer (
            staff_id,
            counted_time
        ) VALUES (
            ${this.staff_id}, 
            "${this.counted_time}"
        )`;

        const result = await pool.execute(sql);
        this.timer_id = result[0].insertId;
        return this.timer_id;
    }
    //get single timer
    static async getTimer(id) {
        const sql = `SELECT * FROM timer WHERE staff_id="${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //get all
    static async getAll() {
        const sql = 'SELECT * FROM timer';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async updateTimer(id) {
        const sql = `UPDATE timer SET 
        counted_time = "${this.counted_time}" 
        WHERE timer_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //delete
    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM timer WHERE staff_id="${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Timer;
