const dotenv = require('dotenv');
const https = require('https');

const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config();

const config = require('config');
const PORT = config.get('PORT');
const app = require('./app');

const pingWebsite = () => {
    const url = 'https://system.deklarator.se';
    https.get(url, () => {
    }).on('error', () => {
        return;
    });
};

// setInterval(() => {
//     pingWebsite();
// }, 4 * 60 * 1000)

app.listen(4000, () => console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`));
