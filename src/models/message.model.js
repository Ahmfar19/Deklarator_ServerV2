const pool = require('../databases/mysql.db');


class Message {
    constructor(options) {
        this.company_name = options.company_name;
        this.organization_number = options.organization_number;
        this.contact_person = options.contact_person;
        this.address = options.address;
        this.postcode = options.postcode;
        this.city = options.city;
        this.email = options.email;
        this.phone = options.phone;
        this.hour_cost = options.hour_cost;
    }
    //create
    async save() {
        const sql = `INSERT INTO company (
            company_name,
            organization_number,
            contact_person,
            address,
            postcode,
            city,
            email,
            phone,
            hour_cost
        ) VALUES (
            "${this.company_name}", 
            "${this.organization_number}",
            "${this.contact_person}", 
            "${this.address}",
            ${this.postcode},
            "${this.city}", 
            "${this.email}",
            ${this.phone},
            ${this.hour_cost}
        )`;
        const result = await pool.execute(sql);
        this.company_id = result[0].insertId;
        return this.company_id;
    }
    //get single company
    static async getMessage(id) {
        const sql = `SELECT * FROM company WHERE company_id = "${id}"`;
        // eslint-disable-next-line no-unused-vars
        const [rows, fields] = await pool.execute(sql);
        return rows;
    }
    //get all
    static async getAll() {
        const sql = 'SELECT * FROM company';
        // eslint-disable-next-line no-unused-vars
        const [rows, fields] = await pool.execute(sql);
        return rows;
    }
    //update
    async updateMessage(id) {
        const sql = `UPDATE company SET 
        company_name = "${this.company_name}", 
        organization_number = "${this.organization_number}",
        contact_person = "${this.contact_person}", 
        address = "${this.address}",
        postcode = ${this.postcode}, 
        city = "${this.city}",
        email = "${this.email}", 
        phone = ${this.phone},
        hour_cost = ${this.hour_cost}
        WHERE company_id = ${id}`;
        await pool.execute(sql);
    }

 
}

module.exports = Message;
