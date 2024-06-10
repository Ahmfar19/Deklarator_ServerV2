const Timer = require('../models/timer.model');
const { sendResponse } = require('../helpers/apiResponse');

const getSingleTimer = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const singleTimer = await Timer.getTimer(id, connectionName);
        console.log(singleTimer);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the Timer', null, singleTimer);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getTimers = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const timers = await Timer.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the Timers', null, timers);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addTimer = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const timer = new Timer(req.body, connectionName);
        await timer.save();
        sendResponse(res, 201, 'Created', 'Successfully created a timer.', null, timer);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const update_Timer = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const timer = new Timer(req.body);
        const data = await timer.updateTimer(id, connectionName);
        if (data.affectedRows === 0) {
            throw new Error('Timer not found or unable to update');
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a Timer.', null, timer);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteTimer = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const data = await Timer.findByIdAndDelete(id, connectionName);
        if (data.affectedRows === 0) {
            throw new Error('Timer not found or unable to delete');
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a Timer.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getTimers,
    addTimer,
    getSingleTimer,
    update_Timer,
    deleteTimer,
};
