const { connectionManager } = require('../databases/connectionManagment');

class Payment {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.staff_id = options.staff_id;
        this.company_id = options.company_id;
        this.amount = options.amount;
        this.receipt_number = options.receipt_number;
        this.payment_note = options.payment_note;
        this.payment_date = options.payment_date;
        this.paid = options.paid || 0;
    }
    // create
    async save() {
        const sql = `INSERT INTO payment (
            staff_id,
            company_id,
            amount,
            receipt_number,
            payment_note,
            payment_date,
            paid
        ) VALUES (
            ${this.staff_id},
            ${this.company_id},
            ${this.amount},
            ${this.receipt_number},
            "${this.payment_note}",
            "${this.payment_date}",
            ${this.paid}
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.payment_id = result.insertId;
        return this.payment_id;
    }
    // get single
    static async getPaymentById(id, connectionName) {
        const sql =
            `SELECT *, DATE_FORMAT(payment_date, '%Y-%m-%d') AS payment_date  FROM payment WHERE payment_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // get all
    static async getAll_Payments(connectionName) {
        const sql = "SELECT *, DATE_FORMAT(payment_date, '%Y-%m-%d') AS payment_date  FROM payment";
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // update
    async update_Payment(id, connectionName) {
        const sql = `UPDATE payment SET 
        amount = "${this.amount}", 
        receipt_number = "${this.receipt_number}", 
        payment_note = "${this.payment_note}", 
        payment_date = "${this.payment_date}",
        paid = "${this.paid}"
        WHERE payment_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // delete
    static async delete_payment(id, connectionName) {
        const sql = `DELETE FROM payment WHERE payment_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getPaymentsByCompanyId(id, connectionName) {
        const sql =
            `SELECT *, DATE_FORMAT(payment_date, "%Y-%m-%d") AS payment_date FROM payment WHERE company_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Payment;
