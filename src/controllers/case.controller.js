const Case = require('../models/case.model');
const { sendResponse } = require('../helpers/apiResponse');

const getCases = async (req, res) => {

    try {
        const cases = await Case.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the cases', null, cases);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleCase = async (req, res) => {

    try {
        const id = req.params.id;
        const singleCase = await Case.getCase(id)
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the cases', null, singleCase);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

const addCase = async (req, res) => {

    try {
        const myCase = new Case(req.body);
        await myCase.save();
        sendResponse(res, 201, 'Created', 'Successfully created a company.', null, myCase);

    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

const updateCase = async (req, res) => {
    // const id = req.params.id;
    // const mycase = new Case(req.body);
    // const checkCompany = await Case.checkIfCaseExisted(id)
    // if (checkCompany.length == 0) {
    //     return res.status(404).send({
    //         statusCode: 404,
    //         statusMessage: 'Not Found',
    //         message: 'No case found for update',
    //         data: null,
    //     });
    // }
    // try {
    //     await mycase.update(id);
    //     sendResponse(res, 202, 'Accepted', 'Successfully updated a company.', null, mycase);
    // } catch (err) {
    //     sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    // }
}
module.exports = {
    getCases,
    getSingleCase,
    addCase,
    updateCase
};