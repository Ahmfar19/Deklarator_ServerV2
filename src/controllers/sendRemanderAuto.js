const cron = require('node-cron');
const { sendEmail } = require('../controllers/sendEmail.controller')
// Define a function to be executed by the cron job

const myCronJob = () => {
    const currentYear = new Date().getFullYear();

    // sendEmail('osamafaroun7@gmail.com', 'hello world', 'testEmail');
    console.log(currentYear);

};

// Schedule the cron job to run every day at a specific time
cron.schedule('0 0 1 1 *', myCronJob); // This will run the task on the 1st of January every year

// You can adjust the cron expression to fit your specific requirements

module.exports = {
    myCronJob
}