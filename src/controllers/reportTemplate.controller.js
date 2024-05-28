const ReportTemplate = require('../models/reportTemplate.model');
const { sendResponse } = require('../helpers/apiResponse');

const getReportTemplate = async (req, res) => {
    try {
        const reportTemplates = await ReportTemplate.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the reportTemplates', null, reportTemplates);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addEmployeeReport = async (req, res) => {
    try {
        const { employee_id } = req.params;

        const reportItemsData = req.body; // Assuming req.body contains the array of report items

        const data = await ReportTemplate.createEmployeeReport(employee_id, reportItemsData);

        if (data) {
            return sendResponse(res, 202, 'Accepted', 'Employee reports created successfully.', null, data);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getEmployeeReport = async (req, res) => {
    try {
        const id = req.params.id;
        const chicklistItems = await ReportTemplate.getByEmployeeId(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the employeeReports', null, chicklistItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getReportsEmployeesByCompanyId = async (req, res) => {
    try {
        const companyId  = req.params.companyId;
        const reportsEmployessByCompanyId = await ReportTemplate.getAllReportItemsByCompanyId(companyId);
      
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the reportsEmployessByCompanyId', null, reportsEmployessByCompanyId);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}
module.exports = {
    getReportTemplate,
    addEmployeeReport,
    getEmployeeReport,
    getReportsEmployeesByCompanyId
};
