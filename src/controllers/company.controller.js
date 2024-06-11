const Company = require('../models/company.model');
const CheckList = require('../models/checkList.model');
const { sendResponse } = require('../helpers/apiResponse');
const path = require('path');
const fs = require('fs');

const getSingleCompany = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const singleCompany = await Company.getCompany(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the company', null, singleCompany);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getCompanys = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const companys = await Company.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the company', null, companys);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const addCompany = async (req, res) => {
    try {
        const connectionName = req.customerId;

        const checkCompany = await Company.checkIfCompanyExisted(req.body.email, connectionName);

        if (checkCompany.length) {
            return sendResponse(res, 406, 'Not Acceptable', 'company email already existed.', null, null);
        }

        const company = new Company(req.body, connectionName);

        const isValid = company.isValid();
        if (!isValid) {
            return res.status(400).send(
                { statusCode: 400, statusMessage: 'Bad Request', message: null, data: null },
            );
        }
        await company.save();

        CheckList.createCompanyCheckList(company.company_id, connectionName);

        sendResponse(res, 201, 'Created', 'Successfully created a company.', null, company);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const updateCompany = async (req, res) => {
    try {
        const connectionName = req.customerId;

        const id = req.params.id;

        const checkCompany = await Company.checkUpdateCompany(req.body.email, id, connectionName);

        if (checkCompany.length) {
            return sendResponse(res, 406, 'Not Acceptable', 'company email already taken.', null, null);
        }
        const company = new Company(req.body);

        const isValid = company.isValid();

        if (!isValid) {
            return res.status(400).send(
                { statusCode: 400, statusMessage: 'Bad Request', message: 'No valid request data', data: null },
            );
        }
        const data = await company.updateCompany(id, connectionName);

        if (data.affectedRows === 0) {
            throw new Error('No company found for update');
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a company.', null, company);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const deleteCompany = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const data = await Company.findByIdAndDelete(id, connectionName);
        if (data.affectedRows === 0) {
            throw new Error('No company found for deletion');
        }
        const filePath = path.join(__dirname, `../../assets/${connectionName}/files`, id);

        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath, { recursive: true });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully deleted a company.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getCompanys,
    getSingleCompany,
    addCompany,
    updateCompany,
    deleteCompany,
};
