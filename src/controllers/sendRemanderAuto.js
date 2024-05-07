// const cron = require('node-cron');
const Remender = require('../models/remender.model');
const cron = require('node-cron');
//getDate From Database
 const getDateFromDatabase = async () => {

     const data = await Remender.get_RemenderDate()

     const currentDate = new Date() 

     const nowYear = currentDate.getFullYear()
     const nowMonth = currentDate.getMonth() + 1
  
     const dbYear = data[0].year
     const dbMonth = data[0].month
     

     if(dbYear == nowYear && dbMonth == nowMonth) {
      
        console.log('send Email');
     } else {
       
        console.log('error');
     }

     return { dbYear, dbMonth };
 };

const sentRemenderEmail = async () => {
    const { year, month } = await getDateFromDatabase();
    console.log(year);
    cron.schedule('* * * * *', getDateFromDatabase);
    
}

module.exports = {
    sentRemenderEmail
}