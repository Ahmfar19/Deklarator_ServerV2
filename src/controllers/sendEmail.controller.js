const nodemailer = require('nodemailer');
const config = require('config');
const EMAIL_HOST = config.get('EMAIL_HOST');
const EMAIL = config.get('EMAIL');
const EMAIL_PASS = config.get('EMAIL_PASS');
const path = require('path');

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST, // POP/IMAP Server
    port: 465, // SMTP Port
    secure: true, // Indicates if the connection should use SSL
    auth: {
        user: EMAIL, // Your email address
        pass: EMAIL_PASS, // Your password
    },
});

const sendEmailAttachment = async (to, subject, filename, content) => {
    let mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        attachments: [
            {
                filename: filename,
                content: content,
                encoding: 'binary',
            },
        ],
    };
    return sendEmail(mailOptions);
};

const sendEmailHtml = async (to, subject, htmlTemplate) => {
    let mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        html: htmlTemplate,
        attachments: [{
            filename: 'bb.png',
            path: path.join('assets/tampletes/bb.png'),
            cid: 'unique@kreata.ee', // same cid value as in the html img src
        }],
    };
    return sendEmail(mailOptions);
};

const sendReqularEmail = async (to, subject, text) => {
    let mailOptions = {
        from: EMAIL,
        to: to,
        subject: subject,
        text: text,
    };
    return sendEmail(mailOptions);
};

const sendEmail = async (mailOptions) => {
    return new Promise((resolve) => {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log('Error sending email', error);
                resolve(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
};

module.exports = {
    sendReqularEmail,
    sendEmailAttachment,
    sendEmailHtml,
};
