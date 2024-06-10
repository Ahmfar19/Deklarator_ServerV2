const CompanyType = require('../models/company_type.model');
const { sendResponse } = require('../helpers/apiResponse');

const getCompanyType = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const companyTypes = await CompanyType.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the companyTypes', null, companyTypes);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addCompanyType = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const companyType = new CompanyType(req.body, connectionName);
        await companyType.save();
        sendResponse(res, 201, 'Created', 'Successfully created a companyType.', null, companyType);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
module.exports = {
    getCompanyType,
    addCompanyType,
};
