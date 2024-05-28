const { getConnection } = require('../databases/mysql.db');

class Test {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.username = options.username;
        this.fname = options.fname;
        this.lname = options.lname;
        this.phone = options.phone;
        this.email = options.email;
        this.role = options.role;
        this.password = options.password;
        this.image = options.image || '';
    }

    async createUser() {
        const pool = getConnection(this.connectionName);

        const sql = `INSERT INTO staff (
            username,
            fname,
            lname,
            phone,
            email,
            role,
            password,
            image
        ) VALUES (
            "${this.username}", 
            "${this.fname}",
            "${this.lname}", 
            "${this.phone}",
            "${this.email}",
            ${this.role}, 
            "${this.password}",
            "${this.image}"
        )`;
        const result = await pool.execute(sql);
        this.staff_id = result[0].insertId;
        return this.staff_id;
    }
    static async getAllUsers(connectionName) {
        try {
            const pool = getConnection(connectionName); // Get connection pool based on connectionName
            const sql = 'SELECT * FROM staff';
            const [rows] = await pool.execute(sql);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }

    // Update other methods to use the appropriate connection pool
}

module.exports = Test;