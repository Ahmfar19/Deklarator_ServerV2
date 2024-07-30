const Reminder = require('../models/reminder.model');
const Message = require('../models/message.model');
const MessageType = require('../models/message_type.model');
const User = require('../models/user.model');
const Tamplate = require('../models/tamplate.model');
const { sendEmailToGroup, sendEmailHtml } = require('./sendEmail.controller');
const { getNowDate_time } = require('../helpers/utils');
const path = require('path');
const fs = require('fs');
const mailMessags = require('../helpers/emailMessages');
const { connectionManager } = require('../databases/connectionManagment');
const cron = require('node-cron');

const checkForReminder = async (connectionName, adminEamil) => {
    try {
        const data = await Reminder.getReminders(connectionName);

        if (!data.length) return;

        const tamplates = await Tamplate.getAll(connectionName);

        const admins = await User.getAdmins(connectionName);
        const messageName = await MessageType.getMessageTypeByName('danger', connectionName);

        const { title } = mailMessags.reminder;

        const tamplatesArray = {};
        tamplates.map(tamplate => {
            tamplatesArray[tamplate.tamplate_id] = [];
        });

        data.forEach(data => {
            tamplatesArray[data.tamplate_id].push(data);
        });

        Object.keys(tamplatesArray).forEach(async (templateId) => {
            if (tamplatesArray[templateId].length) {
                const bccEmails = [];
                const tamplateBody = tamplatesArray[templateId][0].tamplate_body;
                const tamplateName = tamplatesArray[templateId][0].tamplate_name;

                tamplatesArray[templateId].forEach(async (item) => {
                    bccEmails.push(item.company_email);

                    switch (item.recurrent) {
                        case 1:
                            await Reminder.updateReminderEveryMonth(item.remender_id, connectionName);
                            break;
                        case 2:
                            await Reminder.updateReminderEveryWeek(item.remender_id, connectionName);
                            break;
                        case 3:
                            await Reminder.updateReminderEveryTwoWeek(item.remender_id, connectionName);
                            break;
                        case 4:
                            await Reminder.updateReminderEveryThreeWeek(item.remender_id, connectionName);
                            break;
                        case 5:
                            await Reminder.updataReminderEveryFirstDayInWeek(item.remender_id, connectionName);
                            break;
                        default:
                            await Reminder.deleteReminder(item.remender_id, connectionName);
                    }
                });

                const htmlTemplatePath = path.resolve(`assets/${connectionName}/tampletes/index.html`);
                let htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

                htmlTemplate = htmlTemplate.replace('{{tamplateBody}}', tamplateBody);

                const emailSent = await sendEmailToGroup(adminEamil, bccEmails, title, htmlTemplate, connectionName);

                if (!emailSent) {
                    const title = mailMessags.message.title;
                    const body = mailMessags.message.body;

                    const nowDateTime = getNowDate_time();

                    const bodyString = JSON.stringify({
                        key: body,
                        params: {
                            0: tamplateName,
                        },
                    });

                    for (const admin of admins) {
                        const message = new Message({
                            staff_id: admin.staff_id,
                            message_typ_id: messageName[0].message_typ_id,
                            title: title,
                            body: bodyString,
                            date_time: nowDateTime,
                            seen: false,
                        }, connectionName);

                        await message.save();
                    }
                }
            }
        });
    } catch (error) {
        //   console.log(error.message);
    }
};

// eslint-disable-next-line no-unused-vars
const checkForSingleReminder = async () => {
    try {
        const data = await Reminder.getReminders();

        if (!data.length) return;
        const admins = await User.getAdmins();
        const messageName = await MessageType.getMessageTypeByName('danger');

        const { title } = mailMessags.reminder;

        for (let i = 0; i < data.length; i++) {
            const htmlTemplatePath = path.resolve(`assets/tampletes/${data[i].tamplate_name}.html`);
            const htmlTemplate = fs.readFileSync(htmlTemplatePath);
            const emailSent = await sendEmailHtml(data[i].company_email, title, htmlTemplate);

            if (data[i].recurrent) {
                await Reminder.updateReminder(data[i].remender_id);
            } else {
                await Reminder.deleteReminder(data[i].remender_id);
            }

            if (!emailSent) {
                const title = mailMessags.message.title;
                const body = mailMessags.message.body;

                const nowDateTime = getNowDate_time();

                const bodyString = JSON.stringify({
                    key: body,
                    params: {
                        0: data[i].company_name,
                        1: data[i].tamplate_name,
                    },
                });

                for (const admin of admins) {
                    const message = new Message({
                        staff_id: admin.staff_id,
                        message_typ_id: messageName[0].message_typ_id,
                        title: title,
                        body: bodyString,
                        date_time: nowDateTime,
                        seen: false,
                    });

                    await message.save();
                }
            }
        }
    } catch (error) {
        // console.log(error.message);
    }
};

const sendReminderEmail = () => {
};

cron.schedule('0 8,9 * * *', async () => {
    const connections = await connectionManager.getConnections();
    for (let key in connections) {
        checkForReminder(key, connections[key].AdminEmail);
    }
}, {
    timezone: 'Europe/Stockholm',
});

module.exports = {
    sendReminderEmail,
    checkForReminder,
};
