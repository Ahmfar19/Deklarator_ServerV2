const Remender = require('../models/remender.model');
const { sendEmail } = require('./sendEmail.controller')

const sendReminderEmail = () => {
  // const intervalInMilliseconds = 6 * 60 * 60 * 1000;
  setInterval(async function () {
    try {
      const data = await Remender.get_RemenderDate();

      if (data?.length) {

        for (let i = 0; i < data.length; i++) {

          const emailSent = await sendEmail(data[i].company_email, "title", "body");
           
             if (data[i].recurrent) {

               if (emailSent) {

                 await Remender.updateRemenderIfReCurrentDate(data[i].remender_id);

               } else {

                 console.error(`Failed to send email to ${data[i].company_email}`);
               }
             } else {

               if (emailSent) {

                 await Remender.delete_Remender(data[i].remender_id);

               } else {

                 console.error(`Failed to send email to ${data[i].company_email}`);
               }
             }
     
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }, 1000);
};

module.exports = {
  sendReminderEmail
}