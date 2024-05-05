const TimeStamp = require('../models/timeStamp.model');
const { sendResponse } = require('../helpers/apiResponse');

//get All CaseTypes
const getTimeStamps = async (req, res) => {
    try {
        const timestamps = await TimeStamp.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestamps', null, timestamps);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

//get single CaseType
const getSingleTimeStamp = async (req, res) => {

    try {
        const id = req.params.id;
        const timestamp = await TimeStamp.getSingle(id)
        sendResponse(res, 200, 'Ok', 'Successfully retrieved  the timestamp', null, timestamp);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }

};

//Create CaseType
const createTimeStamp = async (req, res) => {
    try {
        const timeStamp = new TimeStamp(req.body);
        await timeStamp.save();
        sendResponse(res, 201, 'Created', 'Successfully created a timeStamp.', null, timeStamp);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

//updateCase_Type
const updateTimeStamp = async (req, res) => {

    try {
        const id = req.params.id;
        const timeStamp = new TimeStamp(req.body);
       
        
        const data = await timeStamp.update(id);
        if(data.affectedRows === 0){
            throw new Error('TimeStamp not found or unable to update');
        }
        sendResponse(res, 202, 'Accepted', 'Successfully updated a timeStamp.', null, timeStamp);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

//delete CaseType
const deleteTimeStamp = async (req, res) => {

    try {
        const id = req.params.id;
    
        const data = await TimeStamp.findByIdAndDelete(id);
        if(data.affectedRows === 0){
            throw new Error('TimeStamp not found or unable to delete');
        }
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a TimeStamp.', null, null);
    }
    catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

//getTimeStamp relationShip Join company staff type
const getTimeStamp_OverView = async (req, res) => {
    try {
        const timeStampsOverView = await TimeStamp.getTimeStampOverView()
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestamps', null, timeStampsOverView);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

//Filter TimeStamps by year&month
const getTimeStampsFilterBy_Year_Month = async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    try {
        const timeStampDate = await TimeStamp.getFilterByYearMonth(year, month)
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestamps', null, timeStampDate);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

//filter TimeStamps by userId(Staff_id)
const getTimeStampsFilterBy_User = async (req, res) => {
    try {
        const timeStampByUser = await TimeStamp.getTimeStampsByStaff_id(req.params.id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestampsByUserId', null, timeStampByUser);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

//get pagination only 10 timeStamps
const getLastLimit = async (req, res) => {
    try {
        const timeStamps = await TimeStamp.getLatestTimeStamps(req.params.number);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestampsLatest', null, timeStamps);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

//get pagination only last TwoMonth
const getLastMonths = async (req, res) => {
    try {
        const timeStamps = await TimeStamp.getTimeStampsLastNMonths(req.params.months);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestampsLastTwoMonths', null, timeStamps);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

const getFilterByUserCompanyType = async (req, res) => {
    const { staff_id, company_id, type_id, from_yearMonth, to_yearMonth, from_date, to_date, stamp_id } = req.query;
    
    try {
        const filter = await TimeStamp.getFilterBy_User_Company_type(staff_id, company_id, type_id, from_yearMonth, to_yearMonth, from_date, to_date, stamp_id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the timestampsFilter', null, filter);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
}

module.exports = {
    createTimeStamp,
    getTimeStamps,
    getSingleTimeStamp,
    updateTimeStamp,
    deleteTimeStamp,
    getTimeStamp_OverView,
    getTimeStampsFilterBy_Year_Month,
    getTimeStampsFilterBy_User,
    getLastLimit,
    getLastMonths,
    getFilterByUserCompanyType
};
