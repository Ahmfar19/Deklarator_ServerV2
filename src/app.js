const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/api.router');
const cors = require('cors');
const { checkForReminder } = require('./controllers/sendReminder.controller.js');
const { deleteOldMessages } = require('./controllers/message.controller.js');
const { verifyInlogged } = require('./authentication.js');
require('./databases/mysql.db');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/server/ping', (req, res) => {
    res.send('Server is active.');
});

app.get('/server/sendReminder', (req, res) => {
    checkForReminder();
    res.send('Server is active.');
});

const NODE_ENV = process.env.NODE_ENV || 'production';
const whitelist = [];
const corsOptions = {
    origin: function(origin = '', callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // 'Not allowed by CORS'
            callback(false);
        }
    },
    methods: ['GET, POST, DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
};
app.use(NODE_ENV === 'development' ? cors() : cors(corsOptions));

// Setting an intervall every 6 hours that cehck for a reminder to send.
checkForReminder();
// Setting an intervall every 7 days to delete messages
deleteOldMessages();

// ***************** When uploading to the production server **************** //
app.use('/server/assets/images/users', express.static('assets/images/users'));
app.use('/server/assets', verifyInlogged, express.static('assets'));
app.use('/server/api', apiRouter);

module.exports = app;

// ***************** When testing the fronEnd by this server **************** //
// const path = require('path');
// app.use(express.static(path.join(__dirname, '../dist')));

// app.get('/*', (req, res, next) => {
//     if (req.path.startsWith('/assets')) {
//         return next();
//     }
//     res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

// app.use('/assets', verifyInlogged, express.static('assets'));

// ***************** END fronEnd testing **************** //
