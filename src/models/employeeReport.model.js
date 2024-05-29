const pool = require('../databases/mysql.db');

class EmployeeReport {
    constructor(options) {
        this.employee_id = options.employee_id;
        this.report_item_id = options.report_item_id;
        this.quantity = options.quantity;
        this.sum = options.sum;
        this.date = options.date;
    }
   
     async updateByReportId(reportId) {
        const sql = `UPDATE employee_report SET 
        employee_id = ${this.employee_id}, 
        report_item_id = ${this.report_item_id}, 
        quantity = ${this.quantity},
        sum = ${this.sum}, 
        date = "${this.date}"
        WHERE report_id  = ${reportId}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = EmployeeReport;
