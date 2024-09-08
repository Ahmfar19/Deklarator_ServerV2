const Task = require('../models/task.model');
const { sendResponse } = require('../helpers/apiResponse');

const getTasks = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const tasks = await Task.getAll(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the tasks', null, tasks);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleTask = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const singleTask = await Task.getTask(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the task', null, singleTask);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addTask = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const task = new Task(req.body, connectionName);
        const task_id = await task.save();
        sendResponse(res, 201, 'Created', 'Successfully created a message.', null, { task_id: task_id });
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const addMultiTask = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const task = new Task(req.body);
        const insertedTaskIds = await task.saveMulti(connectionName);

        sendResponse(res, 201, 'Created', 'Successfully created a message.', null, insertedTaskIds);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateTask = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const task = new Task(req.body);
        const data = await task.updateTask(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not task found to update',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a task.', null, task);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteTask = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const data = await Task.delete_Task(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not task found to delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a task.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getTasksTypes = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const types = await Task.getTypes(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the types', null, types);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getTasks,
    getSingleTask,
    addTask,
    updateTask,
    deleteTask,
    getTasksTypes,
    addMultiTask,
};
