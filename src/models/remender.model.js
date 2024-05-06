const pool = require('../databases/mysql.db');


class Remender {
    constructor(options) {
        this.company_id = options.company_id;
        this.title = options.title;
        this.body = options.body;
        this.remender_date = options.remender_date;
        this.re_current = options.re_current;
    }
    //create
    async save() {
        const sql = `INSERT INTO remender (
            company_id,
            title,
            body,
            remender_date,
            re_current
        ) VALUES (
            ${this.company_id},
            "${this.title}", 
            "${this.body}",
            "${this.remender_date}", 
            ${this.re_current}
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
        title = "${this.title}", 
        body = "${this.body}",
        remender_date = "${this.remender_date}",
        re_current = ${this.re_current}
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
