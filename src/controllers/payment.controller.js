const Payment = require('../models/payment.model');
const { sendResponse } = require('../helpers/apiResponse');

const getAllPayments = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const payments = await Payment.getAll_Payments(connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the payment', null, payments);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSinglePayment = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const singlePayment = await Payment.getPaymentById(id, connectionName);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the payment', null, singlePayment);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const createPayment = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const payment = new Payment(req.body, connectionName);
        await payment.save();
        sendResponse(res, 201, 'Created', 'Successfully created a payment.', null, payment);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updatePayment = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const payment = new Payment(req.body);
        const data = await payment.update_Payment(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not payment found to update',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a payment.', null, payment);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deletePayment = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const data = await Payment.delete_payment(id, connectionName);
        if (data.affectedRows === 0) {
            return res.json({
                status: 406,
                message: 'not Payment found to delete',
            });
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a payment.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getPaymentsBy_CompanyId = async (req, res) => {
    try {
        const connectionName = req.customerId;
        const id = req.params.id;
        const payments = await Payment.getPaymentsByCompanyId(id, connectionName);
        sendResponse(res, 200, 'Ok', `Successfully retrieved all the PaymentsByCompanyId ${id}`, null, payments);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    getAllPayments,
    getSinglePayment,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentsBy_CompanyId,
};
