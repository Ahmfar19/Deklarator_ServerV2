const pool = require('../databases/mysql.db');


class Message {
    constructor(options) {
        this.staff_id = options.staff_id;
        this.message_typ_id = options.message_typ_id;
        this.title = options.title;
        this.body = options.body;
        this.date_time = options.date_time;
        this.seen = options.seen;     
    }
    //create
    async save() {
        const sql = `INSERT INTO message (
            staff_id,
            message_typ_id,
            title,
            body,
            date_time,
            seen
        ) VALUES (
            ${this.staff_id},
            ${this.message_typ_id},
            "${this.title}",
            "${this.body}", 
            "${this.date_time}",
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
        const sql = `
            SELECT message.*, message_type.variant
            FROM message
            JOIN message_type ON message.message_typ_id = message_type.message_typ_id;
        `;
        console.error('sql', sql);
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async update_Message(id) {
        const sql = `UPDATE message SET 
        seen = ${this.seen}
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
