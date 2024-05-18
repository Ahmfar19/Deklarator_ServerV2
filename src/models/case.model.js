const pool = require('../databases/mysql.db');
class Case {
    constructor(options) {
        this.company_id = options.company_id;
        this.staff_id = options.staff_id;
        this.type_id = options.type_id;
        this.date = options.date;
    }
    // create
    async save() {
        const sql = `INSERT INTO cases (
            company_id,
            staff_id,
            type_id,
            date
        ) VALUES (
            ${this.company_id}, 
            ${this.staff_id},
            ${this.type_id}, 
            "${this.date}"
        )`;
        await pool.execute(sql);
    }
    // get all
    static async getAll() {
        const sql = 'SELECT * FROM  cases';
        // eslint-disable-next-line no-unused-vars
        const [rows] = await pool.execute(sql);
        return rows;
    }
    // get single caseType
    static async getCase(id) {
        const sql = `SELECT * FROM cases WHERE case_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    // update
    async update(id) {
        const sql = `UPDATE cases SET 
        case_id = "${this.case_name}"
        WHERE type_id = ${id}`;
        await pool.execute(sql);
    }
    // delete
    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM case_type WHERE type_id = "${id}"`;
        await pool.execute(sql);
    }

    static async checkIfCaseExisted(id) {
        const sql = `SELECT * FROM cases WHERE case_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Case;
