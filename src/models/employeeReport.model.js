const pool = require('../databases/mysql.db');

class EmployeeReport {
    constructor(options) {
        this.employee_id = options.employee_id;
        this.report_item_id = options.report_item_id;
        this.quantity = options.quantity;
        this.sum = options.sum;
        this.date = options.date;
    }

    static async updateByReportId(employee_id, reportItemsData) {
        if (!Array.isArray(reportItemsData) || reportItemsData.length === 0) {
            throw new Error('Invalid report items data');
        }

        const insertionPromises = reportItemsData.map(async (item) => {
            const sql = `UPDATE employee_report SET 
             report_item_id = ${item.report_item_id},
             quantity = ${item.quantity},
             sum = ${item.sum},
             date = "${item.date}"
             WHERE employee_id = ${employee_id}
             AND report_id = ${item.report_id}
             `;
            await pool.execute(sql);
        });

        await Promise.all(insertionPromises);

        // Return success status
        return true;
    }

    static async getByEmployeeId(id) {
        const sql = `
            SELECT 
            report_id,
            employee_id,
            report_item_id,
            quantity,
            sum,
            DATE_FORMAT(date, '%Y-%m-%d') AS date
            FROM employee_report 
            JOIN report_template ON report_template.item_id = employee_report.report_item_id
            WHERE employee_id = ${id}
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async createEmployeeReport(employee_id, reportItemsData) {
        if (!Array.isArray(reportItemsData) || reportItemsData.length === 0) {
            throw new Error('Invalid report items data');
        }
        // Create an array of promises for report item insertion
        const insertionPromises = reportItemsData.map(async (item) => {
            const sql =
                'INSERT INTO employee_report (employee_id, report_item_id, quantity, sum, date) VALUES (?, ?, ?, ?, ?)';
            const values = [employee_id, item.report_item_id, item.quantity, item.sum, item.date];
            return await pool.execute(sql, values);
        });

        // Wait for all report items to be inserted
        const results = await Promise.all(insertionPromises);
        const from = results[0][0].insertId;
        const to = from + results.length - 1;

        const insertedReports = await this.geRangeReports(from, to);
        return insertedReports;
    }

    static async getAllReportItemsByCompanyId(companyId) {
        const sql = `SELECT 
        er.report_id, 
        er.employee_id,
        er.report_item_id,
        er.quantity,
        er.sum,
        e.personalnumber,
        e.extent,
        rt.text,
        rt.item_id,
        CONCAT(e.fname, ' ', e.lname) AS employee_name,
        DATE_FORMAT(er.date, '%Y-%m-%d') AS date
        FROM employee_report er
        JOIN employee e ON er.employee_id = e.employee_id
        JOIN report_template rt ON er.report_item_id = rt.item_id
        WHERE company_id = ${companyId}
       `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getAllReportItems() {
        const sql = `SELECT 
        er.report_id, 
        er.employee_id,
        er.report_item_id,
        er.quantity,
        er.sum,
        e.personalnumber,
        e.extent,
        rt.text,
        rt.item_id,
        co.company_name,
        CONCAT(e.fname, ' ', e.lname) AS employee_name,
        DATE_FORMAT(er.date, '%Y-%m-%d') AS date
        FROM employee_report er
        JOIN employee e ON er.employee_id = e.employee_id
        JOIN report_template rt ON er.report_item_id = rt.item_id
        JOIN company co ON co.company_id = e.company_id
       `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async deleteEmployeeReport(id) {
        const [empId, year, month] = id.split('-');

        const sql = `DELETE FROM employee_report 
            WHERE employee_id = ${empId}
            AND YEAR(date) = ${year} 
            AND MONTH(date) = ${month}
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async geRangeReports(from, to) {
        const sql = `SELECT 
        er.report_id,
        er.employee_id,
        er.report_item_id,
        er.quantity,
        er.sum,
        e.personalnumber,
        e.extent,
        rt.text,
        rt.item_id,
        CONCAT(e.fname, ' ', e.lname) AS employee_name,
        DATE_FORMAT(er.date, '%Y-%m-%d') AS date
        FROM employee_report er
        JOIN employee e ON er.employee_id = e.employee_id
        JOIN report_template rt ON er.report_item_id = rt.item_id
        WHERE report_id >= ${from} AND report_id <= ${to};
       `;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = EmployeeReport;
