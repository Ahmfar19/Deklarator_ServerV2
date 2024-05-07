const pool = require('../databases/mysql.db');


class Remender {
    constructor(options) {
        this.company_id = options.company_id;
        this.staff_id = options.staff_id;
        this.remender_date = options.remender_date;
        this.recurrent = options.recurrent;
        this.title = options.title;
        this.body = options.body;   
    }
    //create
    async save() {
        const sql = `INSERT INTO remender (
            company_id,
            staff_id,
            remender_date,
            recurrent,
            title,
            body
        ) VALUES (
            ${this.company_id},
            ${this.staff_id},
            "${this.remender_date}", 
            ${this.recurrent},
            "${this.title}", 
            "${this.body}"
        )`;
        const result = await pool.execute(sql);
        this.remender_id = result[0].insertId;
        return this.remender_id;
    }
    //get single company
    static async get_Remender(id) {
        const sql = `SELECT * FROM remender WHERE remender_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //get all
    static async getAll() {
        const sql = 'SELECT * FROM remender';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async update_Remender(id) {
        const sql = `UPDATE remender SET 
        remender_date = "${this.remender_date}",
        recurrent = ${this.recurrent},
        title = "${this.title}", 
        body = "${this.body}"
        WHERE remender_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async delete_Remender(id) { 
          const sql = `DELETE FROM remender WHERE remender_id = "${id}"`;
          const [rows] = await pool.execute(sql);
          return rows;      
    }

}

module.exports = Remender;
