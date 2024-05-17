const pool = require('../databases/mysql.db');


class CheckList {
    constructor(options) {
        this.text = options.text;
    }

    //get all
    static async getAll() {
        const sql = 'SELECT * FROM checklist';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateCheck(id){
        const sql = `UPDATE checklist SET 
        company_id = ${this.company_id},
        completed = ${this.completed}
        WHERE item_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = CheckList;
