const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const config = require('config');

const GENERATE_PASSWORD = config.get('GENERATE_PASSWORD');
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`;
    return dateTimeString;
}

function getFutureDateTime() {
    const now = new Date();
    const futureTime = new Date(now.getTime() + (60 * 60 * 1000)); // Adding one hour in milliseconds
    const year = futureTime.getFullYear();
    const month = String(futureTime.getMonth() + 1).padStart(2, '0');
    const day = String(futureTime.getDate()).padStart(2, '0');
    const hours = String(futureTime.getHours()).padStart(2, '0');
    const minutes = String(futureTime.getMinutes()).padStart(2, '0');
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`;
    return dateTimeString;
}

function isDateTimeInPast(dateTimeToCheck) {
    const currentDateTime = new Date(getCurrentDateTime());
    const providedDateTime = new Date(dateTimeToCheck);
    return providedDateTime.getTime() < currentDateTime.getTime();
}

async function hashPassword(password) {
    // Number of salt rounds (the higher, the more secure but slower)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

function removeLastComma(str) {
    return str.replace(/,$/, '');
}

function getNowDate_time() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 to match SQL month format
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getDate() === today.getDate()
        && date.getMonth() === today.getMonth()
        && date.getFullYear() === today.getFullYear()
    );
}

function getLastWeekDate() {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    // Format the lastWeekDate to 'YYYY-MM-DD'
    const year = lastWeekDate.getFullYear();
    const month = String(lastWeekDate.getMonth() + 1).padStart(2, '0');
    const day = String(lastWeekDate.getDate()).padStart(2, '0');
    const formattedLastWeekDate = `${year}-${month}-${day}`;
    return formattedLastWeekDate;
}

async function verifyToken(fingerprint, token) {
    const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');
    return new Promise((resolve) => {
        jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
            if (error) {
                resolve(false);
            } else {
                const authenticated = fingerprint === decoded.id;
                resolve(authenticated);
            }
        });
    });
}

const generatePassword = async (length = 12) => {
    const charset = GENERATE_PASSWORD;
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

function timeUntil(targetHour) {
    const now = new Date(); // Current date and time
    const target = new Date(now); // Create a date object for the target time

    // Set the target hour
    target.setHours(targetHour, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 08:00

    // If the target time is earlier than the current time, set the target to the next day
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    // Calculate the difference in milliseconds
    const difference = target - now;

    return difference; // Returns the time left in milliseconds
}

module.exports = {
    getCurrentDateTime,
    getFutureDateTime,
    hashPassword,
    comparePassword,
    isDateTimeInPast,
    removeLastComma,
    getNowDate_time,
    isToday,
    getLastWeekDate,
    verifyToken,
    generatePassword,
    timeUntil,
};
