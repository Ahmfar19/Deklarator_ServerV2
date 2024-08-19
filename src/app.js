const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/api.router');
const cors = require('cors');
const { sendReminderEmail } = require('./controllers/sendReminder.controller.js');
const { deleteOldMessages } = require('./controllers/message.controller.js');
const { verifyToken } = require('./helpers/utils.js');
require('./databases/connectionManagment.js');
const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/server/ping', (req, res) => {
    res.send('Server is active.');
});

app.use((req, res, next) => {
    // console.error('req', req.originalUrl.split('/')[3])
    req.customerId = req.originalUrl.split('/')[3];
    next();
});

const NODE_ENV = process.env.NODE_ENV || 'production';
const whitelist = ['https://administreramer.se'];
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

// To allow access to the assets from outside the server
async function verifyInlogged(req, res, next) {
    const token = req.query?.token;
    const staff_id = req.query?.staff_id;
    const fingerprint = req.query?.cid + staff_id + '@@' + req.customerId;
    const authenticated = await verifyToken(fingerprint, token);
    if (authenticated) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

app.use('/server/api/:customerId/assets', verifyInlogged, express.static('assets'));

// Setting an intervall every 6 hours that cehck for a reminder to send.
sendReminderEmail();
// Setting an intervall every 7 days to delete messages
deleteOldMessages();

app.use('/server/api/:customerId', apiRouter);

// ***************** When testing the fronEnd by this server **************** //
//  const path = require('path');
//  app.use(express.static(path.join(__dirname, '../dist')));
//  app.get('/*', (req, res, next) => {
//      if (req.path.startsWith('/assets')) {
//          return next();
//      }
//      res.sendFile(path.join(__dirname, '../dist/index.html'));
//  });
// ***************** END fronEnd testing **************** //

// ***************** Keep the server alive **************** //
const url = "https://administreramer.se/server/ping";
async function pingServer() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            // console.error('Ping successful:', response.status);
        } else {
            // console.error(`Request failed. Status Code: ${response.status}`);
        }
    } catch (error) {
        // console.error('Error during ping request:', error.message);
    }
}
setInterval(pingServer, 4 * 60 * 1000);

module.exports = app;

// ***************** To save **************** //
// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// Old main router for the api
// app.use('/api', apiRouter);
// app.get('/', (req, res) => res.send('It, works!'));
