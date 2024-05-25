const Tamplate = require('../models/tamplate.model');
const { sendResponse } = require('../helpers/apiResponse');

const getTamplatesName = async (req, res) => {
    try {
        const types = await Tamplate.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the tampleteTypes', null, types);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const createTamplate = async (req, res) => {
    try {
        const tamplateBody = new Tamplate(req.body);
        await tamplateBody.save();

        sendResponse(res, 201, 'Created', 'Successfully created a tamplateBody.', null, tamplateBody);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateTamplate = async (req, res) => {
    try {
        const id = req.params.id;
        const tamplateBody = new Tamplate(req.body);
        const data = await tamplateBody.update_tamplate(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not Tamplate found to update',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a tamplateBody.', null, tamplateBody);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
module.exports = {
    getTamplatesName,
    createTamplate,
    updateTamplate,
};
