const { connectionManager } = require('../databases/connectionManagment');

class Message {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.staff_id = options.staff_id;
        this.message_typ_id = options.message_typ_id;
        this.title = options.title;
        this.body = options.body;
        this.date_time = options.date_time;
        this.seen = options.seen;
    }
    // create
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
            '${this.body}', 
            "${this.date_time}",
             ${this.seen}
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.message_id = result.insertId;
        return this.message_id;
    }
    // get single company
    static async getMessage(id, connectionName) {
        const sql = `SELECT *
        , DATE_FORMAT(date_time, '%Y-%m-%d') AS date_time
        FROM message WHERE message_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getStaffMessages(staff_id, connectionName) {
        const sql = `SELECT message.*, message_type.variant
            FROM message 
            JOIN message_type ON message.message_typ_id = message_type.message_typ_id
            WHERE staff_id = ${staff_id}
            ORDER BY message.message_id DESC;
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    // get all
    static async getAll(connectionName) {
        const sql = `
            SELECT message.*, message_type.variant,
            DATE_FORMAT(date_time, '%Y-%m-%d') AS date_time
            FROM message
            JOIN message_type ON message.message_typ_id = message_type.message_typ_id
            ORDER BY message.message_id DESC;
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // update
    async update_Message(id, connectionName) {
        const sql = `UPDATE message SET 
        seen = ${this.seen}
        WHERE message_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async delete_Message(id, connectionName) {
        const sql = `DELETE FROM message WHERE message_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async deleteMessageBeforWeek(date, connectionName) {
        const sql = `DELETE FROM message WHERE date_time <= ?`;
        const result = await connectionManager.executeQuery(connectionName, sql, [date]);
        return result;
    }

    static async updateSeenBeforeId(beforeID, staff_id, connectionName) {
        const sql = `UPDATE message SET seen=1 WHERE message_id >= ${beforeID} AND staff_id = ${staff_id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Message;
