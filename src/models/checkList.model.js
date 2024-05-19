const pool = require('../databases/mysql.db');

class CheckList {
    constructor(options) {
        this.text = options.text;
    }

    // get all
    static async getAll() {
        const sql = 'SELECT * FROM checklist';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getByCompanyId(id) {
        const sql = `
            SELECT * FROM company_checklist 
            JOIN checklist ON checklist.checklist_item_id = company_checklist.checklist_item_id
            WHERE company_id = ${id}
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateCheck(id) {
        const sql = `UPDATE checklist SET 
        company_id = ${this.company_id},
        completed = ${this.completed}
        WHERE item_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async createCompanyCheckList(company_id) {
        try {
            const checklistItems = await this.getAll();

            // Create an array of promises for checklist item insertion
            const insertionPromises = checklistItems.map(async (item) => {
                const sql = 'INSERT INTO company_checklist (company_id, checklist_item_id, completed) VALUES (?, ?, ?)';
                const values = [company_id, item.checklist_item_id, false];
                await pool.execute(sql, values);
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
