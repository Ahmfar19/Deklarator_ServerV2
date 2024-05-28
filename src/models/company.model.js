const  MySQLConnectionManager  = require('../databases/connectionManagment');
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
        
        const result = await MySQLConnectionManager.executeQuery(this.connectionName, sql);
        
        this.company_id = result.insertId;
        return this.company_id;
    }

    static async getCompany(id, connectionName) {
        const sql = `SELECT * FROM company WHERE company_id = "${id}"`;
        const [rows] = await MySQLConnectionManager.executeQuery(connectionName, sql);
        return rows;
    }

    static async getAll(connectionName) {
        const sql = 'SELECT * FROM company';
        const [rows] = await MySQLConnectionManager.executeQuery(connectionName, sql);
        return rows;
    }

    async updateCompany(id) {
        const sql = `UPDATE company SET 
        type_id = "${this.type_id}", 
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
        const [rows] = await MySQLConnectionManager.executeQuery(this.connectionName, sql);
        return rows;
    }

    static async findByIdAndDelete(id, connectionName) {
        const sql = `DELETE FROM company WHERE company_id = "${id}"`;
        const [rows] = await MySQLConnectionManager.executeQuery(connectionName, sql);
        return rows;
    }

}

module.exports = Company;