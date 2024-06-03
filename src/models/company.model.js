const { connectionManager } = require('../databases/connectionManagment');
class Company {
    constructor(options, connectionName) {
        this.connectionName = connectionName;
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
            hour_cost
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
            ${this.hour_cost}
        )`;
        const result = await connectionManager.executeQuery(this.connectionName, sql);
        this.company_id = result.insertId;
        return this.company_id;
    }
    // get single company
    static async getCompany(id, connectionName) {
        const sql = `SELECT * FROM company WHERE company_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // get all
    static async getAll(connectionName) {
        const sql = `
            SELECT company.*, type_name 
            FROM company
            JOIN company_type ON company.type_id = company_type.type_id;
        `;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // update
    async updateCompany(id, connectionName) {
        const sql = `UPDATE company SET 
        type_id = ${this.type_id}, 
        company_name = "${this.company_name}", 
        organization_number = "${this.organization_number}",
        contact_person = "${this.contact_person}", 
        address = "${this.address}",
        postcode = ${this.postcode}, 
        city = "${this.city}",
        email = "${this.email}", 
        phone = "${this.phone}",
        hour_cost = ${this.hour_cost}
        WHERE company_id = ${id}`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }
    // delete
    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM company WHERE company_id = "${id}"`;
        const result = await connectionManager.executeQuery(connectionName, sql);
        return result;
    }

    static async checkIfCompanyExisted(email, connectionName) {
        const sql = `SELECT * FROM company WHERE email = ?`;
        const result = await connectionManager.executeQuery(connectionName, sql, [email]);
        return result;
    }

    static async checkUpdateCompany(email, id, connectionName) {
        const sql = `SELECT * FROM company WHERE (email = ?) AND company_id != ?`;
        const result = await connectionManager.executeQuery(connectionName, sql, [email, id]);
        return result;
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
