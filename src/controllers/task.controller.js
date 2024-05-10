const Task = require('../models/task.model');
const { sendResponse } = require('../helpers/apiResponse');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the tasks', null, tasks);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}  

 const getSingleTask = async (req, res) => {
    try {
        const id = req.params.id;
        const singleTask = await Task.getTask(id)
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the task', null, singleTask);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
 }

 const addTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        sendResponse(res, 201, 'Created', 'Successfully created a message.', null, task);

    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
 }

 const updateTask = async (req, res) => {
    try {
        const id = req.params.id;
        const task = new Task(req.body);
        const data = await task.updateTask(id);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: "not task found to update"
            })
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a task.', null, task);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
 }

 const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Task.delete_Task(id);
        if(data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: "not task found to delete"
            })
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a task.', null, null);
    }
    catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

const getTasksTypes = async (req, res) => {
    try {
        const types = await Task.getTypes();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the types', null, types);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}  

module.exports = {
    getTasks,
    getSingleTask,
    addTask,
    updateTask,
    deleteTask,
    getTasksTypes
}