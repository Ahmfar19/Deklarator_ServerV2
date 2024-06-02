const pool = require('../databases/mysql.db');

class ResetPassword {
    constructor(options) {
        this.email = options.email;
        this.pinCode = options.pinCode;
        this.expiresAt = options.expiresAt;
    }
    // create
    async save() {
        const sql = `INSERT INTO reset_password (
            email,
            pinCode,
            expiresAt
        ) VALUES (
            "${this.email}", 
            ${this.pinCode},
            "${this.expiresAt}" 
        )`;
        await pool.execute(sql);
    }

    static async getResetPassword(email, pinCode) {
        const sql = `SELECT * FROM reset_password WHERE email = "${email}" AND pinCode = "${pinCode}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async updatePassword(email, newPassword) {
        const sql = `UPDATE staff SET 
          password = ?
          WHERE email = ?`;
        await pool.execute(sql, [newPassword, email]);
    }

    static async deleteUserAfterUpdatePassword(email) {
        const sql = `DELETE FROM reset_password WHERE email = "${email}"`;
        await pool.execute(sql);
    }

    static async checkIfUserExisted(email) {
        const sql = `SELECT * FROM staff WHERE email = ? `;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
    }

    static async checkIfExistedInResetTable(email) {
        const sql = `SELECT * FROM reset_password WHERE email = ? `;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
    }

    async updateResetPasswordInformation(userEmail) {
        const sql = `UPDATE reset_password 
                     SET email = ?, 
                         pinCode = ?, 
                         expiresAt = ?
                     WHERE email = ?`;

        const values = [this.email, this.pinCode, this.expiresAt, userEmail];

        await pool.execute(sql, values);
    }

    static async checkPinIfExisted(PinCode, email) {
        const sql = `SELECT * FROM reset_password WHERE pinCode = ? AND email = ?`;
        const [rows] = await pool.execute(sql, [PinCode, email]);
        return rows;
    }

    static async checkIfGuestExists(email) {
        const sql = `SELECT email FROM guest 
        INNER JOIN company ON guest.company_id = company.company_id
        WHERE email = ?
        `;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
    }

    static async updateGuestPassword(email, newPassword) {
        const sql = `UPDATE guest
                     INNER JOIN company ON guest.company_id = company.company_id
                     SET guest.password = ? 
                     WHERE company.email = ?`;
        await pool.execute(sql, [newPassword, email]);
    }
}

module.exports = ResetPassword;
