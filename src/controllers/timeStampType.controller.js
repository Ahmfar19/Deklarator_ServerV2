const TimeStampType = require('../models/timeStampType.model');
const { sendResponse } = require('../helpers/apiResponse');

// get All CaseTypes
const getTimeStampTypes = async (req, res) => {
    try {
        const { connectionName } = req.query;
        const timestamps_type = await TimeStampType.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestamps_type', null, timestamps_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// get single CaseType
const getSingleTimeStampType = async (req, res) => {
    try {
        const { connectionName } = req.query;
        const id = req.params.id;
        const timestamp_type = await TimeStampType.getSingle(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the timestamp_type', null, timestamp_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// Create CaseType
const createtimeStampType = async (req, res) => {
    try {
        const { connectionName } = req.query;
        const timeStamp_type = new TimeStampType(req.body, connectionName);
        await timeStamp_type.save();
        sendResponse(res, 201, 'Created', 'Successfully created a timeStampType.', null, timeStamp_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// updateCase_Type
const updateTimeStampType = async (req, res) => {
    try {
        const { connectionName } = req.query;
        const id = req.params.id;
        const timeStamp_type = new TimeStampType(req.body);
        const data = await timeStamp_type.update(id, connectionName);
        console.log(data);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not timmStamp_type found to update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a timeStamp_type.', null, timeStamp_type);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

// delete CaseType
const deleteTimeStampType = async (req, res) => {
    try {
        const { connectionName } = req.query;
        const id = req.params.id;
        const data = await TimeStampType.findByIdAndDelete(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not timmStamp_type found to delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a timeStampType.', null, null);
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
