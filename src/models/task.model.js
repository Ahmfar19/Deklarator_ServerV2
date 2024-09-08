const { connectionManager } = require('../databases/connectionManagment');
const { removeLastComma } = require('../helpers/utils');

class Task {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.staff_created = options.staff_created;
        this.staff_assigned = options.staff_assigned;
        this.title = options.title;
        this.body = options.body;
        this.type_id = options.type_id;
        this.task_order = options.task_order;
        this.company_id = options.company_id;
        this.deadLine = options.deadLine;
    }

    async save() {
        const sql = `INSERT INTO task (
            type_id,
            staff_created,
            staff_assigned,
            company_id,
            title,
            body,
            deadLine,
            task_order 
        ) VALUES (
            ${this.type_id},
            ${this.staff_created},
            ${this.staff_assigned},
            ${this.company_id},
            "${this.title}",
            "${this.body}",
            "${this.deadLine}",
            ${this.task_order}
        )`;

        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.task_id = result.insertId;
        return this.task_id;
    }

    static async getMulti(taskIds, connectionName) {
        const sql = `
            SELECT 
            task.*, 
            CONCAT(assigned_staff.fname, ' ', assigned_staff.lname) AS assigned,
            CONCAT(creator_staff.fname, ' ', creator_staff.lname) AS creator,
            assigned_staff.image,
            company.company_name
            FROM 
                task
            JOIN 
                staff AS assigned_staff ON task.staff_assigned = assigned_staff.staff_id
            JOIN 
                staff AS creator_staff ON task.staff_created = creator_staff.staff_id
            JOIN 
                company ON task.company_id = company.company_id

            WHERE task_id IN (${taskIds})
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    async saveMulti(connectionName) {
        // Validate that companyIds is an array
        if (!Array.isArray(this.company_id) || this.company_id.length === 0) {
            throw new Error('companyIds should be a non-empty array');
        }

        if (!Array.isArray(this.task_order) || this.task_order.length !== this.company_id.length) {
            throw new Error('newOrders should be an array with the same length as companyIds');
        }

        let values = '';
        for (let i = 0; i < this.company_id.length; i++) {
            values += `
                (${this.type_id},
                ${this.staff_created},
                ${this.staff_assigned},
                ${this.company_id[i]},
                '${this.title}',
                '${this.body}',
                '${this.deadLine}',
                ${this.task_order[i]}
            )
            `;

            // Add comma if it's not the last value
            if (i < this.company_id.length - 1) {
                values += ', ';
            }
        }

        const sql = `INSERT INTO task (
            type_id,
            staff_created,
            staff_assigned,
            company_id,
            title,
            body,
            deadLine,
            task_order
        ) VALUES ${values}`;

        const result = await connectionManager.executeQuery(connectionName, sql);

        const insertedTaskIds = [];
        for (let i = 0; i < result.affectedRows; i++) {
            insertedTaskIds.push(result.insertId + i);
        }

        const insertedTasks = await Task.getMulti(insertedTaskIds, connectionName);
        return insertedTasks || [];
    }

    static async getTask(id, connectionName) {
        const sql = `SELECT * FROM task WHERE task_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getTypes(connectionName) {
        const sql = 'SELECT * FROM task_type';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getAll(connectionName) {
        const sql = `
        SELECT 
        task.*, 
        CONCAT(assigned_staff.fname, ' ', assigned_staff.lname) AS assigned,
        CONCAT(creator_staff.fname, ' ', creator_staff.lname) AS creator,
        assigned_staff.image,
        company.company_name
        FROM 
            task
        JOIN 
            staff AS assigned_staff ON task.staff_assigned = assigned_staff.staff_id
        JOIN 
            staff AS creator_staff ON task.staff_created = creator_staff.staff_id
        JOIN 
            company ON task.company_id = company.company_id;
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    async updateTask(id, connectionName) {
        let sql = 'UPDATE task SET';

        if (this.type_id) {
            sql += ` type_id = ${this.type_id},`;
        }
        if (this.staff_created) {
            sql += ` staff_created = ${this.staff_created},`;
        }
        if (this.staff_assigned) {
            sql += ` staff_assigned = ${this.staff_assigned},`;
        }
        if (this.title) {
            sql += ` title = "${this.title}",`;
        }
        if (this.body) {
            sql += ` body = "${this.body}",`;
        }
        if (this.deadLine) {
            sql += ` deadLine = '${this.deadLine}',`;
        }
        if (this.task_order != undefined) {
            sql += ` task_order = ${this.task_order}`;
        }
        sql = removeLastComma(sql);
        sql += ` WHERE task_id = ${id}`;

        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async delete_Task(id, connectionName) {
        const sql = `DELETE FROM task WHERE task_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Task;
