const MessageType = require('../models/message_type.model');
const { sendResponse } = require('../helpers/apiResponse');

const getMessageTypes = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const messageTypes = await MessageType.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the messagetypes', null, messageTypes);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleMessageType = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const singleMessageType = await MessageType.getMessageType(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the messageType', null, singleMessageType);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addMessageType = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const messageType = new MessageType(req.body, connectionName);
        await messageType.save();
        sendResponse(res, 201, 'Created', 'Successfully created a messageType.', null, messageType);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateMessageType = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const messageType = new MessageType(req.body);
        const data = await messageType.update_MessageType(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not message found to update',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a remender.', null, messageType);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteMessageType = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const data = await MessageType.delete_MessageType(id, connectionName);
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

module.exports = {
    getMessageTypes,
    getSingleMessageType,
    addMessageType,
    updateMessageType,
    deleteMessageType,
};
