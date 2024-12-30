const CompanyCase = require('../models/companyCase.model');
const { sendResponse } = require('../helpers/apiResponse');
const { sendEmailHtml } = require('./sendEmail.controller');
const path = require('path');
const ejs = require('ejs');

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
        const insertedId = await myCase.save();
        const addedCase = await CompanyCase.getCase(insertedId);
        const { company_id, case_id, case_name } = addedCase;
        if (req.body.email) {
            const title = `Nytt Ärende Skapat: ${company_id}-${case_id}`;
            const templatePath = path.resolve(`assets/tampletes/newCompanyCase.ejs`);
            const renderedHtml = await ejs.renderFile(templatePath, { case_name });
            sendEmailHtml(req.body.email, title, renderedHtml);
        }
        sendResponse(res, 201, 'Created', 'Successfully created a case.', null, addedCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addCaseActivity = async (req, res) => {
    try {
        const activity_id = await CompanyCase.addActivity(req.body);
        const insertedCase = req.body;
        insertedCase.activity_id = activity_id
        sendResponse(res, 200, 'Ok', 'Successfully created the cases activity', null, insertedCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateCase = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedCase = new CompanyCase(req.body);
        await updatedCase.update(id);
        const { company_id, case_id, case_name, case_completed } = updatedCase;
        if (+updatedCase.case_status === 2 && req.body.email) {
            const title = `Ett ärende är stängd: ${company_id}-${case_id}`;
            const templatePath = path.resolve(`assets/tampletes/closedCompanyCase.ejs`);
            const renderedHtml = await ejs.renderFile(templatePath, { case_name, case_completed });
            sendEmailHtml(req.body.email, title, renderedHtml);
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated the case.', null, updatedCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateCaseActivity = async (req, res) => {
    try {
        await CompanyCase.updateCaseActivity(req.body);
        sendResponse(res, 202, 'Accepted', 'Successfully updated the case.', null, null);
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

const deleteCaseActivity = async (req, res) => {
    try {
        const id = req.params.id;
        await CompanyCase.deleteByActivityId(id);
        sendResponse(res, 202, 'Accepted', 'Successfully deleted the case activity.', null, null);
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
    addCaseActivity,
    deleteCaseActivity,
    updateCaseActivity
};
