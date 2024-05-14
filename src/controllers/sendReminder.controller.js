const Reminder = require('../models/reminder.model');
const Message = require('../models/message.model');
const MessageType = require('../models/message_type.model');
const User = require('../models/user.model');
const { sendEmailHtml } = require('./sendEmail.controller');
const { getNowDate_time } = require('../helpers/utils')
const path = require('path');
const fs = require('fs');
const mailMessags = require('../helpers/emailMessages');

const checkForReminder = async () => {
    
    try {
        
        const data = await Reminder.getReminders();
       
        if (!data.length) return;
       
        const admins = await User.getAdmins();
        const messageName = await MessageType.getMessageTypeByName()
      
        const { title } = mailMessags.reminder;
       
        for (let i = 0; i < data.length; i++) {
          
            const htmlTemplatePath = path.resolve(`assets/tampletes/${data[i].tamplate_name}.html`);    
            const htmlTemplate = fs.readFileSync(htmlTemplatePath)
        
            const emailSent = await sendEmailHtml(data[i].company_email, title, htmlTemplate);

            if (data[i].recurrent) {
                await Reminder.updateReminder(data[i].remender_id);
            } else {
                await Reminder.deleteReminder(data[i].remender_id);
            }

            if (!emailSent) {

                const nowDateTime = await getNowDate_time()

                for (const admin of admins) {
                    
                    const message = new Message({
                        staff_id: admin.staff_id,
                        message_typ_id: messageName[0].message_typ_id,
                        title: `Failed to send reminder to ${data[i].company_email}`,
                        body: "Please try again",
                        date_time: nowDateTime,
                        seen: false
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
     const intervalInMilliseconds = 6 * 60 * 60 * 1000;
    setInterval(function () {
        checkForReminder();
    }, intervalInMilliseconds);
};

module.exports = {
    sendReminderEmail
}

