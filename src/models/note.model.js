const pool = require('../databases/mysql.db');

class Note {
    constructor(options) {
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
        const result = await pool.execute(sql);
        this.note_id = result[0].insertId;
        return this.note_id;
    }
    // get single company
    static async getNoteById(id) {
        const sql = `SELECT * FROM note WHERE note_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    // get all
    static async getAll() {
        const sql = 'SELECT * FROM note';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    // update
    async updateNote(id) {
        const sql = `UPDATE note SET 
        note_title = "${this.note_title}", 
        note_text = "${this.note_text}", 
        note_date = "${this.note_date}"
        WHERE note_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    // delete
    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM note WHERE note_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    // static async checkIfNoteExisted(id) {
    //     const sql = `SELECT * FROM note WHERE note_id = "${id}"`;
    //     const [rows] = await pool.execute(sql);
    //     return rows;
    // }

    static async getNotesByCompanyId(id) {
        const sql = `SELECT *, DATE_FORMAT(note_date, "%Y-%m-%d") AS note_date FROM note WHERE company_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Note;
