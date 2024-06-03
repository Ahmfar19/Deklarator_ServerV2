const { connectionManager } = require('../databases/connectionManagment');

class Tamplate {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.tamplate_name = options.tamplate_name;
        this.tamplate_body = options.tamplate_body;
    }
    async save() {
        const sql = `INSERT INTO tamplate (
            tamplate_name,
            tamplate_body
        ) VALUES (
            '${this.tamplate_name}',
            '${this.tamplate_body}'
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.tamplate_id = result.insertId;
        return this.tamplate_id;
    }
    static async getAll(connectionName) {
        const sql = 'SELECT * FROM tamplate';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    async update_tamplate(id, connectionName) {
        const sql = `UPDATE tamplate SET 
        tamplate_name = '${this.tamplate_name}',
        tamplate_body = '${this.tamplate_body}'
        WHERE tamplate_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM tamplate WHERE tamplate_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Tamplate;
