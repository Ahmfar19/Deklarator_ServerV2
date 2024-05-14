const Tamplate = require('../models/tamplate.model');
const { sendResponse } = require('../helpers/apiResponse');

const getTamplatesName = async (req, res) => {
    try {
        const types = await Tamplate.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the tampleteTypes', null, types);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

module.exports = {
    getTamplatesName
}