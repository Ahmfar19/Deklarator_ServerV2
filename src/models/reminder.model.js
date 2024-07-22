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

    async saveMulti() {
        // Validate that companyIds is an array
        if (!Array.isArray(this.company_id) || this.company_id.length === 0) {
            throw new Error('companyIds should be a non-empty array');
        }

        let values = '';
        for (let i = 0; i < this.company_id.length; i++) {
            values += `
                (${this.company_id[i]},
                ${this.staff_id},
                ${this.tamplate_id},
                "${this.remender_date}", 
                ${this.recurrent})
            `;

            // Add comma if it's not the last value
            if (i < this.company_id.length - 1) {
                values += ', ';
            }
        }

        const sql = `INSERT INTO reminder (
            company_id,
            staff_id,
            tamplate_id,
            remender_date,
            recurrent
        ) VALUES ${values}`;

        const [result] = await pool.execute(sql);
        const data = await this.geRangeReminder(result.insertId, result.insertId + result.affectedRows - 1);
        return data;
    }

    static async getReminder(id) {
        const sql = `SELECT * FROM reminder WHERE remender_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getReminderByFilter(key, value) {
        const sql = `
        SELECT reminder.*, company.company_name, DATE_FORMAT(reminder.remender_date, "%Y-%m-%d") AS remender_date
        FROM reminder
        JOIN company ON reminder.company_id = company.company_id
        WHERE ${key} = '${value}';
    `;
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
        tamplate_id = "${this.tamplate_id}",
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
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Adding 1 to match SQL month format
        const day = currentDate.getDate();

        const sql = `SELECT YEAR(remender_date) AS year, 
        MONTH(remender_date) AS month, 
        DAY(remender_date) AS day,
        c.email AS company_email, 
        remender_id, recurrent, 
        t.tamplate_body,
        t.tamplate_name,  
        t.tamplate_id,
        c.company_name
        FROM reminder 
        INNER JOIN company AS c ON reminder.company_id = c.company_id
        INNER JOIN tamplate AS t ON reminder.tamplate_id = t.tamplate_id
        WHERE remender_date = '${year}-${month}-${day}'`;

        const [rows] = await pool.execute(sql);
        return rows;
    }

    // 1
    static async updateReminderEveryMonth(id) {
        // Get the current date
        const currentDate = new Date();
        // Add one month to the current date
        const remenderDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        // Format the date in the desired format (e.g., "YYYY-MM-DD")
        const year = remenderDate.getFullYear();
        const month = String(remenderDate.getMonth() + 1).padStart(2, '0');
        const day = String(remenderDate.getDate()).padStart(2, '0');
        const formattedRemenderDate = `${year}-${month}-${day}`;

        const sql = `
          UPDATE reminder
          SET remender_date = ?
          WHERE remender_id = ?
        `;

        const [rows] = await pool.execute(sql, [formattedRemenderDate, id]);
        return rows;
    }

    // 2
    static async updateReminderEveryWeek(id) {
        const currentDate = new Date();
        // Add 7 days (1 week) to the current date
        const reminderDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
        // Format the date in the desired format (e.g., "YYYY-MM-DD")
        const year = reminderDate.getFullYear();
        const month = String(reminderDate.getMonth() + 1).padStart(2, '0');
        const day = String(reminderDate.getDate()).padStart(2, '0');
        const formattedReminderDate = `${year}-${month}-${day}`;

        const sql = `
        UPDATE reminder
        SET remender_date = ?
        WHERE remender_id = ?
      `;

        const [rows] = await pool.execute(sql, [formattedReminderDate, id]);
        return rows;
    }

    // 3
    static async updateReminderEveryTwoWeek(id) {
        const currentDate = new Date();

        // Add 14 days (2 weeks) to the current date
        const reminderDate = new Date(currentDate.setDate(currentDate.getDate() + 14));

        // Format the date in the desired format (e.g., "YYYY-MM-DD")
        const year = reminderDate.getFullYear();
        const month = String(reminderDate.getMonth() + 1).padStart(2, '0');
        const day = String(reminderDate.getDate()).padStart(2, '0');
        const formattedReminderDate = `${year}-${month}-${day}`;

        const sql = `
        UPDATE reminder
        SET remender_date = ?
        WHERE remender_id = ?
      `;

        const [rows] = await pool.execute(sql, [formattedReminderDate, id]);
        return rows;
    }

    // 4
    static async updateReminderEveryThreeWeek(id) {
        const currentDate = new Date();
        // Add 14 days (2 weeks) to the current date
        const reminderDate = new Date(currentDate.setDate(currentDate.getDate() + 21));
        // Format the date in the desired format (e.g., "YYYY-MM-DD")
        const year = reminderDate.getFullYear();
        const month = String(reminderDate.getMonth() + 1).padStart(2, '0');
        const day = String(reminderDate.getDate()).padStart(2, '0');
        const formattedReminderDate = `${year}-${month}-${day}`;

        const sql = `
        UPDATE reminder
        SET remender_date = ?
        WHERE remender_id = ?
      `;

        const [rows] = await pool.execute(sql, [formattedReminderDate, id]);
        return rows;
    }

    // 5
    static async updataReminderEveryFirstDayInWeek(id) {
        // Get the current date
        const currentDate = new Date();

        // Calculate the first day of the current week
        const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));

        // Calculate the first day of the next week
        const firstDayOfNextWeek = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 7));

        // Format the date in the desired format (e.g., "YYYY-MM-DD")
        const formattedFirstDayOfNextWeek = firstDayOfNextWeek.toISOString().slice(0, 10);

        const sql = `
        UPDATE reminder
        SET remender_date = ?
        WHERE remender_id = ?
      `;

        const [rows] = await pool.execute(sql, [formattedFirstDayOfNextWeek, id]);
        return rows;
    }

    static async getReminderByCompanyId(id) {
        const sql = `
        SELECT reminder.*, company.company_name, DATE_FORMAT(reminder.remender_date, "%Y-%m-%d") AS remender_date
        FROM reminder
        JOIN company ON reminder.company_id = company.company_id
        WHERE company.company_id = ${id};
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async geRangeReminder(from, to) {
        const sql = `
            SELECT reminder.*, company.company_name, DATE_FORMAT(reminder.remender_date, "%Y-%m-%d") AS remender_date
            FROM reminder
            JOIN company ON reminder.company_id = company.company_id
            WHERE remender_id >= ${from} AND remender_id <= ${to};
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Reminder;
