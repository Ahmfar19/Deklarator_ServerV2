const nodemailer = require('nodemailer');
const config = require('config');

const EMAIL_HOST = config.get('EMAIL_HOST');
const EMAIL = config.get('EMAIL');
const EMAIL_PASS = config.get('EMAIL_PASS');

const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        host: EMAIL_HOST, // POP/IMAP Server
        port: 465, // SMTP Port
        secure: true, // Indicates if the connection should use SSL
        auth: {
            user: EMAIL, // Your email address
            pass: EMAIL_PASS // Your password
        }
    });

    let mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            console.log("Error sending email");
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendEmail
}
