const pool = require('../databases/mysql.db');

class User {
    constructor(options) {
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
        const result = await pool.execute(sql);
        this.staff_id = result[0].insertId;
        return this.staff_id;
    }

    static async getAllUsers() {
        const sql = 'SELECT * FROM staff';
        // eslint-disable-next-line no-unused-vars
        const [rows, fields] = await pool.execute(sql);
        return rows;
    }

    static async getUserById(id) {
        const sql = `SELECT * FROM staff WHERE staff_id = "${id}"`;
        // eslint-disable-next-line no-unused-vars
        const [rows, fields] = await pool.execute(sql);
        return rows;
    }

    async updateUser(id) {
        const sql = `UPDATE staff SET 
        username = "${this.username}", 
        fname = "${this.fname}",
        lname = "${this.lname}", 
        phone = "${this.phone}",
        email = "${this.email}", 
        role = "${this.role}",
        image = "${this.image}"
        WHERE staff_id = ${id}`;
        await pool.execute(sql);
    }

    static async updatePassword(id, newPassword) {
        const sql = `UPDATE staff SET 
        password = "${newPassword}"
        WHERE staff_id = ${id}`;
        await pool.execute(sql);
    }

    static async deleteUser(id) {
        const sql = `DELETE FROM staff WHERE staff_id = "${id}"`;
        await pool.execute(sql);
    }

    static async loginUser(email_username) {
        const sql = `SELECT * FROM staff WHERE email ="${email_username}" OR username="${email_username}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    
    static async checkIfUserExisted(email, username) {
        const sql = `SELECT * FROM staff WHERE email = ? OR username = ?`;
        const [rows] = await pool.execute(sql, [email, username]);
        return rows;
    }

    static async checkUserUpdate(username, email, id) {
        const sql = `SELECT * FROM staff WHERE 
        username = '${username}' 
        OR email = '${email}' 
        AND NOT staff_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getAdmins() {
        const sql = 'SELECT * FROM staff WHERE role =1';
        const [rows] = await pool.execute(sql);
        return rows;
    }
}


module.exports = User;
