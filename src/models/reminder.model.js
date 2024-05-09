const pool = require('../databases/mysql.db');

class Reminder {
    constructor(options) {
        this.company_id = options.company_id;
        this.staff_id = options.staff_id;
        this.remender_date = options.remender_date;
        this.recurrent = options.recurrent;
        this.title = options.title;
        this.body = options.body;
    }
    
    async save() {
        const sql = `INSERT INTO reminder (
            company_id,
            staff_id,
            remender_date,
            recurrent,
            title,
            body
        ) VALUES (
            ${this.company_id},
            ${this.staff_id},
            "${this.remender_date}", 
            ${this.recurrent},
            "${this.title}", 
            "${this.body}"
        )`;
        const result = await pool.execute(sql);
        this.remender_id = result[0].insertId;
        return this.remender_id;
    }

    static async getReminder(id) {
        const sql = `SELECT * FROM reminder WHERE remender_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getAll() {
        const sql = 'SELECT * FROM reminder';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateReminder(id) {
        const sql = `UPDATE reminder SET 
        remender_date = "${this.remender_date}",
        recurrent = ${this.recurrent},
        title = "${this.title}", 
        body = "${this.body}"
        WHERE remender_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async deleteReminder(id) {
        const sql = `DELETE FROM reminder WHERE remender_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getReminders() {

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Adding 1 to match SQL month format
        const day = currentDate.getDate();

        const sql = `SELECT YEAR(remender_date) AS year, MONTH(remender_date) AS month, DAY(remender_date) AS day,
        c.email AS company_email , remender_id, recurrent 
        FROM reminder 
        INNER JOIN company AS c ON reminder.company_id = c.company_id
        WHERE YEAR(remender_date) = ${year} AND MONTH(remender_date) = ${month} AND DAY(remender_date) = ${day}`;

        const [rows] = await pool.execute(sql);

        return rows;
    }

    static async updateReminder(id) {
        // Get the current date
        const currentDate = new Date();
        // Add one month to the current date
        const remenderDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        // Format the date in the desired format (e.g., "YYYY-MM-DD")
        const formattedRemenderDate = remenderDate.toISOString().slice(0, 10);
      
        const sql = `
          UPDATE reminder
          SET remender_date = ?
          WHERE remender_id = ?
        `;
      
        const [rows] = await pool.execute(sql, [formattedRemenderDate, id]);
        return rows;
      }
}

module.exports = Reminder;
