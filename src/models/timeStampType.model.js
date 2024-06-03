const { connectionManager } = require('../databases/connectionManagment');

class TimeStampType {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.name_sv = options.name_sv;
    }

    // create
    async save() {
        const sql = `INSERT INTO timestamp_type (
            name_sv
        ) VALUES (
            "${this.name_sv}"
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.type_id = result.insertId;
        return this.type_id;
    }

    static async getAll(connectionName) {
        const sql = 'SELECT * FROM timestamp_type';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getSingle(id, connectionName) {
        const sql = `SELECT * FROM timestamp_type WHERE type_id  = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    async update(id, connectionName) {
        const sql = `UPDATE timestamp_type SET 
        name_sv = "${this.name_sv}"
        WHERE type_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM timestamp_type WHERE type_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = TimeStampType;
