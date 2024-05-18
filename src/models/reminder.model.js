const pool = require('../databases/mysql.db');

class Reminder {
    constructor(options) {
        this.company_id = options.company_id;
        this.staff_id = options.staff_id;
        this.tamplate_id = options.tamplate_id;
        this.remender_date = options.remender_date;
        this.recurrent = options.recurrent || 0;
    }

    async save() {
        const sql = `INSERT INTO reminder (
            company_id,
            staff_id,
            tamplate_id,
            remender_date,
            recurrent
        ) VALUES (
            ${this.company_id},
            ${this.staff_id},
            ${this.tamplate_id},
            "${this.remender_date}", 
            ${this.recurrent}
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
        const sql = `
        SELECT reminder.*, company.company_name, DATE_FORMAT(reminder.remender_date, "%Y-%m-%d") AS remender_date
        FROM reminder
        JOIN company ON reminder.company_id = company.company_id;`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateReminder(id) {
        const sql = `UPDATE reminder SET 
        company_id = ${this.company_id},
        remender_date = "${this.remender_date}",
        recurrent = ${this.recurrent}
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
        const isoDate = currentDate.toISOString(); // Convert to ISO format
        const [year, month, day] = isoDate.split('T')[0].split('-'); // Extract year, month, and day from ISO format

        const sql = `SELECT YEAR(remender_date) AS year, MONTH(remender_date) AS month, DAY(remender_date) AS day,
        c.email AS company_email , remender_id, recurrent , t.tamplate_name, c.company_name
        FROM reminder 
        INNER JOIN company AS c ON reminder.company_id = c.company_id
        INNER JOIN tamplate AS t ON reminder.tamplate_id = t.tamplate_id
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

    static async getReminderByCompanyId(id) {
        const sql = `SELECT * FROM reminder WHERE company_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Reminder;
