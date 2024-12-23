const pool = require('../databases/mysql.db');

class Company {
    constructor(options) {
        this.type_id = options.type_id;
        this.company_name = options.company_name;
        this.organization_number = options.organization_number;
        this.contact_person = options.contact_person;
        this.address = options.address;
        this.postcode = options.postcode;
        this.city = options.city;
        this.email = options.email;
        this.phone = options.phone;
        this.hour_cost = options.hour_cost;
        this.isActive = options.isActive;
    }
    // create
    async save() {
        const sql = `INSERT INTO company (
            type_id,
            company_name,
            organization_number,
            contact_person,
            address,
            postcode,
            city,
            email,
            phone,
            hour_cost,
            isActive
        ) VALUES (
            ${this.type_id}, 
            "${this.company_name}", 
            "${this.organization_number}",
            "${this.contact_person}", 
            "${this.address}",
            ${this.postcode},
            "${this.city}", 
            "${this.email}",
            ${this.phone},
            ${this.hour_cost},
            ${this.isActive ?? true}
        )`;
        const result = await pool.execute(sql);
        this.company_id = result[0].insertId;
        return this.company_id;
    }
    // get single company
    static async getCompany(id) {
        const sql = `SELECT * FROM company WHERE company_id = "${id}"`;
        // eslint-disable-next-line no-unused-vars
        const [rows, fields] = await pool.execute(sql);
        return rows;
    }
    // get all
    static async getAll() {
        const sql = `
            SELECT company.*, type_name 
            FROM company
            JOIN company_type ON company.type_id = company_type.type_id;
        `;
        // eslint-disable-next-line no-unused-vars
        const [rows, fields] = await pool.execute(sql);
        return rows;
    }
    // update
    async updateCompany(id) {
        const sql = `
            UPDATE company SET 
            type_id = ?, 
            company_name = ?, 
            organization_number = ?, 
            contact_person = ?, 
            address = ?, 
            postcode = ?, 
            city = ?, 
            email = ?, 
            phone = ?, 
            hour_cost = ?, 
            isActive = ? 
            WHERE company_id = ?`;

        const values = [
            this.type_id,
            this.company_name,
            this.organization_number,
            this.contact_person,
            this.address,
            this.postcode,
            this.city,
            this.email,
            this.phone,
            this.hour_cost,
            this.isActive,
            id,
        ];

        const [rows] = await pool.execute(sql, values);
        return rows;
    }
    // delete
    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM company WHERE company_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async checkIfCompanyExisted(email) {
        const sql = `SELECT * FROM company WHERE email = ?`;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
    }

    static async checkUpdateCompany(email, id) {
        const sql = `SELECT * FROM company WHERE (email = ?) AND company_id != ?`;
        const [rows] = await pool.execute(sql, [email, id]);
        return rows;
    }

    isValid() {
        let valid = true;
        for (const key in this) {
            const toValidate = [
                'company_name',
                'contact_person',
                'email',
                'hour_cost',
            ];
            if (toValidate.includes(key)) {
                if (!this[key]) {
                    valid = false;
                    break;
                } else if (typeof this[key] === 'string' && this[key]?.trim() === '') {
                    valid = false;
                    break;
                } else if (this[key] === '') {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    }
}

module.exports = Company;
