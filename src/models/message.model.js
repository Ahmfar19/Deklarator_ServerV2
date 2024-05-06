const pool = require('../databases/mysql.db');


class Message {
    constructor(options) {
        this.staff_id = options.staff_id;
        this.title = options.title;
        this.body = options.body;
        this.message_date = options.message_date;
        this.seen = options.seen;
        
    }
    //create
    async save() {
        const sql = `INSERT INTO message (
            staff_id,
            title,
            body,
            message_date,  
            seen
        ) VALUES (
            ${this.staff_id},
            "${this.title}",
            "${this.body}", 
            "${this.message_date}",
             ${this.seen}
        )`;
        const result = await pool.execute(sql);
        this.message_id = result[0].insertId;
        return this.message_id;
    }
    //get single company
    static async getMessage(id) {
        const sql = `SELECT * FROM message WHERE message_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //get all
    static async getAll() {
        const sql = 'SELECT * FROM message';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async update_Message(id) {
        const sql = `UPDATE message SET 
        title = "${this.title}", 
        body = "${this.body}",
        message_date = "${this.message_date}", 
        seen = "${this.seen}"
        WHERE message_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async delete_Message(id) {
        const sql = `DELETE FROM message WHERE message_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Message;
