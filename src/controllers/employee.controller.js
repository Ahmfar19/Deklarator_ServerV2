const Employee = require('../models/employee.model');
const { sendResponse } = require('../helpers/apiResponse');

const addEmployee = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const employee = new Employee(req.body, connectionName);
        await employee.save();

        sendResponse(res, 201, 'Created', 'Successfully created a employee.', null, employee);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getEmployees = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const employees = await Employee.getCompanyEmployees(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the employees', null, employees);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const employees = await Employee.getAllEmployees(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the employees', null, employees);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleEmployee = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const singleEmployee = await Employee.getSingleById(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the Employee', null, singleEmployee);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateEmployee = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;

        const employee = new Employee(req.body);

        const data = await employee.updateById(id, connectionName);

        if (data.affectedRows === 0) {
            if (data.affectedRows === 0) {
                return res.json({
                    status: 406,
                    message: 'not employee found to update',
                });
            }
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a employee.', null, employee);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const data = await Employee.findByIdAndDelete(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not employee found to delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a employee.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
module.exports = {
    addEmployee,
    getEmployees,
    getSingleEmployee,
    updateEmployee,
    deleteEmployee,
    getAllEmployees,
};
