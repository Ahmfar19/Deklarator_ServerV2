const pool = require('../databases/mysql.db');

class EmployeeReport {
    constructor(options) {
        this.employee_id = options.employee_id;
        this.report_item_id = options.report_item_id;
        this.commited = options.commited;
        this.date = options.date;
    }

    static async createEmployeeReport(reportData) {
        if (!reportData) {
            throw new Error('Invalid report data');
        }

        const sql = `
            INSERT INTO employee_report 
            (
                employee_id, 
                date,
                commited
            ) 
            VALUES (?, ?, ?)
            `;

        const values = [
            reportData.employee_id,
            reportData.date,
            reportData.commited,
        ];
        const [rows] = await pool.execute(sql, values);
        return rows;
    }

    static async getByEmployeeId(id) {
        const sql = `
            SELECT 
                er.report_id,
                er.employee_id,
                CONCAT(e.fname, ' ', e.lname) AS employee_name,
                DATE_FORMAT(er.date, '%Y-%m-%d') AS date,
                er.commited,
                eri.report_item_id,
                eri.deviation_period,
                eri.worked_hours,
                eri.ob,
                eri.comments,
                rt.text AS template_text
            FROM employee_report er
            JOIN employee_report_items eri ON er.report_id = eri.report_id
            JOIN report_template rt ON eri.report_item_id = rt.item_id
            JOIN employee e ON er.employee_id = e.employee_id
            WHERE er.employee_id = ?
        `;

        const [rows] = await pool.execute(sql, [id]);

        // Initialize an object to hold the structured data by report_id
        const result = {};

        // Populate the result object
        rows.forEach(row => {
            if (!result[row.report_id]) {
                // Initialize the report entry in result object
                result[row.report_id] = {
                    reportData: {
                        date: row.date,
                        commited: Boolean(row.commited),
                        employee_id: row.employee_id,
                        employee_name: row.employee_name,
                        report_id: row.report_id,
                    },
                    reportItems: [],
                };
            }

            // Add report item to the appropriate report entry
            result[row.report_id].reportItems.push({
                report_item_id: row.report_item_id,
                deviation_period: row.deviation_period,
                worked_hours: row.worked_hours,
                ob: row.ob,
                comments: row.comments,
                text: row.template_text,
            });
        });

        // Convert result object to an array of reports
        const formattedResult = Object.values(result);

        return formattedResult;
    }

    static async updateByReportId(reportData) {
        if (!reportData) {
            throw new Error('Invalid report items data');
        }
        const sql = `UPDATE employee_report SET 
                commited = ?, 
                date = ?
                WHERE report_id = ?`;

        const values = [
            reportData.commited,
            reportData.date,
            reportData.report_id,
        ];

        pool.execute(sql, values);
        return true;
    }

    static async getAllEmployeeReports(filterKey = null, filterValue = null) {
        // Start the SQL query
        let sql = `
            SELECT 
                er.report_id,
                er.employee_id,
                e.company_id,
                e.personalnumber,
                CONCAT(e.fname, ' ', e.lname) AS employee_name,
                DATE_FORMAT(er.date, '%Y-%m-%d') AS date,
                er.commited,
                eri.report_item_id,
                eri.deviation_period,
                eri.worked_hours,
                eri.ob,
                eri.comments,
                rt.text AS template_text
            FROM employee_report er
            JOIN employee_report_items eri ON er.report_id = eri.report_id
            JOIN report_template rt ON eri.report_item_id = rt.item_id
            JOIN employee e ON er.employee_id = e.employee_id
        `;

        // If a filter key and value are provided, add a WHERE clause
        const values = [];
        if (filterKey && filterValue) {
            sql += ` WHERE ${filterKey} = ?`;
            values.push(filterValue);
        }

        const [rows] = await pool.execute(sql, values);

        // Initialize an object to hold the structured data by report_id
        const result = {};

        // Populate the result object
        rows.forEach(row => {
            if (!result[row.report_id]) {
                // Initialize the report entry in result object
                result[row.report_id] = {
                    reportData: {
                        date: row.date,
                        commited: Boolean(row.commited),
                        employee_id: row.employee_id,
                        employee_name: row.employee_name,
                        personalnumber: row.personalnumber,
                        report_id: row.report_id,
                    },
                    reportItems: [],
                };
            }

            // Add report item to the appropriate report entry
            result[row.report_id].reportItems.push({
                report_item_id: row.report_item_id,
                deviation_period: row.deviation_period,
                worked_hours: row.worked_hours,
                ob: row.ob,
                comments: row.comments,
                text: row.template_text,
            });
        });

        // Convert result object to an array of reports
        const formattedResult = Object.values(result);

        return formattedResult;
    }

    static async getAllReportItemsByCompanyId(companyId) {
        const sql = `
            SELECT 
                er.report_id,
                er.employee_id,
                er.date,
                er.commited,
                e.personalnumber,
                e.extent,
                CONCAT(e.fname, ' ', e.lname) AS employee_name,
                DATE_FORMAT(er.date, '%Y-%m-%d') AS date
            FROM employee_report er
            JOIN employee e ON er.employee_id = e.employee_id
            WHERE e.company_id = ?
        `;
        const [rows] = await pool.execute(sql, [companyId]);
        return rows;
    }

    static async deleteEmployeeReport(id) {
        const sql = `
            DELETE FROM employee_report 
            WHERE report_id = ? 
        `;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async geRangeReports(from, to) {
        const sql = `
            SELECT 
                er.report_id,
                er.employee_id,
                er.report_item_id,
                er.deviation_period,
                er.worked_hours,
                er.ob,
                er.comments,
                er.commited,
                e.personalnumber,
                e.extent,
                rt.text,
                rt.item_id,
                CONCAT(e.fname, ' ', e.lname) AS employee_name,
                DATE_FORMAT(er.date, '%Y-%m-%d') AS date
            FROM employee_report er
            JOIN employee e ON er.employee_id = e.employee_id
            JOIN report_template rt ON er.report_item_id = rt.item_id
            WHERE report_id BETWEEN ? AND ?
        `;
        const [rows] = await pool.execute(sql, [from, to]);
        return rows;
    }
}

module.exports = EmployeeReport;
