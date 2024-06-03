const { connectionManager } = require('../databases/connectionManagment');

class Note {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.staff_id = options.staff_id;
        this.company_id = options.company_id;
        this.note_title = options.note_title;
        this.note_text = options.note_text;
        this.note_date = options.note_date;
    }
    // create
    async save() {
        const sql = `INSERT INTO note (
            staff_id,
            company_id,
            note_title,
            note_text,
            note_date   
        ) VALUES (
            ${this.staff_id},
            ${this.company_id},
           " ${this.note_title}",
           " ${this.note_text}",
            "${this.note_date}"          
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.note_id = result.insertId;
        return this.note_id;
    }
    // get single company
    static async getNoteById(id, connectionName) {
        const sql =
            `SELECT note_id, staff_id, company_id, note_title, note_text, DATE_FORMAT(note_date, '%Y-%m-%d') AS note_date FROM note WHERE note_id = '${id}'`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // get all
    static async getAll(connectionName) {
        const sql =
            "SELECT note_id, staff_id, company_id, note_title, note_text, DATE_FORMAT(note_date, '%Y-%m-%d') AS note_date FROM note";
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // update
    async updateNote(id, connectionName) {
        const sql = `UPDATE note SET 
        note_title = "${this.note_title}", 
        note_text = "${this.note_text}", 
        note_date = "${this.note_date}"
        WHERE note_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // delete
    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM note WHERE note_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getNotesByCompanyId(id, connectionName) {
        const sql = `SELECT *, DATE_FORMAT(note_date, "%Y-%m-%d") AS note_date FROM note WHERE company_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
}

module.exports = Note;
