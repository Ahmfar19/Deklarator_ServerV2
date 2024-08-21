const Message = require('../models/message.model');
const { sendResponse } = require('../helpers/apiResponse');
const { getLastWeekDate } = require('../helpers/utils');
const cron = require('node-cron');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the messages', null, messages);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const singleMessage = await Message.getMessage(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the message', null, singleMessage);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getStaffMessages = async (req, res) => {
    try {
        const staff_id = req.params.staff_id;
        const staffMessages = await Message.getStaffMessages(staff_id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the staff messages', null, staffMessages);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addMessage = async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        sendResponse(res, 201, 'Created', 'Successfully created a message.', null, message);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const message = new Message(req.body);
        const data = await message.update_Message(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not message found to update',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a remender.', null, message);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteMessage = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Message.delete_Message(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not message found to delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a remnder.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteBeforWeek = async () => {
    try {
        const oldDate = getLastWeekDate();
        await Message.deleteMessageBeforWeek(oldDate);
    } catch (error) {
        return;
    }
};

const updateSeenBeforeId = async (req, res) => {
    const id = req.params.id;
    const staffId = req.params.staff_id;
    try {
        await Message.updateSeenBeforeId(id, staffId);
        sendResponse(res, 200, 'Accepted', 'Successfully update the messages seen.', null, null);
    } catch (error) {
        return;
    }
};

const deleteOldMessages = () => {
    cron.schedule('0 0 * * 0', () => {
        deleteBeforWeek();
    });
};

module.exports = {
    getMessages,
    getStaffMessages,
    getSingleMessage,
    addMessage,
    updateMessage,
    deleteMessage,
    deleteOldMessages,
    updateSeenBeforeId,
};
