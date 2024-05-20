const CheckList = require('../models/checkList.model');
const { sendResponse } = require('../helpers/apiResponse');

const getcheckListItems = async (req, res) => {
    try {
        const chicklistItems = await CheckList.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the chicklistItems', null, chicklistItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getCompanyCheckList = async (req, res) => {
    try {
        const id = req.params.id;
        const chicklistItems = await CheckList.getByCompanyId(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the chicklistItems', null, chicklistItems);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateStatus = async (req, res) => {
    try {
        const id = req.params.id;

        const item = new CheckList(req.body);

        const data = await item.updateCheck(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'no items found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a itemStatus.', null, item);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const createCopmpanyCheckList = async (req, res) => {
    try {
        const company_id = req.params.id;
        await CheckList.createCompanyCheckList(company_id);
        sendResponse(res, 202, 'Accepted', 'Checklist created successfully.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateChecklist = async (req, res) => {
    try {
        const { list, company_id } = req.body;
        await CheckList.updateChecklist(company_id, list);
        sendResponse(res, 202, 'Accepted', 'Checklist updated successfully.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getcheckListItems,
    updateStatus,
    createCopmpanyCheckList,
    getCompanyCheckList,
    updateChecklist,
};
