const TimeStampType = require('../models/timeStampType.model');
const { sendResponse } = require('../helpers/apiResponse');

// get All CaseTypes
const getTimeStampTypes = async (req, res) => {
    try {
        const timestamps_type = await TimeStampType.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestamps_type', null, timestamps_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// get single CaseType
const getSingleTimeStampType = async (req, res) => {
    try {
        const id = req.params.id;
        const timestamp_type = await TimeStampType.getSingle(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the timestamp_type', null, timestamp_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// Create CaseType
const createtimeStampType = async (req, res) => {
    try {
        const timeStamp_type = new TimeStampType(req.body);
        await timeStamp_type.save();
        sendResponse(res, 201, 'Created', 'Successfully created a timeStampType.', null, timeStamp_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// updateCase_Type
const updateTimeStampType = async (req, res) => {
    try {
        const id = req.params.id;
        const timeStamp_type = new TimeStampType(req.body);
        const checkTimeStampType = await TimeStampType.checkIfTimeStampTypeExisted(id);
        if (checkTimeStampType.length == 0) {
            return res.status(404).send({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'No timeStamp_type found for update',
                data: null,
            });
        }
        await timeStamp_type.update(id);
        sendResponse(res, 202, 'Accepted', 'Successfully updated a timeStamp_type.', null, timeStamp_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// delete CaseType
const deleteTimeStampType = async (req, res) => {
    try {
        const id = req.params.id;
        const checkTimeStamp_Type = await TimeStampType.checkIfTimeStampTypeExisted(id);
        if (checkTimeStamp_Type.length == 0) {
            return res.status(404).send({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'No TimeStamp_Type found for delete',
                data: null,
            });
        }
        const data = await TimeStampType.findByIdAndDelete(id);
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a timeStampType.', null, data);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    createtimeStampType,
    getTimeStampTypes,
    getSingleTimeStampType,
    updateTimeStampType,
    deleteTimeStampType,
};
