const pool = require('../databases/mysql.db');


class Task {
    constructor(options) {
        this.staff_created = options.staff_created;
        this.staff_assigned = options.staff_assigned;
        this.title = options.title;
        this.body  = options.body;
        this.type_id = options.type_id;
        this.task_order = options.task_order;
    }

    async save() {
        const sql = `INSERT INTO task (
            type_id,
            staff_created,
            staff_assigned,
            title,
            body,
            task_order
        ) VALUES (
            ${this.type_id},
            ${this.staff_created},
            ${this.staff_assigned}, 
            "${this.title}",
            "${this.body}",
            ${this.task_order}
        )`;
        const result = await pool.execute(sql);
        this.task_id = result[0].insertId;
        return this.task_id;
    }

    static async getTask(id) {
        const sql = `SELECT * FROM task WHERE task_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getTypes() {
        const sql = 'SELECT * FROM task_type';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getAll() {
        const sql = `
        SELECT task.*, CONCAT(staff.fname, ' ', staff.lname) AS assigned
        FROM task
        JOIN staff on task.staff_assigned = staff.staff_id`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateTask(id) {
        let sql = 'UPDATE task SET';

        if (this.type_id) {
            sql += ` type_id = ${this.type_id}`
        }
        if (this.staff_created) {
            sql += `, staff_created = ${this.staff_created}`
        }
        if (this.staff_assigned) {
            sql += `, staff_assigned = ${this.staff_assigned}`
        }
        if (this.title) {
            sql += `, title = "${this.title}"`
        }
        if (this.body) {
            sql += `, body = "${this.body}"`
        }
        if (this.task_order != undefined) {
            sql += `, task_order = ${this.task_order}`
        }
        sql += ` WHERE task_id = ${id}`
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async delete_Task(id) {
        const sql = `DELETE FROM task WHERE task_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Task;
