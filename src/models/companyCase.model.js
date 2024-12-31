const pool = require('../databases/mysql.db');

class CompanyCase {
    constructor(options) {
        this.case_id = options.case_id;
        this.staff_id = +options.staff_id;
        this.staff_assigned = +options.staff_assigned;
        this.company_id = +options.company_id;
        this.case_name = options.case_name;
        this.case_description = options.case_description;
        this.case_status = +options.case_status;
        this.case_created = options.case_created;
        this.case_completed = options.case_completed || '0000-00-00';
    }

    async save() {
        const sql = `INSERT INTO company_case (
            staff_id,
            staff_assigned,
            company_id,
            case_name,
            case_description,
            case_status,
            case_created,
            case_completed
        ) VALUES (
            ${this.staff_id},
            ${this.staff_assigned},
            ${this.company_id},
            "${this.case_name}",
            "${this.case_description}",
            ${this.case_status},
            "${this.case_created}",
            "${this.case_completed}"
        )`;
        const [result] = await pool.execute(sql);
        return result.insertId;
    }

    static async getAll() {
        const sql = `
        SELECT 
            company_case.*,
            DATE_FORMAT(company_case.case_created, "%Y-%m-%d") AS case_created,
            DATE_FORMAT(company_case.case_completed,"%Y-%m-%d") AS case_completed,
            CONCAT(staff.fname, ' ', staff.lname) AS staff_assigned_name,
            company.company_name,
            company.email,
            company_case_status.case_status_name AS status_name
        FROM company_case
        JOIN company ON company_case.company_id = company.company_id
        JOIN staff ON company_case.staff_assigned = staff.staff_id
        JOIN company_case_status ON company_case.case_status = company_case_status.case_status_id
        ORDER BY company_case.case_id ASC`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getCase(id) {
        const sql = `
        SELECT 
            company_case.*,
            DATE_FORMAT(company_case.case_created, "%Y-%m-%d") AS case_created,
            DATE_FORMAT(company_case.case_completed,"%Y-%m-%d") AS case_completed,
            CONCAT(staff.fname, ' ', staff.lname) AS staff_assigned_name,
            company.company_name,
            company.email,
            company_case_status.case_status_name AS status_name
        FROM company_case
        JOIN company ON company_case.company_id = company.company_id
        JOIN staff ON company_case.staff_assigned = staff.staff_id
        JOIN company_case_status ON company_case.case_status = company_case_status.case_status_id
        WHERE company_case.case_id = ${id}
        ORDER BY company_case.case_id ASC`;
        const [rows] = await pool.execute(sql);
        return rows[0];
    }

    static async getCompanyCase(id) {
        const sql = `
        SELECT 
            company_case.*,
            DATE_FORMAT(company_case.case_created, "%Y-%m-%d") AS case_created,
            DATE_FORMAT(company_case.case_completed,"%Y-%m-%d") AS case_completed,
            CONCAT(staff.fname, ' ', staff.lname) AS staff_assigned_name,
            company.company_name,
            company.email,
            company_case_status.case_status_name AS status_name
        FROM company_case
        JOIN company ON company_case.company_id = company.company_id
        JOIN staff ON company_case.staff_assigned = staff.staff_id
        JOIN company_case_status ON company_case.case_status = company_case_status.case_status_id
        WHERE company_case.company_id = ${id}
        ORDER BY company_case.case_id ASC`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getCaseActivity(id) {
        const sql = `
        SELECT 
            company_case_activity.*,
            DATE_FORMAT(company_case_activity.activity_date, "%Y-%m-%d") AS activity_date,
            CONCAT(staff.fname, ' ', staff.lname) AS staff_name
        FROM company_case_activity
        JOIN staff ON company_case_activity.staff_id = staff.staff_id
        WHERE company_case_activity.case_id = ${id}
        ORDER BY company_case_activity.activity_id ASC`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async update(id) {
        const sql = `UPDATE company_case SET 
            staff_assigned = ${this.staff_assigned},
            case_name = "${this.case_name}",
            case_description = "${this.case_description}",
            case_status = ${this.case_status},
            case_created = "${this.case_created}",
            case_completed = "${this.case_completed}"
        WHERE case_id = ${id}`;
        await pool.execute(sql);
    }

    static async deleteByCaseId(id) {
        const sql = `DELETE FROM company_case WHERE case_id = ${id}`;
        await pool.execute(sql);
    }

    static async checkIfCaseExisted(id) {
        const sql = `SELECT * FROM company_case WHERE case_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows.length > 0;
    }

    static async addActivity(values) {
        const sql = `INSERT INTO company_case_activity
            (
                activity_text,
                case_id,
                staff_id,
                activity_title,
                activity_date
            )
            VALUES (?, ?, ?, ?, ?)

        `;
        const [result] = await pool.execute(sql, [
            values.activity_text,
            values.case_id,
            values.staff_id,
            values.activity_title,
            values.activity_date,
        ]);
        return result.insertId;
    }

    static async deleteByActivityId(id) {
        const sql = `DELETE FROM company_case_activity WHERE activity_id = ${id}`;
        await pool.execute(sql);
    }

    static async updateCaseActivity(values) {
        const sql = `UPDATE company_case_activity SET 
            activity_text = "${values.activity_text}",
            activity_title = "${values.activity_title}",
            activity_date = "${values.activity_date}"
        WHERE activity_id = ${values.activity_id}`;
        await pool.execute(sql);
    }
}

module.exports = CompanyCase;
