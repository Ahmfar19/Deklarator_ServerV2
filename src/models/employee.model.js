const pool = require('../databases/mysql.db');

class Employee {
    constructor(options) {
        this.company_id = options.company_id;
        this.fname = options.fname;
        this.lname = options.lname;
        this.personalnumber = options.personalnumber;
        this.extent = options.extent;
    }

    async save() {
        const sql = `INSERT INTO employee (
            company_id,
            fname,
            lname,
            personalnumber,
            extent
        ) VALUES (
            ${this.company_id}, 
            "${this.fname}", 
            "${this.lname}", 
            "${this.personalnumber}",
            "${this.extent}"
        )`;

        const result = await pool.execute(sql);
        this.employee_id = result[0].insertId;
        return this.employee_id;
    }

    static async getSingleById(id) {
        const sql = `SELECT * FROM employee WHERE employee_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getAll() {
        const sql = `
            SELECT * FROM employee
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getCompanyEmployees(id) {
        const sql = `
            SELECT * FROM employee WHERE company_id = ${id}
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getAllEmployees() {
        const sql = `
            SELECT employee_id, company_id, CONCAT(fname, ' ', lname) AS employee_name 
            FROM employee`;
        console.error('sql', sql);
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateById(id) {
        const sql = `UPDATE employee SET 
        company_id = ${this.company_id}, 
        fname = "${this.fname}", 
        lname = "${this.lname}", 
        personalnumber = "${this.personalnumber}",
        extent = "${this.extent}"
        WHERE employee_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM employee WHERE employee_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Employee;
