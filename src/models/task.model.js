const pool = require('../databases/mysql.db');


class Task {
    constructor(options) {
        this.completed = options.completed;
        this.title = options.title;
        this.body = options.body;
        this.staff_id  = options.staff_id ;
    }
    //create
    async save() {
        const sql = `INSERT INTO task (
            staff_id,
            completed,
            title,
            body
        ) VALUES (
            ${this.staff_id},
            ${this.completed}, 
            "${this.title}",
            "${this.body}"
        )`;
        const result = await pool.execute(sql);
        this.task_id = result[0].insertId;
        return this.task_id;
    }
    //get single company
    static async getTask(id) {
        const sql = `SELECT * FROM task WHERE task_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //get all
    static async getAll() {
        const sql = 'SELECT * FROM task';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    //update
    async update_Task(id) {
        const sql = `UPDATE task SET 
        completed = "${this.completed}", 
        title = "${this.title}",
        body = "${this.body}"
        WHERE task_id = ${id}`;
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
