const Reminder = require('../models/reminder.model');
const { sendEmail } = require('./sendEmail.controller');
const mailMessags = require('../helpers/emailMessages');

const checkForReminder = async () => {
    try {
        const data = await Reminder.getReminders();
        if (!data.length) return;

        const { title, body } = mailMessags.reminder;


        console.error('data', data);
        for (let i = 0; i < data.length; i++) {
            const emailSent = await sendEmail(data[i].company_email, title, body);

            console.error('emailSent', emailSent);

            if (data[i].recurrent) {
                await Reminder.updateReminder(data[i].remender_id);
            } else {
                await Reminder.deleteReminder(data[i].remender_id);
            }

            if (!emailSent) {
                // Insert a message
            }
        }
    
    } catch (error) {
        console.log(error.message);
    }
};

const sendReminderEmail = () => {
    const intervalInMilliseconds = 6 * 60 * 60 * 1000;
    setInterval(async function () {
        checkForReminder();
    }, intervalInMilliseconds);
};

module.exports = {
    sendReminderEmail
}