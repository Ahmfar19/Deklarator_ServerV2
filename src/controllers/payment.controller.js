const Payment = require('../models/payment.model');
const { sendResponse } = require('../helpers/apiResponse');

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.getAll_Payments();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the payment', null, payments);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSinglePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const singlePayment = await Payment.getPaymentById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the payment', null, singlePayment);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        sendResponse(res, 201, 'Created', 'Successfully created a payment.', null, payment);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updatePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const payment = new Payment(req.body);
        const checkPayment = await Payment.checkIfPaymentExisted(id);

        if (checkPayment.length == 0) {
            return res.status(404).send({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'No payment found for update',
                data: null,
            });
        }
        await payment.update_Payment(id);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a payment.', null, payment);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deletePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const checkPayment = await Payment.checkIfPaymentExisted(id);
        if (checkPayment.length == 0) {
            return res.status(404).send({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'No payment found for delete',
                data: null,
            });
        }
        const data = await Payment.delete_payment(id);
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a payment.', null, data);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getPaymentsBy_CompanyId = async (req, res) => {
    try {
        const id = req.params.id;
        const payments = await Payment.getPaymentsByCompanyId(id);
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
