const { connectionManager } = require('../databases/connectionManagment');
class TimeStamp {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
        this.type_id = options.type_id;
        this.staff_id = options.staff_id;
        this.company_id = options.company_id;
        this.stamp_date = options.stamp_date;
        this.stamp_in = options.stamp_in;
        this.stamp_out = options.stamp_out;
        this.time = options.time;
    }
    // create
    async save() {
        const sql = `INSERT INTO time_stamp (
            type_id,
            staff_id,
            company_id,
            stamp_date,
            time
        ) VALUES (
            ${this.type_id}, 
            ${this.staff_id}, 
            ${this.company_id}, 
            "${this.stamp_date}", 
            "${this.time}"
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.stamp_id = result.insertId;
        return this.stamp_id;
    }
    // get all
    static async getAll(connectionName) {
        const sql = 'SELECT *, DATE_FORMAT(stamp_date, "%Y-%m-%d") AS stamp_date FROM time_stamp';
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // get single caseType
    static async getSingle(id, connectionName) {
        const sql =
            `SELECT *, DATE_FORMAT(stamp_date, "%Y-%m-%d") AS stamp_date FROM time_stamp WHERE stamp_id  = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // update
    async update(id, connectionName) {
        const sql = `UPDATE time_stamp SET 
        type_id = "${this.type_id}",
        company_id = "${this.company_id}",
        stamp_date = "${this.stamp_date}", 
        time = "${this.time}"
        WHERE stamp_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // delete
    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM time_stamp WHERE stamp_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    // get relationShip fields with timeStamp
    static async getTimeStampOverView(connectionName) {
        const sql = `SELECT 
        staff.*,
        company.*,
        time_stamp.*,
        timestamp_type.*,
        DATE_FORMAT(stamp_date, '%Y-%m-%d') AS stamp_date
        FROM time_stamp JOIN 
        company ON time_stamp.company_id = company.company_id 
        JOIN staff ON time_stamp.staff_id = staff.staff_id 
        JOIN timestamp_type ON time_stamp.type_id = timestamp_type.type_id
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    // getFilter With Year-Month
    static async getFilterByYearMonth(year, month, connectionName) {
        const sql =
            'SELECT *, DATE_FORMAT(stamp_date, "%Y-%m-%d") AS stamp_date FROM time_stamp WHERE MONTH(time_stamp.stamp_date) = ? AND YEAR(time_stamp.stamp_date) = ?';
        const params = [month, year];
        const result = await connectionManager.executeQuery(connectionName, sql, params);
        return result;
    }

    // Filter timeStampsBy userId(Staff_id)
    static async getTimeStampsByStaff_id(staff_id, connectionName) {
        const sql = `SELECT * FROM time_stamp WHERE staff_id = ${staff_id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    // get Last x of timeStamp
    static async getLatestTimeStamps(number, connectionName) {
        const sql = `SELECT 
        ts.stamp_id, 
        ts.time, 
        DATE_FORMAT(ts.stamp_date, "%Y-%m-%d") AS stamp_date, 
        c.company_name, CONCAT(s.fname, ' ', s.lname) AS username, 
        tt.name_sv 
        FROM time_stamp AS ts 
        INNER JOIN company AS c ON ts.company_id = c.company_id 
        INNER JOIN staff AS s ON ts.staff_id = s.staff_id 
        INNER JOIN timestamp_type AS tt ON ts.type_id = tt.type_id ORDER BY ts.stamp_id 
        DESC LIMIT ${number}`;

        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    // get last x months from timeStamps
    static async getTimeStampsLastNMonths(months, connectionName) {
        const sql = `SELECT 
            ts.stamp_id, 
            ts.time, DATE_FORMAT(ts.stamp_date, "%Y-%m-%d") AS stamp_date, 
            c.company_name, CONCAT(s.fname, ' ', s.lname) AS username, 
            tt.name_sv 
            FROM time_stamp AS ts INNER JOIN company AS c ON ts.company_id = c.company_id INNER JOIN staff AS s ON ts.staff_id = s.staff_id INNER JOIN timestamp_type AS tt ON ts.type_id = tt.type_id 
            WHERE stamp_date >= NOW() - INTERVAL ${months} MONTH;`;

        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async getFilterBy_User_Company_type(
        user_id,
        company_id,
        type_id,
        from_yearMonth,
        to_yearMonth,
        from_date,
        to_date,
        stamp_id,
        connectionName,
    ) {
        let sql = `SELECT 
           ts.stamp_id, 
           ts.time, 
           DATE_FORMAT(ts.stamp_date, "%Y-%m-%d") AS stamp_date, 
           c.company_name,
           c.company_id,
           c.hour_cost,
           CONCAT(s.fname, ' ', s.lname) AS username , 
           tt.name_sv 
           FROM time_stamp AS ts 
           INNER JOIN company AS c ON ts.company_id = c.company_id 
           INNER JOIN staff AS s ON ts.staff_id = s.staff_id 
           INNER JOIN timestamp_type AS tt ON ts.type_id = tt.type_id`;

        let hasFilter = false;

        if (user_id) {
            sql = sql + ` AND s.staff_id = ${user_id}`;

            hasFilter = true;
        }

        if (company_id) {
            sql = sql + ` AND c.company_id = ${company_id}`;
            hasFilter = true;
        }

        if (type_id) {
            sql = sql + ` AND tt.type_id = ${type_id}`;
            hasFilter = true;
        }

        if (stamp_id) {
            sql = sql + ` AND ts.stamp_id = ${stamp_id}`;
            hasFilter = true;
        }

        if (from_yearMonth && !to_yearMonth) {
            const [year, month] = from_yearMonth.split('-');
            sql = sql + ` AND YEAR(ts.stamp_date) = ${year} AND MONTH(ts.stamp_date) = ${month}`;
            hasFilter = true;
        }

        if (from_yearMonth && to_yearMonth) {
            const [fromYear, fromMonth] = from_yearMonth.split('-');
            const [toYear, toMonth] = to_yearMonth.split('-');
            sql = sql
                + ` AND DATE_FORMAT(ts.stamp_date, '%Y-%m') BETWEEN '${fromYear}-${
                    fromMonth.padStart(2, '0')
                }' AND '${toYear}-${toMonth.padStart(2, '0')}'`;
            hasFilter = true;
        }

        if (from_date && !to_date) {
            sql = sql + ` AND DATE(ts.stamp_date) = ${from_date}`;
            hasFilter = true;
        }
        if (from_date && to_date) {
            sql = sql + ` AND DATE(ts.stamp_date) BETWEEN '${from_date}' AND '${to_date}'`;
            hasFilter = true;
        }

        if (!hasFilter) {
            return [];
        }

        const result = await connectionManager.executeQuery(connectionName, sql);

        return result;
    }
}

module.exports = TimeStamp;
