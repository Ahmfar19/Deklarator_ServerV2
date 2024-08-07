const ResetPassword = require('../models/resetPassword.model');
const { sendReqularEmail } = require('./sendEmail.controller');
const crypto = require('crypto');
const { hashPassword, getFutureDateTime, isDateTimeInPast } = require('../helpers/utils');
const mailMessags = require('../helpers/emailMessages');

const handleResetPassword = async (req, res, checkUser) => {
    // if user exists in staff table or guest table
    if (checkUser.length) {
        // check if user exists in reset_password table
        const checkIfExistedInResetPassword = await ResetPassword.checkIfExistedInResetTable(req.body.email);

        const pinCode = crypto.randomInt(100000, 1000000).toString();
        const expiresAt = getFutureDateTime();
        let msg = '';

        if (checkIfExistedInResetPassword.length) {
            const newResetInformation = new ResetPassword({
                email: req.body.email,
                pinCode: pinCode,
                expiresAt: expiresAt,
            });

            await newResetInformation.updateResetPasswordInformation(req.body.email);
            msg = 'A new reset password PIN code has been sent to your email.';
        } else {
            const reset_password = new ResetPassword({
                email: req.body.email,
                pinCode: pinCode,
                expiresAt: expiresAt,
            });

            await reset_password.save();
            msg = 'A reset password PIN code has been sent to your email.';
        }
        const title = mailMessags.pinMessage.title;
        const body = mailMessags.pinMessage.body.replace('{0}', pinCode);

        sendReqularEmail(req.body.email, title, body);
        return res.json({
            msg: msg,
        });
    } else {
        return res.status(400).json({ error: 'User email not found.' });
    }
};

const forgetPassword = async (req, res) => {
    try {
        if (req.body.guest) {
            const checkUser = await ResetPassword.checkIfGuestExists(req.body.email);
            await handleResetPassword(req, res, checkUser);
        } else {
            const checkUser = await ResetPassword.checkIfUserExisted(req.body.email);
            await handleResetPassword(req, res, checkUser);
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

const checkPinCode = async (req, res) => {
    const { pinCode, email } = req.body;

    try {
        const ckeckPin = await ResetPassword.checkPinIfExisted(pinCode, email);

        if (ckeckPin.length) {
            const resetPasswordInformation = await ResetPassword.getResetPassword(email, pinCode);

            if (isDateTimeInPast(resetPasswordInformation[0]?.expiresAt)) {
                await ResetPassword.deleteUserAfterUpdatePassword(email);
                return res.status(400).json({ error: 'PIN code has expired , Please re-order the pin agin' });
            }

            return res.status(200).json({ msg: 'pinCode is Correct' });
        } else {
            return res.status(406).json({ msg: 'pinCode is not Correct' });
        }
    } catch (error) {
        res.json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, pinCode, new_password, verify_password, guest } = req.body;

    try {
        const resetPasswordInformation = await ResetPassword.getResetPassword(email, pinCode);

        if (resetPasswordInformation.length === 0) {
            return res.status(400).json({ error: 'Invalid PIN code.' });
        }

        if (new_password !== verify_password) {
            throw new Error('Passwords do not match');
        }
        const hashedPassword = await hashPassword(new_password);

        if (guest) {
            await ResetPassword.updateGuestPassword(resetPasswordInformation[0].email, hashedPassword);
        } else {
            await ResetPassword.updatePassword(resetPasswordInformation[0].email, hashedPassword);
        }

        await ResetPassword.deleteUserAfterUpdatePassword(resetPasswordInformation[0].email);

        return res.status(200).json({ msg: 'Password has been updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    forgetPassword,
    checkPinCode,
    resetPassword,
};
