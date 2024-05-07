const dotenv = require('dotenv');
const { sentRemenderEmail } = require('./controllers/sendRemanderAuto')
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config();

const config = require('config');
const PORT = config.get('PORT');

const app = require('./app');




sentRemenderEmail()
app.listen(4000, () => console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`));
