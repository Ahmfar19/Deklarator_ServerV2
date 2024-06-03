const { connectionManager } = require('../databases/connectionManagment');

class MessageType {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.variant = options.variant;
    }
    // create
    async save() {
        const sql = `INSERT INTO message_type (
            variant
        ) VALUES (
            "${this.variant}"
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.message_typ_id = result.insertId;
        return this.message_typ_id;
    }
    // get single MessageType
    static async getMessageType(id, connectionName) {
        const sql = `SELECT * FROM message_type WHERE message_typ_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // get all
    static async getAll(connectionName) {
        const sql = 'SELECT * FROM message_type';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // update
    async update_MessageType(id, connectionName) {
        const sql = `UPDATE message_type SET 
        variant = "${this.variant}"
        WHERE message_typ_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async delete_MessageType(id, connectionName) {
        const sql = `DELETE FROM message_type WHERE message_typ_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getMessageTypeByName(variant, connectionName) {
        const sql = 'SELECT * FROM message_type WHERE variant = ?';
        const result = await connectionManager.executeQuery(connectionName, sql, [variant]);
        return result;
    }
}

module.exports = MessageType;
