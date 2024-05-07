const pool = require('../databases/mysql.db');


class Payment {
    constructor(options) {
        this.staff_id = options.staff_id;
        this.company_id = options.company_id;
        this.amount = options.amount;
        this.receipt_number = options.receipt_number;
        this.payment_note = options.payment_note;
        this.payment_date = options.payment_date;
        this.paid = options.paid || 0;
    }
    //create
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
        const result = await pool.execute(sql);
        this.payment_id = result[0].insertId;
        return this.payment_id;
    }
    //get single 
    static async getPaymentById(id) {
        const sql = `SELECT * FROM payment WHERE payment_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //get all
    static async getAll_Payments() {
        const sql = 'SELECT * FROM payment';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async update_Payment(id) {
        const sql = `UPDATE payment SET 
        amount = "${this.amount}", 
        receipt_number = "${this.receipt_number}", 
        payment_note = "${this.payment_note}", 
        payment_date = "${this.payment_date}",
        paid = "${this.paid}"
        WHERE payment_id = ${id}`;
        await pool.execute(sql);
    }
    //delete
    static async delete_payment(id) {
        const sql = `DELETE FROM payment WHERE payment_id = "${id}"`;
        await pool.execute(sql);
    }

    static async checkIfPaymentExisted(id) {
        const sql = `SELECT * FROM payment WHERE payment_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getPaymentsByCompanyId(id) {
        const sql = `SELECT *, DATE_FORMAT(payment_date, "%Y-%m-%d") AS payment_date FROM payment WHERE company_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Payment;
