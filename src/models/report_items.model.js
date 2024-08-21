const pool = require('../databases/mysql.db');

class EmployeeReportItems {
    constructor(options) {
        this.report_id = options.report_id;
        this.report_item_id = options.report_item_id;
        this.deviation_period = options.deviation_period;
        this.worked_hours = options.worked_hours;
        this.ob = options.ob || 0;
        this.comments = options.comments || '';
    }

    static async createEmployeeReportItems(report_id, reportItems) {
        const sql = `
            INSERT INTO employee_report_items 
            (
                report_id, 
                report_item_id, 
                deviation_period, 
                worked_hours, 
                ob, 
                comments
            ) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const valuesArray = reportItems.map(item => [
            report_id,
            item.report_item_id,
            item.deviation_period,
            item.worked_hours,
            +item.ob || 0,
            item.comments || '',
        ]);
        const promises = valuesArray.map(values => pool.execute(sql, values));
        const results = await Promise.all(promises);

        return results.map(result => result[0].insertId);
    }

    static async updateEmployeeReportItems(reportData, reportItems) {
        // SQL statement for updating the items
        const sql = `
            UPDATE employee_report_items SET 
                report_item_id = ?, 
                deviation_period = ?, 
                worked_hours = ?, 
                ob = ?, 
                comments = ?
                WHERE report_id = ? AND report_item_id = ?
        `;

        // Create an array of promises for the update operations
        const promises = reportItems.map(item => {
            const values = [
                item.report_item_id,
                item.deviation_period,
                item.worked_hours,
                +item.ob || 0, // Ensure `ob` is a number
                item.comments || '',
                reportData.report_id,
                item.report_item_id,
            ];
            // Execute the update operation
            return pool.execute(sql, values);
        });

        await Promise.all(promises);
        return true;
    }

    static async deleteMultipleItems(reportData, reportItems) {
        const deletePromises = reportItems.map(async (item) => {
            const sql = `DELETE FROM employee_report_items WHERE report_id = ? AND report_item_id = ?`;
            await pool.execute(sql, [reportData.report_id, item.report_item_id]);
        });
        await Promise.all(deletePromises);
        return true;
    }

    static async getByReportId(report_id) {
        const sql = `
            SELECT 
                item_id,
                report_id,
                report_item_id,
                deviation_period,
                worked_hours,
                ob,
                comments
            FROM employee_report_items
            WHERE report_id = ?
        `;
        const [rows] = await pool.execute(sql, [report_id]);
        return rows;
    }

    static async getAllReportItems() {
        const sql = `
            SELECT 
                item_id,
                report_id,
                report_item_id,
                deviation_period,
                worked_hours,
                ob,
                comments
            FROM employee_report_items
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getReportItemsByFilter(key, value) {
        const sql = `
            SELECT 
                item_id,
                report_id,
                report_item_id,
                deviation_period,
                worked_hours,
                ob,
                comments
            FROM employee_report_items
            WHERE ${key} = ?
        `;
        const [rows] = await pool.execute(sql, [value]);
        return rows;
    }

    static async deleteByItemId(item_id) {
        const sql = `
            DELETE FROM employee_report_items 
            WHERE item_id = ?
        `;
        const [result] = await pool.execute(sql, [item_id]);
        return result.affectedRows;
    }
}

module.exports = EmployeeReportItems;
