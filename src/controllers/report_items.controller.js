const EmployeeReportItems = require('../models/report_items.model');
const { sendResponse } = require('../helpers/apiResponse');

const addEmployeeReportItem = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const { reportData, reportItems } = req.body;
        const data = await EmployeeReportItems.createEmployeeReportItems(reportData.report_id, reportItems, connectionName);
        sendResponse(res, 201, 'Created', 'Successfully added an employee report item.', null, data);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateEmployeeReportItem = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const { reportData, reportItems } = req.body;
        await EmployeeReportItems.updateEmployeeReportItems(reportData, reportItems, connectionName);
        sendResponse(res, 202, 'Accepted', 'Successfully updated the employee report item.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteMultipleEmployeeReportItems = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const { reportData, reportItems } = req.body;
        await EmployeeReportItems.deleteMultipleItems(reportData, reportItems, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully deleted the specified employee report items.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getEmployeeReportItemsByReportId = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const { report_id } = req.params;
        const reportItems = await EmployeeReportItems.getByReportId(report_id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved employee report items.', null, reportItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getAllEmployeeReportItems = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const reportItems = await EmployeeReportItems.getAllReportItems(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all employee report items.', null, reportItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getFilteredReportItems = async (req, res) => {
    const { key, value } = req.query;
    try {
        const connectionName = req.customerId;
        const reportItems = await EmployeeReportItems.getReportItemsByFilter(key, value, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved filtered employee report items.', null, reportItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteEmployeeReportItem = async (req, res) => {
    try {
        const { item_id } = req.params;
        const connectionName = req.customerId;
        await EmployeeReportItems.deleteByItemId(item_id, connectionName);

        sendResponse(res, 200, 'Ok', 'Successfully deleted the employee report item.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    addEmployeeReportItem,
    updateEmployeeReportItem,
    getEmployeeReportItemsByReportId,
    getAllEmployeeReportItems,
    getFilteredReportItems,
    deleteEmployeeReportItem,
    deleteMultipleEmployeeReportItems,
};
