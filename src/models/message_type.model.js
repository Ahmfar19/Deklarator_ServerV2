const pool = require('../databases/mysql.db');

class MessageType {
    constructor(options) {
        this.variant = options.variant;
    }
    // create
    async save() {
        const sql = `INSERT INTO message_type (
            variant
        ) VALUES (
            "${this.variant}"
        )`;
        const result = await pool.execute(sql);
        this.message_typ_id = result[0].insertId;
        return this.message_typ_id;
    }
    // get single MessageType
    static async getMessageType(id) {
        const sql = `SELECT * FROM message_type WHERE message_typ_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    // get all
    static async getAll() {
        const sql = 'SELECT * FROM message_type';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    // update
    async update_MessageType(id) {
        const sql = `UPDATE message_type SET 
        variant = "${this.variant}"
        WHERE message_typ_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async delete_MessageType(id) {
        const sql = `DELETE FROM message_type WHERE message_typ_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getMessageTypeByName(variant) {
        const sql = 'SELECT * FROM message_type WHERE variant = ?';
        const [rows] = await pool.execute(sql, [variant]);
        return rows;
    }
}

module.exports = MessageType;
