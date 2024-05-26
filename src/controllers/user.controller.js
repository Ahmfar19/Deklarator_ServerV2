const { validationResult } = require('express-validator');
const User = require('../models/user.model');
var jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const { sendReqularEmail } = require('./sendEmail.controller');
const { hashPassword, comparePassword } = require('../helpers/utils');
const { sendResponse } = require('../helpers/apiResponse');
const mailMessags = require('../helpers/emailMessages');
const config = require('config');

const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');

function searchImageByName(directoryPath, imageName) {
    const imageNameWithoutExtension = path.parse(imageName).name;

    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            const foundImage = files.find(file => {
                const fileNameWithoutExtension = path.parse(file).name;
                return fileNameWithoutExtension === imageNameWithoutExtension;
            });
            if (foundImage) {
                const imagePath = path.join(directoryPath, foundImage);
                resolve(imagePath);
            } else {
                resolve(null); // Image not found
            }
        });
    });
}

async function uploadImage(file, userID) {
    const tempPath = file.path;
    const fileExtension = path.extname(file.originalname);
    const newFileName = `user_${userID}${fileExtension}`;
    const uploadPath = 'assets/images/users';

    if (!fs.existsSync(path.join(uploadPath))) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const targetPath = path.join(uploadPath, newFileName);

    try {
        const foundImage = await searchImageByName(uploadPath, newFileName);
        // Remove any existing image for this user before uploading the new image
        if (foundImage) {
            fs.unlinkSync(foundImage);
        }

        fs.renameSync(tempPath, targetPath);
        return newFileName;
    } catch (error) {
        throw new Error('Error uploading image:', error);
    }
}

const createUser = async (req, res) => {
    try {
        const { username, fname, lname, phone, email, role, password } = req.body;
        const checkUser = await User.checkIfUserExisted(email, username);

        if (checkUser.length) {
            return res.status(406).send({
                statusCode: 406,
                statusMessage: ' Not Acceptable',
                message: 'user already existed.',
            });
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            throw new Error('Password error');
        }

        const user = new User({
            username,
            fname,
            lname,
            phone,
            email,
            role,
            password: hashedPassword,
        });

        await user.createUser();

        sendResponse(res, 201, 'Created', 'Successfully created a user.', null, user);

        const title = mailMessags.loginMessage.title.replace('{0}', username);
        const body = mailMessags.loginMessage.body.replace('{0}', username).replace('{1}', password);
        sendReqularEmail(email, title, body);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers();

        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the users.', null, users);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getSingleUser = async (req, res) => {
    try {
        const id = req.params.id;
        const singleUser = await User.getUserById(id);

        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single user.', null, singleUser);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const id = req.params.id;

        const checkUser = await User.checkUserUpdate(username, email, id);

        if (checkUser.length) {
            return res.json({
                status: 406,
                stautsCode: 'Not Acceptable',
                message: 'dek_alert_user_editFail_userNameOrEmail_exsists',
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userData = req.body;

        if (req.file) {
            const imageName = await uploadImage(req.file, id);
            userData.image = imageName;
        }

        const user = new User(userData);
        await user.updateUser(id);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a user.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const updateUserPassword = async (req, res) => {
    const id = req.params.id;
    const { password, new_password, verify_password } = req.body;

    try {
        if (new_password !== verify_password) {
            throw new Error('Passwords do not match');
        }

        const user = await User.getUserById(id);

        if (!user.length) {
            throw new Error('The user does not exist');
        }

        const match = await comparePassword(password, user[0].password);

        if (match !== true) {
            throw new Error('Current password does not match');
        }

        const newPaawordHash = await hashPassword(new_password);

        await User.updatePassword(id, newPaawordHash);

        sendResponse(res, 200, 'Ok', 'Successfully update the password', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await User.deleteUser(id);
        sendResponse(res, 200, 'Ok', 'Successfully deleted a user.', null, data);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const login = async (req, res) => {
    const { email_username, password, rememberMe, fingerprint } = req.body;

    try {
        const data = await User.loginUser(email_username);

        if (data.length > 0) {
            const match = await comparePassword(password, data[0].password);

            if (match) {
                const expiresIn = rememberMe ? '30d' : '1d';
                const finger_print = fingerprint + String(data[0].staff_id);
                const token = jwt.sign({ id: finger_print }, JWT_SECRET_KEY, { expiresIn });

                res.json({
                    user: data[0],
                    authenticated: true,
                    accessToken: token,
                });

                return res;
            } else {
                return res.json({ error: 'Password or Email is incorrect' });
            }
        } else {
            return res.json({ error: 'User does not exist in the database' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const verifyToken = async (req, res) => {
    const { user_id, fingerprint } = req.body;

    try {
        if (req?.headers?.authorization?.startsWith('Bearer')) {
            let token = req.headers.authorization.split(' ')[1];
            if (token) {
                jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
                    if (error) {
                        return res.json({
                            statusCode: 401,
                            message: 'invalid token',
                        });
                    } else {
                        const checkUserDevice = fingerprint + user_id;
                        if (checkUserDevice === decoded.id) {
                            return res.json({
                                statusCode: 200,
                                authenticated: true,
                            });
                        } else {
                            return res.json({
                                statusCode: 401,
                                authenticated: false,
                            });
                        }
                    }
                });
            } else {
                return res.json({
                    statusCode: 401,
                    message: 'Unauthorized: invalid authentication token',
                });
            }
        } else {
            return res.json({
                statusCode: 401,
                message: 'Unauthorized: Missing authentication token',
            });
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

const getUsersImage = async (req, res) => {
    // Extract the file name from the request parameters
    const filename = req.params.filename;
    const uploadPath = 'assets/images/users';
    const filePath = path.join(uploadPath, filename);
    if (fs.existsSync(filePath)) {
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64Image}`;
        res.json({ img: dataURI });
    } else {
        res.status(404).send('File not found');
    }
};

module.exports = {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    updateUserPassword,
    login,
    verifyToken,
    getUsersImage,
};
