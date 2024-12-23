const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/api.router');
const cors = require('cors');
const { checkForReminder } = require('./controllers/sendReminder.controller.js');
const { deleteOldMessages } = require('./controllers/message.controller.js');
const { verifyToken } = require('./helpers/utils.js');
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
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(NODE_ENV === 'development' ? cors() : cors(corsOptions));

app.use('/server/api/assets/images/users', express.static('assets/images/users'));

// To allow access to the assets from outside the server
async function verifyInlogged(req, res, next) {
    const token = req.cookies?.accessToken;
    const fingerprint = req.query?.cid + req.cookies?.staff_id;

    console.error('fingerprint', fingerprint);
    console.error('token', token);


    const authenticated = await verifyToken(fingerprint, token);
    if (authenticated) {
        next();
    } else {
        console.error('1', 1);
        res.status(403).send('Forbidden');
    }
}

app.use('/server/api/assets', verifyInlogged, express.static('assets'));

// Setting an intervall every 6 hours that cehck for a reminder to send.
checkForReminder();
// Setting an intervall every 7 days to delete messages
deleteOldMessages();

// app.get('/', (req, res) => res.send('It, works!'));
app.use('/server/api/', apiRouter);


// ***************** When testing the fronEnd by this server **************** //
const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));
app.get('/*', (req, res, next) => {
    if (req.path.startsWith('/assets')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});
// ***************** END fronEnd testing **************** //

module.exports = app;
