const CommonModel = require('../models/common.model');
const { sendResponse } = require('../helpers/apiResponse');

const getAll = async (req, res) => {
    try {
        const { table } = req.params ;
        const cases = await CommonModel.getAll(table);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all entries', null, cases);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getAll,
};