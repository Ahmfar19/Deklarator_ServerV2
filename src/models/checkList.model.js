const { connectionManager } = require('../databases/connectionManagment');

class CheckList {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.text = options.text;
    }

    // get all
    static async getAll(connectionName) {
        const sql = 'SELECT * FROM checklist';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getByCompanyId(id, connectionName) {
        const sql = `
            SELECT * FROM company_checklist 
            JOIN checklist ON checklist.checklist_item_id = company_checklist.checklist_item_id
            WHERE company_id = ${id}
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    async updateCheck(id, connectionName) {
        const sql = `UPDATE checklist SET 
        text = "${this.text}"
        WHERE checklist_item_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async updateChecklist(company_id, list, connectionName) {
        if (!list || !company_id) {
            throw new Error('Invalid argument');
        }

        Object.entries(list).forEach(async ([id, completed]) => {
            const sql =
                `UPDATE company_checklist SET completed = ${completed} WHERE item_id = ${id} AND company_id = ${company_id};`;
            await connectionManager.executeQuery(connectionName, sql);
        });
        return true;
    }

    static async createCompanyCheckList(company_id, connectionName) {
        try {
            const checklistItems = await this.getAll(connectionName);
            // Create an array of promises for checklist item insertion
            const insertionPromises = checklistItems.map(async (item) => {
                const sql = 'INSERT INTO company_checklist (company_id, checklist_item_id, completed) VALUES (?, ?, ?)';
                const values = [company_id, item.checklist_item_id, false];
                await connectionManager.executeQuery(connectionName, sql, values);
            });

            // Wait for all checklist items to be inserted
            await Promise.all(insertionPromises);

            // Return success status
            return true;
            // return { success: true, message: 'Checklist created successfully' };
        } catch (error) {
            // Return error status if any error occurs
            throw new Error(error.message);
        }
    }
}

module.exports = CheckList;
