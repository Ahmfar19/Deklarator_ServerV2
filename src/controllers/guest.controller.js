const Guest = require('../models/guest.model');
const { sendResponse } = require('../helpers/apiResponse');
const { hashPassword, generatePassword, comparePassword } = require('../helpers/utils');
const { sendCCEmail } = require('./sendEmail.controller')
const mailMessags = require('../helpers/emailMessages');
const config = require('config');
const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');
var jwt = require('jsonwebtoken');
const ADMIN_EMAIL = config.get('ADMIN_EMAIL');
//register
const addGuest = async (req, res) => {
    try {
        const { company_id } = req.body
      
        const data = await Guest.getEmail(company_id)

        const password = await generatePassword();

        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            throw new Error('Password error');
        }

        const guest = new Guest({
            company_id: company_id,
            password: hashedPassword
        })

         await guest.save();
         sendResponse(res, 201, 'Created', 'Successfully created a guest.', null, guest);

           const title = mailMessags.guestEmail.title.replace('{0}', data[0].company_name);
           const body = mailMessags.guestEmail.body.replace('{0}', data[0].email).replace('{1}', password);

           sendCCEmail(data[0].email, ADMIN_EMAIL,title, body)

    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

//login
const loginGuest = async (req, res) => {
    try {
        const { email, password, fingerprint } = req.body;
        const data = await Guest.checkGuest(email)

        if (data.length) {
            const match = await comparePassword(password, data[0].password);
            if (match) {

                const expiresIn = '1d';
                const finger_print = fingerprint + String(data[0].gust_id);
                const token = jwt.sign({ id: finger_print }, JWT_SECRET_KEY, { expiresIn });

                res.json({
                    guest: data[0],
                    authenticated: true,
                    accessToken: token,
                });

                return res;
            } else {
                return sendResponse(res, 401, 'Unauthorized', null, 'Password or Email is incorrect', null);   
            }
        } else {
            return sendResponse(res, 401, 'Unauthorized', null,'User does not exist in the database', null);   
        }
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
}


module.exports = {
    addGuest,
    loginGuest
};
