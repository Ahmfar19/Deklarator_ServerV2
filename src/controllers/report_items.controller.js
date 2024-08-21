const EmployeeReportItems = require('../models/report_items.model');
const { sendResponse } = require('../helpers/apiResponse');

const addEmployeeReportItem = async (req, res) => {
    try {
        const { reportData, reportItems } = req.body;
        const data = await EmployeeReportItems.createEmployeeReportItems(reportData.report_id, reportItems);
        sendResponse(res, 201, 'Created', 'Successfully added an employee report item.', null, data);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateEmployeeReportItem = async (req, res) => {
    try {
        const { reportData, reportItems } = req.body;
        await EmployeeReportItems.updateEmployeeReportItems(reportData, reportItems);
        sendResponse(res, 202, 'Accepted', 'Successfully updated the employee report item.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteMultipleEmployeeReportItems = async (req, res) => {
    try {
        const { reportData, reportItems } = req.body;
        await EmployeeReportItems.deleteMultipleItems(reportData, reportItems);
        sendResponse(res, 200, 'Ok', 'Successfully deleted the specified employee report items.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getEmployeeReportItemsByReportId = async (req, res) => {
    try {
        const { report_id } = req.params;
        const reportItems = await EmployeeReportItems.getByReportId(report_id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved employee report items.', null, reportItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getAllEmployeeReportItems = async (req, res) => {
    try {
        const reportItems = await EmployeeReportItems.getAllReportItems();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all employee report items.', null, reportItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getFilteredReportItems = async (req, res) => {
    const { key, value } = req.query;
    try {
        const reportItems = await EmployeeReportItems.getReportItemsByFilter(key, value);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved filtered employee report items.', null, reportItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteEmployeeReportItem = async (req, res) => {
    try {
        const { item_id } = req.params;
        await EmployeeReportItems.deleteByItemId(item_id);

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
