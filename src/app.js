const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/api.router');
const cors = require('cors');
const { sendReminderEmail } = require('./controllers/sendReminder.controller.js');
const { deleteOldMessages } = require('./controllers/message.controller.js');
const { verifyToken } = require('./helpers/utils.js');
require('./databases/connectionManagment');

const app = express();

app.use(cookieParser());
app.use(express.json());

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

// To allow access to the assets from outside the server
async function verifyInlogged(req, res, next) {
    const token = req.cookies?.accessToken;
    const fingerprint = req.query?.cid + req.cookies?.staff_id;
    const authenticated = await verifyToken(fingerprint, token);
    if (authenticated) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

app.use('/assets', verifyInlogged, express.static('assets'));

// Setting an intervall every 6 hours that cehck for a reminder to send.
sendReminderEmail();
// Setting an intervall every 7 days to delete messages
deleteOldMessages();

// app.get('/', (req, res) => res.send('It, works!'));
app.use('/api', apiRouter);

// ***************** When uploading to the production server **************** //
// app.use('/server/api', apiRouter);
// app.use('/server/assets', verifyInlogged, express.static('assets'));

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

// ***************** END **************** //

module.exports = app;

// ***************** To save **************** //
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
