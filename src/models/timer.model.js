const { connectionManager } = require('../databases/connectionManagment');

class Timer {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.staff_id = options.staff_id;
        this.counted_time = options.counted_time;
    }
    // create
    async save() {
        const sql = `INSERT INTO timer (
            staff_id,
            counted_time
        ) VALUES (
            ${this.staff_id}, 
            "${this.counted_time}"
        )`;

        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.timer_id = result.insertId;
        return this.timer_id;
    }
    // get single timer
    static async getTimer(id, connectionName) {
        const sql = `SELECT * FROM timer WHERE staff_id="${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // get all
    static async getAll(connectionName) {
        const sql = 'SELECT * FROM timer';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // update
    async updateTimer(id, connectionName) {
        const sql = `UPDATE timer SET 
        counted_time = "${this.counted_time}" 
        WHERE timer_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // delete
    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM timer WHERE staff_id="${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Timer;
