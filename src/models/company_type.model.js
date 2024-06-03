const { connectionManager } = require('../databases/connectionManagment');

class CompanyType {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.type_name = options.type_name;
    }
    // create
    async save() {
        const sql = `INSERT INTO company_type (
            type_name
        ) VALUES (
            "${this.type_name}"
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.type_id = result.insertId;
        return this.type_id;
    }
    // get all
    static async getAll(connectionName) {
        const sql = 'SELECT * FROM company_type';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = CompanyType;
