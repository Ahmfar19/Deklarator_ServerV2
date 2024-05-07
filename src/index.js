const dotenv = require('dotenv');
const { myCronJob } = require('./controllers/sendRemanderAuto')
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config();

const config = require('config');
const PORT = config.get('PORT');

const app = require('./app');

//Global handle error


myCronJob()
app.listen(4000, () => console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`));
