const Reminder = require('../models/reminder.model');
// const Message = require('../models/message.model');
// const MessageType = require('../models/message_type.model');
// const User = require('../models/user.model');
const { sendEmailHtml } = require('./sendEmail.controller');
// const { getNowDate_time } = require('../helpers/utils');
const path = require('path');
const fs = require('fs');
const mailMessags = require('../helpers/emailMessages');

const getHtmlTemplate = (tamplateName) => {
    const htmlTemplatePath = path.resolve(`assets/tampletes/${tamplateName}.html`);
    const htmlTemplate = fs.readFileSync(htmlTemplatePath);
    return htmlTemplate;
};

const sendEmails = async (templateId, templateArray, title) => {
    for (const item of templateArray) {
        const htmlTemplate = getHtmlTemplate(item.tamplate_name);
        const emailSent = await sendEmailHtml(item.company_email, title, htmlTemplate);
       
        return emailSent// Log the email sending result directly
    }
};

const checkForReminder = async () => {
    try {
        const data = await Reminder.getReminders();
        if (!data.length) return;

        const { title } = mailMessags.reminder;

        const templates = {
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        };

        for (const item of data) {
            templates[item.tamplate_id].push(item);
        }

        for (const templateId of Object.keys(templates)) {
            if (templates[templateId].length) {
              const emailSent =  await sendEmails(templateId, templates[templateId], title);
              console.log(emailSent);
            }
           
        }

    } catch (error) {
        // Handle errors appropriately
        console.error(error);
    }
};
const sendReminderEmail = () => {
    const intervalInMilliseconds = 6 * 60 * 60 * 1000;
    setInterval(function () {
        checkForReminder();
    }, intervalInMilliseconds);
};

module.exports = {
    sendReminderEmail,
    checkForReminder,
};


