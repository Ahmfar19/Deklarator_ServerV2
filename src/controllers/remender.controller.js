const Reminder = require('../models/reminder.model');
const { sendResponse } = require('../helpers/apiResponse');
const { isToday } = require('../helpers/utils');
const { checkForReminder } = require('./sendReminder.controller');

const getRemenders = async (req, res) => {
    try {
        const remenders = await Reminder.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the remenders', null, remenders);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleRemender = async (req, res) => {
    try {
        const id = req.params.id;
        const singleRemender = await Reminder.getReminder(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the remender', null, singleRemender);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addRemender = async (req, res) => {
    try {
        const remender = new Reminder(req.body);

        await remender.save();

        const today = isToday(remender.remender_date);

        if (today) {
            checkForReminder();
        }

        sendResponse(res, 201, 'Created', 'Successfully created a remender.', null, remender);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addMultiReminder = async (req, res) => {
    try {
        const reminder = new Reminder(req.body);
        const addedReminders = await reminder.saveMulti();
        sendResponse(res, 201, 'Created', 'Successfully created the reminders.', null, addedReminders || []);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateRemender = async (req, res) => {
    try {
        const id = req.params.id;
        const remender = new Reminder(req.body);
        const data = await remender.updateReminder(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not remender found to update',
            });
        }

        const today = isToday(remender.remender_date);
        if (today) {
            checkForReminder();
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a remender.', null, remender);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteRemender = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Reminder.deleteReminder(id);
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
        const id = req.params.id;
        const remenders = await Reminder.getReminderByCompanyId(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the remenders', null, remenders);
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
};
