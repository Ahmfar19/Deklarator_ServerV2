const { connectionManager } = require('../databases/connectionManagment');

class Employee {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
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

        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.employee_id = result.insertId;
        return this.employee_id;
    }

    static async getSingleById(id, connectionName) {
        const sql = `SELECT * FROM employee WHERE employee_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getCompanyEmployees(id, connectionName) {
        const sql = `
            SELECT * FROM employee WHERE company_id = ${id}
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getAllEmployees(connectionName) {
        const sql = `
            SELECT employee_id, company_id, CONCAT(fname, ' ', lname) AS employee_name 
            FROM employee`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    async updateById(id, connectionName) {
        const sql = `UPDATE employee SET 
        company_id = ${this.company_id}, 
        fname = "${this.fname}", 
        lname = "${this.lname}", 
        personalnumber = "${this.personalnumber}",
        extent = "${this.extent}"
        WHERE employee_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM employee WHERE employee_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Employee;
