const { connectionManager } = require('../databases/connectionManagment');
const Company = require('./company.model');

class Case {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.reconciliation_id = options.reconciliation_id;
        this.company_id = options.company_id;
        this.reconciliation_date = options.reconciliation_date;
        this.reconciliation_data = options.reconciliation_data;
    }

    static async save(company_id, date, defaultData) {
        const sql = `INSERT INTO reconciliation (
            company_id,
            reconciliation_date,
            reconciliation_data
        ) VALUES (
            ${company_id},
            '${date}', 
            '${defaultData}'
        )`;
        await connectionManager.executeQuery(this.connectionName, sql);
    }

    static async createReconciliation(year) {
        const companies = await Company.getAll();
        if (companies) {
            const defaultData = JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            const promises = companies.map(async c => this.save(c.company_id, year, defaultData));
            await Promise.all(promises);
        } else {
            throw new Error('Faild to get the companies');
        }
    }

    static async createMultiReconciliation(data) {
        if (!Array.isArray(data.companyIds) || data.companyIds.length === 0) {
            throw new Error('companyIds should be a non-empty array');
        }
        const companies = data.companyIds;
        const year = data.reconciliation_date;
        const defaultData = JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        const promises = companies.map(async company_id => this.save(company_id, year, defaultData));
        await Promise.all(promises);
    }

    static async getAll(year, connectionName) {
        const sql = `
            SELECT reconciliation.*, company.company_name
            FROM reconciliation
            JOIN company ON company.company_id = reconciliation.company_id
            WHERE reconciliation_date = ${year}`;

            const result = await connectionManager.executeQuery(connectionName, sql);
            return result;
    }

    static async getGroups(connectionName) {
        const sql = 'SELECT reconciliation_date FROM reconciliation GROUP BY reconciliation_date';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async deleteByYear(year, connectionName) {
        const sql = `DELETE FROM reconciliation WHERE reconciliation_date = "${year}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async deleteReconciliation(id, connectionName) {
        const sql = `DELETE FROM reconciliation WHERE reconciliation_id  = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async updateDataById(id, data, connectionName) {
        const sql = `UPDATE reconciliation SET reconciliation_data = '${data}' WHERE reconciliation_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Case;
