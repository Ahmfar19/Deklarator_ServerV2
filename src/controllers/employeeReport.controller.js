const EmployeeReport = require('../models/employeeReport.model');
const MessageType = require('../models/message_type.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const mailMessags = require('../helpers/emailMessages');
const { getNowDate_time } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');

const updateReport = async (req, res) => {
    try {
        const { employee_id } = req.params;
        const reportItemsData = req.body;

        await EmployeeReport.updateByReportId(employee_id, reportItemsData);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a report.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getEmployeeReport = async (req, res) => {
    try {
        const id = req.params.id;
        const employeeReports = await EmployeeReport.getByEmployeeId(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the employeeReports', null, employeeReports);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addEmployeeReport = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const reportItemsData = req.body; // Assuming req.body contains the array of report items

        const data = await EmployeeReport.createEmployeeReport(employee_id, reportItemsData);

        if (data) {
            const title = mailMessags.employee.title;
            const body = mailMessags.employee.body;
            const bodyString = JSON.stringify({
                key: body,
                params: {
                    0: `${data[0].employee_name}`,
                },
            });
            const admins = await User.getAdmins();
            const messageName = await MessageType.getMessageTypeByName('primary');
            const nowDateTime = getNowDate_time();

            for (const admin of admins) {
                const message = new Message({
                    staff_id: admin.staff_id,
                    message_typ_id: messageName[0].message_typ_id,
                    title: title,
                    body: bodyString,
                    date_time: nowDateTime,
                    seen: false,
                });
                await message.save();
            }
            return sendResponse(res, 202, 'Accepted', 'Employee reports created successfully.', null, data);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getReportsEmployeesByCompanyId = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const reportsEmployessByCompanyId = await EmployeeReport.getAllReportItemsByCompanyId(companyId);

        sendResponse(
            res,
            200,
            'Ok',
            'Successfully retrieved all the reportsEmployessByCompanyId',
            null,
            reportsEmployessByCompanyId,
        );
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getAllReportItems = async (req, res) => {
    try {
        const reportsEmployess = await EmployeeReport.getAllReportItems();
        sendResponse(
            res,
            200,
            'Ok',
            'Successfully retrieved all the reportsEmployessByCompanyId',
            null,
            reportsEmployess,
        );
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getFilterdReports = async (req, res) => {
    const { key, value } = req.query;
    try {
        const reportsEmployess = await EmployeeReport.getReportItemsByFilter(key, value);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the remenders', null, reportsEmployess);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteEmployeeReport = async (req, res) => {
    try {
        const id = req.params.id;
        await EmployeeReport.deleteEmployeeReport(id);

        sendResponse(res, 200, 'Ok', 'Successfully deleted all the report for the specifid month', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteEmployeeItemReport = async (req, res) => {
    try {
        const values = req.body;
        await EmployeeReport.deleteReportItems(values);

        sendResponse(res, 200, 'Ok', 'Successfully deleted the specified entries', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    updateReport,
    getEmployeeReport,
    addEmployeeReport,
    getReportsEmployeesByCompanyId,
    deleteEmployeeReport,
    getAllReportItems,
    getFilterdReports,
    deleteEmployeeItemReport,
};
