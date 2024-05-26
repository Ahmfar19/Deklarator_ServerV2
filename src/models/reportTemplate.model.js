const pool = require('../databases/mysql.db');

class ReportTemplate {
    constructor(options) {
        this.text = options.text;
    }
    // create
    async save() {
        const sql = `INSERT INTO report_template (
            text
        ) VALUES (
            "${this.text}"
        )`;
        const result = await pool.execute(sql);
        this.item_id = result[0].insertId;
        return this.item_id;
    }

    static async getAll() {
        const sql = `
        SELECT * FROM report_template`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getByEmployeeId(id) {
        const sql = `
            SELECT * FROM employee_report 
            JOIN report_template ON report_template.item_id = employee_report.report_item_id
            WHERE employee_id = ${id}
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async createEmployeeReport(employee_id, reportItemsData) {

            if(!Array.isArray(reportItemsData) || reportItemsData.length === 0) {
                throw new Error('Invalid report items data');
            }
            // Create an array of promises for report item insertion
            const insertionPromises = reportItemsData.map(async (item) => {
                const sql = 'INSERT INTO employee_report (employee_id, report_item_id, quantity, sum, date) VALUES (?, ?, ?, ?, ?)';
                const values = [employee_id, item.report_item_id, item.quantity, item.sum, item.date];
                await pool.execute(sql, values);
            });
    
            // Wait for all report items to be inserted
            await Promise.all(insertionPromises);
    
            // Return success status
            return true;
    }
    
}

module.exports = ReportTemplate;
