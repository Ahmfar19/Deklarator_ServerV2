const { connectionManager } = require('../databases/connectionManagment');

class EmployeeReportItems {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.report_id = options.report_id;
        this.report_item_id = options.report_item_id;
        this.deviation_period = options.deviation_period;
        this.worked_hours = options.worked_hours;
        this.ob = options.ob || 0;
        this.comments = options.comments || '';
    }

    static async createEmployeeReportItems(report_id, reportItems, connectionName) {
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

        const valuesArray = reportItems.map((item) => [
            report_id,
            item.report_item_id,
            item.deviation_period,
            item.worked_hours,
            +item.ob || 0,
            item.comments || '',
        ]);

        const promises = valuesArray.map((values) => connectionManager.executeQuery(connectionName, sql, values));
        const results = await Promise.all(promises);
        return results.map((result) => result.insertId);
    }

    static async updateEmployeeReportItems(reportData, reportItems, connectionName) {
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
        const promises = reportItems.map((item) => {
            const values = [
                item.report_item_id,
                item.deviation_period,
                item.worked_hours,
                +item.ob || 0, // Ensure `ob` is a number
                item.comments || '',
                reportData.report_id,
                item.report_item_id,
            ];
            return connectionManager.executeQuery(connectionName, sql, values);
        });

        await Promise.all(promises);
        return true;
    }

    static async deleteMultipleItems(reportData, reportItems, connectionName) {
        const deletePromises = reportItems.map(async (item) => {
            const sql = `DELETE FROM employee_report_items WHERE report_id = ? AND report_item_id = ?`;
            await connectionManager.executeQuery(connectionName, sql, [reportData.report_id, item.report_item_id]);
        });
        await Promise.all(deletePromises);
        return true;
    }

    static async getByReportId(report_id, connectionName) {
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
        const result = await connectionManager.executeQuery(connectionName, sql, [report_id]);
        return result;
    }

    static async getAllReportItems(connectionName) {
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
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getReportItemsByFilter(key, value, connectionName) {
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
        const result = await connectionManager.executeQuery(connectionName, sql, [value]);
        return result;
    }

    static async deleteByItemId(item_id, connectionName) {
        const sql = `
            DELETE FROM employee_report_items 
            WHERE item_id = ?
        `;
        const result = await connectionManager.executeQuery(connectionName, sql, [item_id]);
        return result.affectedRows;
      
    }
}

module.exports = EmployeeReportItems;
