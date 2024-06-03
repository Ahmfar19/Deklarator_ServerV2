const { connectionManager } = require('../databases/connectionManagment');

class ResetPassword {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
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
        await connectionManager.executeQuery(this.connectionName, sql);
    }

    static async getResetPassword(email, pinCode, connectionName) {
        const sql = `SELECT * FROM reset_password WHERE email = "${email}" AND pinCode = "${pinCode}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async updatePassword(email, newPassword, connectionName) {
        const sql = `UPDATE staff SET 
          password = ?
          WHERE email = ?`;
        await connectionManager.executeQuery(connectionName, sql, [newPassword, email]);
    }

    static async deleteUserAfterUpdatePassword(email, connectionName) {
        const sql = `DELETE FROM reset_password WHERE email = "${email}"`;
        await connectionManager.executeQuery(connectionName, sql);
    }

    static async checkIfUserExisted(email, connectionName) {
        const sql = `SELECT * FROM staff WHERE email = ? `;
        const result = await connectionManager.executeQuery(connectionName, sql, [email]);
        return result;
    }

    static async checkIfExistedInResetTable(email, connectionName) {
        const sql = `SELECT * FROM reset_password WHERE email = ? `;
        const result = await connectionManager.executeQuery(connectionName, sql, [email]);
        return result;
    }

    async updateResetPasswordInformation(userEmail, connectionName) {
        const sql = `UPDATE reset_password 
                     SET email = ?, 
                         pinCode = ?, 
                         expiresAt = ?
                     WHERE email = ?`;

        const values = [this.email, this.pinCode, this.expiresAt, userEmail];
        await connectionManager.executeQuery(connectionName, sql, values);
    }

    static async checkPinIfExisted(PinCode, email, connectionName) {
        const sql = `SELECT * FROM reset_password WHERE pinCode = ? AND email = ?`;
        const result = await connectionManager.executeQuery(connectionName, sql, [PinCode, email]);
        return result;
    }

    static async checkIfGuestExists(email, connectionName) {
        const sql = `SELECT email FROM guest 
        INNER JOIN company ON guest.company_id = company.company_id
        WHERE email = ?
        `;
        const result = await connectionManager.executeQuery(connectionName, sql, [email]);
        return result;
    }

    static async updateGuestPassword(email, newPassword, connectionName) {
        const sql = `UPDATE guest
                     INNER JOIN company ON guest.company_id = company.company_id
                     SET guest.password = ? 
                     WHERE company.email = ?`;
        await connectionManager.executeQuery(connectionName, sql, [newPassword, email]);
    }
}

module.exports = ResetPassword;
