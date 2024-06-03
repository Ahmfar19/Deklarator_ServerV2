const { connectionManager } = require('../databases/connectionManagment');

class Guest {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.company_id = options.company_id;
        this.password = options.password;
    }
    // create
    async save() {
        const sql = `INSERT INTO guest (
            company_id,
            password
        ) VALUES (
            ${this.company_id}, 
            "${this.password}"
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.gust_id = result.insertId;
        return this.gust_id;
    }

    static async getAllAccounts(connectionName) {
        const sql = 'SELECT * FROM guest';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async deleteAccount(id, connectionName) {
        const sql = `DELETE FROM guest WHERE company_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getEmail(id, connectionName) {
        const sql = `SELECT email, company_name FROM company WHERE company_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async checkGuest(email, connectionName) {
        const sql = `
        SELECT guest.company_id, guest.password, gust_id FROM guest
        JOIN company ON company.company_id = guest.company_id
        WHERE email = '${email}';
    `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async checkIfGuestExists(company_id, connectionName) {
        const sql = `
        SELECT * FROM guest
        JOIN company ON company.company_id = guest.company_id
        WHERE guest.company_id = '${company_id}';
    `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Guest;
