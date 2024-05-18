const { check } = require('express-validator');

exports.signUpValidation = [
    check('username', 'username is required').not().isEmpty(),
    check('fname', 'fname is required').not().isEmpty(),
    check('lname', 'lname is required').not().isEmpty(),
    check('phone', 'phone is required').not().isEmpty(),
    check('email', 'please inter a valid email').isEmail(),
    check('password', 'password must be at least 8 characters').isLength({ min: 8 }),
];

exports.UpdateUserValidation = [
    check('username', 'user_name is required').not().isEmpty(),
    check('fname', 'fname is required').not().isEmpty(),
    check('lname', 'lname is required').not().isEmpty(),
    check('phone', 'phone is required').not().isEmpty(),
    check('email', 'please inter a valid email').isEmail(),
];
