
const Remender = require('../models/remender.model');

// getDate From Database


const sentRemenderEmail = async () => {
    const data = await Remender.get_RemenderDate();

    const currentDate = new Date();
    const nowYear = currentDate.getFullYear();
    const nowMonth = currentDate.getMonth() + 1;
  
    const dbYear = data[0].year;
    const dbMonth = data[0].month;
  
    if (dbYear === nowYear && dbMonth === nowMonth) {
      console.log('send Email');
    } else {
      console.log('error');
    }
};

module.exports = {
  sentRemenderEmail,
};