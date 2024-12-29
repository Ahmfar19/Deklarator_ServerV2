const CompanyCase = require('../models/companyCase.model');
const { sendResponse } = require('../helpers/apiResponse');

const getCases = async (req, res) => {
    try {
        const cases = await CompanyCase.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the cases', null, cases);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleCase = async (req, res) => {
    try {
        const id = req.params.id;
        const singleCase = await CompanyCase.getCase(id);
        if (!singleCase) {
            return sendResponse(res, 404, 'Not Found', 'No case found with the given ID.', null, null);
        }
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the case', null, singleCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleCaseActivity = async (req, res) => {
    try {
        const id = req.params.id;
        const singleCase = await CompanyCase.getCaseActivity(id);
        if (!singleCase) {
            return sendResponse(res, 404, 'Not Found', 'No case found with the given ID.', null, null);
        }
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the case', null, singleCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getCompanyeCase = async (req, res) => {
    try {
        const id = req.params.id;
        const companyCases = await CompanyCase.getCompanyCase(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the company cases', null, companyCases);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addCase = async (req, res) => {
    try {
        const myCase = new CompanyCase(req.body);
        await myCase.save();
        const addedCase = await CompanyCase.getCompanyCase(myCase.company_id);
        sendResponse(res, 201, 'Created', 'Successfully created a case.', null, addedCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateCase = async (req, res) => {
    try {
        const id = req.params.id;
        const checkCase = await CompanyCase.checkIfCaseExisted(id);
        if (!checkCase) {
            return sendResponse(res, 404, 'Not Found', 'No case found for update', null, null);
        }

        const updatedCase = new CompanyCase(req.body);
        await updatedCase.update(id);
        sendResponse(res, 202, 'Accepted', 'Successfully updated the case.', null, updatedCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteCase = async (req, res) => {
    try {
        const id = req.params.id;
        await CompanyCase.deleteByCaseId(id);
        sendResponse(res, 202, 'Accepted', 'Successfully deleted the case.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getCases,
    getSingleCase,
    addCase,
    updateCase,
    getCompanyeCase,
    deleteCase,
    getSingleCaseActivity,
};
