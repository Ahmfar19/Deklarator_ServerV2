const Reminder = require('../models/reminder.model');
const { sendResponse } = require('../helpers/apiResponse');
const { isToday } = require('../helpers/utils');
const { checkForReminder } = require('./sendReminder.controller');
const { connectionManager } = require('../databases/connectionManagment');

const getRemenders = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const remenders = await Reminder.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the remenders', null, remenders);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleRemender = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const singleRemender = await Reminder.getReminder(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the remender', null, singleRemender);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addRemender = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const remender = new Reminder(req.body, connectionName);
        await remender.save();
        const today = isToday(remender.remender_date);
        if (today) {
            const connections = await connectionManager.getConnections();
            const adminEmail = connections[connectionName].AdminEmail;
            checkForReminder(connectionName, adminEmail);
        }

        sendResponse(res, 201, 'Created', 'Successfully created a remender.', null, remender);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addMultiReminder = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const reminder = new Reminder(req.body);
        const addedReminders = await reminder.saveMulti(connectionName);
        const today = isToday(req.body.remender_date);
        if (today) {
            const connections = await connectionManager.getConnections();
            const adminEmail = connections[connectionName].AdminEmail;
            checkForReminder(connectionName, adminEmail);
        }
        sendResponse(res, 201, 'Created', 'Successfully created the reminders.', null, addedReminders || []);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateRemender = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const remender = new Reminder(req.body);
        const data = await remender.updateReminder(id, connectionName);

        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not remender found to update',
            });
        }

        const today = isToday(remender.remender_date);
        if (today) {
            const connections = await connectionManager.getConnections();
            const adminEmail = connections[connectionName].AdminEmail;
            checkForReminder(connectionName, adminEmail);
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a remender.', null, remender);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteRemender = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const data = await Reminder.deleteReminder(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not remender found to delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a remnder.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getCompanyReminders = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const remenders = await Reminder.getReminderByCompanyId(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the remenders', null, remenders);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getFilterdReminder = async (req, res) => {
    const { key, value } = req.query;
    const connectionName = req.customerId;
    try {
        const remenders = await Reminder.getReminderByFilter(key, value, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the remenders', null, remenders);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getRemenders,
    getSingleRemender,
    addRemender,
    updateRemender,
    deleteRemender,
    getCompanyReminders,
    addMultiReminder,
    getFilterdReminder,
};
