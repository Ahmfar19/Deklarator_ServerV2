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

module.exports = {
    getReportTemplate,
};
