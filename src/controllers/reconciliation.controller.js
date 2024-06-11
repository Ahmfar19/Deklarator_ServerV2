const Reconciliations = require('../models/reconciliation.model');
const { sendResponse } = require('../helpers/apiResponse');

const getReconciliations = async (req, res) => {
    try {
        const reconciliations = await Reconciliations.getAll(req.customerId);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the reconciliations', null, reconciliations);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getReconciliationsGroup = async (req, res) => {
    try {
        const reconciliationsGrops = await Reconciliations.getGroups(req.customerId);
        sendResponse(
            res,
            200,
            'Ok',
            'Successfully retrieved all the reconciliations groups',
            null,
            reconciliationsGrops,
        );
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getYearReconciliations = async (req, res) => {
    try {
        const year = req.params.year;
        if (!year) {
            sendResponse(res, 500, 'Invalid argument', null, null, null);
        } else {
            const singleReconciliations = await Reconciliations.getByYear(year, req.customerId);
            sendResponse(res, 200, 'Ok', 'Successfully retrieved all the reconciliations', null, singleReconciliations);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteYearReconciliations = async (req, res) => {
    try {
        const year = req.params.year;
        if (!year) {
            sendResponse(res, 500, 'Invalid argument', null, null, null);
        } else {
            await Reconciliations.deleteByYear(year, req.customerId);
            sendResponse(res, 200, 'Ok', 'Successfully deletion', null, null);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteReconciliations = async (req, res) => {
    try {
        const year = req.params.id;
        if (!year) {
            sendResponse(res, 500, 'Invalid argument', null, null, null);
        } else {
            await Reconciliations.deleteReconciliation(year, req.customerId);
            sendResponse(res, 200, 'Ok', 'Successfully deletion', null, null);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const creteNewReconciliation = async (req, res) => {
    const data = req.body;
    try {
        const reconciliations = await Reconciliations.createMultiReconciliation(data, req.customerId);
        sendResponse(res, 201, 'Created', 'Successfully created the reconciliation list.', null, reconciliations);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateReconciliations = async (req, res) => {
    const id = req.params.reconciliation_id;
    const data = req.body.reconciliation_data;
    try {
        await Reconciliations.updateDataById(id, data, req.customerId);
        sendResponse(res, 201, 'Created', 'Successfully updated the reconciliation data', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getReconciliations,
    updateReconciliations,
    creteNewReconciliation,
    getYearReconciliations,
    getReconciliationsGroup,
    deleteYearReconciliations,
    deleteReconciliations,
};
