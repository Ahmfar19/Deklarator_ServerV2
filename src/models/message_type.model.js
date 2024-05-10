const pool = require('../databases/mysql.db');


class MessageType {
    constructor(options) {
        this.name = options.name;
    }
    //create
    async save() {
        const sql = `INSERT INTO message_type (
            name
        ) VALUES (
            "${this.name}"
        )`;
        const result = await pool.execute(sql);
        this.message_typ_id = result[0].insertId;
        return this.message_typ_id;
    }
    //get single MessageType
    static async getMessageType(id) {
        const sql = `SELECT * FROM message_type WHERE message_typ_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //get all
    static async getAll() {
        const sql = 'SELECT * FROM message_type';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async update_MessageType(id) {
        const sql = `UPDATE message_type SET 
        name = "${this.name}"
        WHERE message_typ_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async delete_MessageType(id) {
        const sql = `DELETE FROM message_type WHERE message_typ_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getMessageTypeByName() {
        const sql = 'SELECT * FROM message_type WHERE name = "danger"';
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = MessageType;
