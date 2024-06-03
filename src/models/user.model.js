const { connectionManager } = require('../databases/connectionManagment');

class User {
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
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.staff_id = result.insertId;
        return this.staff_id;
    }

    static async getAllUsers(connectionName) {
        const sql = 'SELECT * FROM staff';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getUserById(id, connectionName) {
        const sql = `SELECT * FROM staff WHERE staff_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    async updateUser(id, connectionName) {
        const sql = `UPDATE staff SET 
          username = "${this.username}", 
          fname = "${this.fname}",
          lname = "${this.lname}", 
          phone = "${this.phone}",
          email = "${this.email}", 
          role = "${this.role}",
          image = "${this.image}"
          WHERE staff_id = ${id}`;
        await connectionManager.executeQuery(connectionName, sql);
    }

    static async updatePassword(id, newPassword, connectionName) {
        const sql = `UPDATE staff SET 
         password = "${newPassword}"
         WHERE staff_id = ${id}`;
        await connectionManager.executeQuery(connectionName, sql);
    }

    static async deleteUser(id, connectionName) {
        const sql = `DELETE FROM staff WHERE staff_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async loginUser(email_username, connectionName) {
        const sql = `SELECT * FROM staff WHERE email ="${email_username}" OR username="${email_username}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async checkIfUserExisted(email, username, connectionName) {
        const sql = `SELECT * FROM staff WHERE email = ? OR username = ?`;
        const result = await connectionManager.executeQuery(connectionName, sql, [email, username]);
        return result;
    }

    static async checkUserUpdate(username, email, id, connectionName) {
        const sql = `SELECT * FROM staff WHERE 
         (username = '${username}' OR email = '${email}') 
         AND staff_id != ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getAdmins(connectionName) {
        const sql = 'SELECT * FROM staff WHERE role =1';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = User;
