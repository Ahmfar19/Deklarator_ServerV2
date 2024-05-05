
const CompanyType = require('../models/company_type.model');
const { sendResponse } = require('../helpers/apiResponse');

const getCompanyType = async (req, res) => {
    try {
        const companyTypes = await CompanyType.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the companyTypes', null, companyTypes);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}


const addCompanyType = async (req, res) => {
    try {
        const companyType = new CompanyType(req.body);
       
        await companyType.save();
        sendResponse(res, 201, 'Created', 'Successfully created a companyType.', null, companyType);

    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
module.exports = {
    getCompanyType,
    addCompanyType
}