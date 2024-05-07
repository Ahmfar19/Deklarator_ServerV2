const dotenv = require('dotenv');
const { sentRemenderEmail } = require('./controllers/sendEmailAuto')
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config();

const config = require('config');
const PORT = config.get('PORT');

const app = require('./app');

//Global handle error
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "internal server error";
    res.status(err.statusCode).json({
        message: err.message,
        status: err.statusCode
    })
})

sentRemenderEmail()
app.listen(4000, () => console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`));
