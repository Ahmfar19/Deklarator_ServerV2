const EmployeeReport = require('../models/employeeReport.model');
const { sendResponse } = require('../helpers/apiResponse');


const updateReport = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = new EmployeeReport(req.body);
        const data = await report.updateByReportId(reportId);

        if (data.affectedRows === 0) {
            if (data.affectedRows === 0) {
                return res.json({
                    status: 406,
                    message: 'not report found to update',
                });
            }
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a report.', null, report);
   
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}


module.exports = {
    updateReport
};
