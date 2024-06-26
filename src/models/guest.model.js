const pool = require('../databases/mysql.db');

class Guest {
    constructor(options) {
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
        const result = await pool.execute(sql);
        this.gust_id = result[0].insertId;
        return this.gust_id;
    }

    static async getAllAccounts() {
        const sql = 'SELECT * FROM guest';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async deleteAccount(id) {
        const sql = `DELETE FROM guest WHERE company_id = ${id}`;
        const [row] = await pool.execute(sql);
        return row;
    }

    static async getEmail(id) {
        const sql = `SELECT email, company_name FROM company WHERE company_id = "${id}"`;
        const result = await pool.execute(sql);
        return result[0];
    }

    static async checkGuest(email) {
        const sql = `
        SELECT guest.company_id, guest.password, gust_id FROM guest
        JOIN company ON company.company_id = guest.company_id
        WHERE email = '${email}';
    `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async checkIfGuestExists(company_id) {
        const sql = `
        SELECT * FROM guest
        JOIN company ON company.company_id = guest.company_id
        WHERE guest.company_id = '${company_id}';
    `;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Guest;
