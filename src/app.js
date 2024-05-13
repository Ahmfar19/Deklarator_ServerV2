const express = require('express');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/api.router');
const cors = require('cors');
require('./databases/mysql.db');
const { sendReminderEmail } = require('./controllers/sendReminder.controller.js');
const app = express();
const path = require('path');

app.use(cookieParser());
app.use(express.json());

// const NODE_ENV = process.env.NODE_ENV || 'development';
// const whitelist = [];
// const corsOptions = {
//     origin: function (origin = '', callback) {
//         if (whitelist.indexOf(origin) !== -1) callback(null, true);
//         else callback(new Error('Not allowed by CORS'));
//     },
//     methods: ['GET, POST'],
//     allowedHeaders: ['Content-Type'],
// };

// app.use(NODE_ENV === 'development' ? cors() : cors(corsOptions));

// This one or the above one
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(path.join(__dirname, '../dist')));

// To allow access to the assets from outside the server
// app.use('/assets', express.static('assets'));

// Setting an intervall every 6 hours that cehck for a reminder to send.
sendReminderEmail();

app.use(cors());
app.get('/app', (req, res) => { 
    res.sendFile(path.join(__dirname, '../dist/index.html')); 
});
app.get('/timer', (req, res) => { 
    res.sendFile(path.join(__dirname, '../dist/index.html')); 
});
app.get('/', (req, res) => res.send("It, works!"));
app.use('/api', apiRouter);
// app.use('/server/api', apiRouter);

module.exports = app;
