const Company = require('../models/company.model');

const { sendResponse } = require('../helpers/apiResponse');

const getSingleCompany = async (req, res) => {
    try {
        const id = req.params.id;
        const singleCompany = await Company.getCompany(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the company', null, singleCompany);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getCompanys = async (req, res) => {
    try {
        const { connectionName } = req.query;
        const companys = await Company.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the company', null, companys);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const addCompany = async (req, res) => {
    try {
       
        const { connectionName } = req.query;
        
        
        const company = new Company(req.body , connectionName);
        
        await company.save();

        sendResponse(res, 201, 'Created', 'Successfully created a company.', null, company);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const updateCompany = async (req, res) => {
    try {
        const id = req.params.id;

        const company = new Company(req.body);
        const isValid = company.isValid();

        if (!isValid) {
            return res.status(400).send(
                { statusCode: 400, statusMessage: 'Bad Request', message: 'No valid request data', data: null },
            );
        }
        const data = await company.updateCompany(id);

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
        const id = req.params.id;
        const data = await Company.findByIdAndDelete(id);
        if (data.affectedRows === 0) {
            throw new Error('No company found for deletion');
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
