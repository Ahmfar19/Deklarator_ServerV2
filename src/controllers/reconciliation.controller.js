const Reconciliations = require('../models/reconciliation.model');
const { sendResponse } = require('../helpers/apiResponse');

const getReconciliations = async (req, res) => {
    try {
        const reconciliations = await Reconciliations.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the reconciliations', null, reconciliations);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getReconciliationsGroup = async (req, res) => {
    try {
        const reconciliationsGrops = await Reconciliations.getGroups();
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

const getReconciliationsListByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (!name) {
            sendResponse(res, 500, 'Invalid argument', null, null, null);
        } else {
            const singleReconciliations = await Reconciliations.getByName(name);
            sendResponse(res, 200, 'Ok', 'Successfully retrieved all the reconciliations', null, singleReconciliations);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteReconciliationByName = async (req, res) => {
    try {
        const name = req.params.name;
        if (!name) {
            sendResponse(res, 500, 'Invalid argument', null, null, null);
        } else {
            await Reconciliations.deleteByName(name);
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
            await Reconciliations.deleteReconciliation(year);
            sendResponse(res, 200, 'Ok', 'Successfully deletion', null, null);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const creteNewReconciliation = async (req, res) => {
    const data = req.body;
    try {
        const reconciliations = await Reconciliations.createMultiReconciliation(data);
        sendResponse(res, 201, 'Created', 'Successfully created the reconciliation list.', null, reconciliations);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateReconciliations = async (req, res) => {
    const id = req.params.reconciliation_id;
    const data = req.body.reconciliation_data;
    try {
        await Reconciliations.updateDataById(id, data);
        sendResponse(res, 201, 'Created', 'Successfully updated the reconciliation data', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getReconciliations,
    updateReconciliations,
    creteNewReconciliation,
    getReconciliationsListByName,
    getReconciliationsGroup,
    deleteReconciliationByName,
    deleteReconciliations,
};
