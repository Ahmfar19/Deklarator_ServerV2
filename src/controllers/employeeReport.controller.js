const EmployeeReport = require('../models/employeeReport.model');
const MessageType = require('../models/message_type.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const mailMessags = require('../helpers/emailMessages');
const { getNowDate_time } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');
const reportItemsModel = require('../models/report_items.model');


const addEmployeeReport = async (req, res) => {
    try {
        const { reportItems, reportData } = req.body;
        const connectionName = req.customerId;
        const report = await EmployeeReport.createEmployeeReport(reportData, connectionName);

        if (report && report.insertId) {
            await reportItemsModel.createEmployeeReportItems(report.insertId, reportItems, connectionName);

            const title = mailMessags.employee.title;
            const body = mailMessags.employee.body;
            const bodyString = JSON.stringify({
                key: body,
                params: {
                    0: `${reportData.employee_name}`,
                },
            });
            const admins = await User.getAdmins(connectionName);
            const messageName = await MessageType.getMessageTypeByName('primary', connectionName);
            const nowDateTime = getNowDate_time();

            for (const admin of admins) {
                const message = new Message({
                    staff_id: admin.staff_id,
                    message_typ_id: messageName[0].message_typ_id,
                    title: title,
                    body: bodyString,
                    date_time: nowDateTime,
                    seen: false,
                }, connectionName);
                await message.save();
            }
            return sendResponse(res, 202, 'Accepted', 'Employee reports created successfully.', null, report);
        } else {
            return sendResponse(res, 400, 'Bad Request', 'Failed to create employee reports.', null, null);
        }
    } catch (err) {
         sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getReportsEmployeeByEmployeeId = async (req, res) => {
    try {
        const empId = req.params.empId;
        const connectionName = req.customerId;
        const reports = await EmployeeReport.getByEmployeeId(empId, connectionName);
        sendResponse(
            res,
            200,
            'Ok',
            'Successfully retrieved all the employee reports',
            null,
            reports,
        );
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getAllEmployeeReports = async (req, res) => {
    
    try {
        const connectionName = req.customerId;

        const reports = await EmployeeReport.getAllEmployeeReports('', '', connectionName);
        sendResponse(
            res,
            200,
            'Ok',
            'Successfully retrieved all the employee reports',
            null,
            reports,
        );
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getFilterdReports = async (req, res) => {
    const { key, value } = req.query;
    const connectionName = req.customerId;
    try {
        const reportsEmployess = await EmployeeReport.getAllEmployeeReports(key, value, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the remenders', null, reportsEmployess);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateReport = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const { reportData } = req.body;
        await EmployeeReport.updateByReportId(reportData, connectionName);
        sendResponse(res, 202, 'Accepted', 'Successfully updated a report.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteEmployeeReport = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        await EmployeeReport.deleteEmployeeReport(id, connectionName);
    
        sendResponse(res, 200, 'Ok', 'Successfully deleted all the report for the specifid month', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    addEmployeeReport,
    getReportsEmployeeByEmployeeId,
    deleteEmployeeReport,
    getAllEmployeeReports,
    getFilterdReports,
    updateReport
};
