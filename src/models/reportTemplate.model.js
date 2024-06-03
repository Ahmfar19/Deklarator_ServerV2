const { connectionManager } = require('../databases/connectionManagment');

class ReportTemplate {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.text = options.text;
    }
    // create
    async save() {
        const sql = `INSERT INTO report_template (
            text
        ) VALUES (
            "${this.text}"
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.item_id = result.insertId;
        return this.item_id;
    }

    static async getAll(connectionName) {
        const sql = `
        SELECT * FROM report_template`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = ReportTemplate;
