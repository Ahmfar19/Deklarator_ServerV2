const express = require('express');
const router = express.Router();
const multer = require('multer');

const timeStampTypeController = require('../controllers/timeStampType.controller');
const companyController = require('../controllers/company.controller');
const noteController = require('../controllers/note.controller');
const timerController = require('../controllers/timer.controller');
const userController = require('../controllers/user.controller');
const caseController = require('../controllers/case.controller');
const timeStampController = require('../controllers/timeStamp.controller');
const paymentController = require('../controllers/payment.controller');
const resetPassword = require('../controllers/reset_password.controller');
const messagesController = require('../controllers/message.controller');
const companyType = require('../controllers/company_type.controller');
const taskController = require('../controllers/task.controller');
const remenderController = require('../controllers/remender.controller');
const messageTypeController = require('../controllers/message_type.controller');
const TamplateController = require('../controllers/tamplate.controller');
const checkListController = require('../controllers/checkList.controller');
const uploadFilesController = require('../controllers/uploadFiles.controller');
const guestsController = require('../controllers/guest.controller');
const reportTemaplteController = require('../controllers/reportTemplate.controller');
const employeeController = require('../controllers/employee.controller');
const employeeReportController = require('../controllers/employeeReport.controller');

const path = require('path');

// import validation register schema
const { signUpValidation } = require('../helpers/validation');

const upload = multer({ dest: path.join('../../assets/images/users') });

/////////////////// register & login Routes //////////////////////
// create user
router.post('/user/new', signUpValidation, userController.createUser);
router.get('/users', userController.getUsers);
router.get('/user/image/:filename', userController.getUsersImage);
router.get('/user/:id', userController.getSingleUser);
router.put('/user/edit/:id', upload.single('image'), userController.updateUser);
router.delete('/user/delete/:id', userController.deleteUser);
router.put('/user/password/:id', userController.updateUserPassword);
router.post('/login', userController.login);
router.post('/verifyToken', userController.verifyToken);

// Forget password
router.post('/forgetPassword', resetPassword.forgetPassword);
// Reset Password
router.post('/resetPassword', resetPassword.resetPassword);
// pinCode for compare
router.post('/pinCode', resetPassword.checkPinCode);

/////////////// TimeStampType Routes /////////////////
router.post('/timeStampType/new', timeStampTypeController.createtimeStampType);
router.get('/timeStampTypes', timeStampTypeController.getTimeStampTypes);
router.get('/timeStampType/:id', timeStampTypeController.getSingleTimeStampType);
router.put('/timeStampType/edit/:id', timeStampTypeController.updateTimeStampType);
router.delete('/timeStampType/delete/:id', timeStampTypeController.deleteTimeStampType);

///////////// Company Routes //////////////////
router.get('/companies', companyController.getCompanys);
router.get('/company/:id', companyController.getSingleCompany);
router.post('/company/new', companyController.addCompany);
router.put('/company/edit/:id', companyController.updateCompany);
router.delete('/company/delete/:id', companyController.deleteCompany);

///////////// Company Type //////////////////
router.get('/companyTypes', companyType.getCompanyType);
router.post('/companyType/new', companyType.addCompanyType);

//////////////// Note Routes //////////////
router.get('/noties', noteController.getAllNoties);
router.post('/note/new', noteController.addNote);
router.get('/note/:id', noteController.getSingleNote);
router.put('/note/edit/:id', noteController.updateNote);
router.delete('/note/delete/:id', noteController.deleteNote);
router.get('/notes/companyId/:id', noteController.getNotesBy_CompanyId);

///////////////// Case Routes /////////////////
router.get('/cases', caseController.getCases);
router.get('/case/:id', caseController.getSingleCase);
router.post('/case/new', caseController.addCase);
router.put('/case/edit/:id', caseController.updateCase);

///////////////// Timer Routes /////////////////
router.get('/timers', timerController.getTimers);
router.get('/timer/:id', timerController.getSingleTimer);
router.post('/timer/new', timerController.addTimer);
router.put('/timer/edit/:id', timerController.update_Timer);
router.delete('/timer/delete/:id', timerController.deleteTimer);

/////////////// TimeStamp Routes /////////////////
router.post('/timeStamp/new', timeStampController.createTimeStamp);
router.get('/timeStamps', timeStampController.getTimeStamps);
router.get('/timeStamp/:id', timeStampController.getSingleTimeStamp);
router.put('/timeStamp/edit/:id', timeStampController.updateTimeStamp);
router.delete('/timeStamp/delete/:id', timeStampController.deleteTimeStamp);
router.get('/timestamps/overView', timeStampController.getTimeStamp_OverView);
router.get('/timeStamps/date/:year/:month', timeStampController.getTimeStampsFilterBy_Year_Month);
router.get('/timeStamps/user/:id', timeStampController.getTimeStampsFilterBy_User);
router.get('/timeStamps/limit/:number', timeStampController.getLastLimit);
router.get('/timeStamps/lastMonths/:months', timeStampController.getLastMonths);
router.get('/timeStamps/filter', timeStampController.getFilterByUserCompanyType);

/////////////// Payment Routes /////////////////
router.get('/payments', paymentController.getAllPayments);
router.get('/payment/:id', paymentController.getSinglePayment);
router.post('/payment/new', paymentController.createPayment);
router.put('/payment/edit/:id', paymentController.updatePayment);
router.delete('/payment/delete/:id', paymentController.deletePayment);
router.get('/payments/companyId/:id', paymentController.getPaymentsBy_CompanyId);

/////////////// Messages Routes /////////////////
router.get('/messages', messagesController.getMessages);
router.get('/message/:id', messagesController.getSingleMessage);
router.post('/message/new', messagesController.addMessage);
router.put('/message/edit/:id', messagesController.updateMessage);
router.put('/message/upateseen/:id', messagesController.updateSeenBeforeId);
router.delete('/message/delete/:id', messagesController.deleteMessage);

/////////////// Tasks Routes /////////////////
router.get('/tasks', taskController.getTasks);
router.get('/task/types', taskController.getTasksTypes);
router.get('/task/:id', taskController.getSingleTask);
router.post('/task/new', taskController.addTask);
router.post('/multitask/new', taskController.addMultiTask);
router.put('/task/edit/:id', taskController.updateTask);
router.delete('/task/delete/:id', taskController.deleteTask);

/////////////// Reminder Routes /////////////////
router.get('/remenders', remenderController.getRemenders);
router.get('/remender/filter', remenderController.getFilterdReminder);
router.get('/remender/:id', remenderController.getSingleRemender);
router.get('/remender/company/:id', remenderController.getCompanyReminders);
router.post('/remender/new', remenderController.addRemender);
router.post('/multiremender/new', remenderController.addMultiReminder);
router.put('/remender/edit/:id', remenderController.updateRemender);
router.delete('/remender/delete/:id', remenderController.deleteRemender);

/////////////// MessageType Routes /////////////////
router.get('/messageTypes', messageTypeController.getMessageTypes);
router.get('/messageType/:id', messageTypeController.getSingleMessageType);
router.post('/messageType/new', messageTypeController.addMessageType);
router.put('/messageType/edit/:id', messageTypeController.updateMessageType);
router.delete('/messageType/delete/:id', messageTypeController.deleteMessageType);

/////////////// Tamplates Routes /////////////////
router.get('/tamplates', TamplateController.getTamplatesName);
router.post('/tamplate/new', TamplateController.createTamplate);
router.put('/template/edit/:id', TamplateController.updateTamplate);
router.delete('/template/delete/:id', TamplateController.deleteTemplate);

/////////////// checkListItems Routes /////////////////
router.get('/checkListItems', checkListController.getcheckListItems);
router.get('/checklist/company/:id', checkListController.getCompanyCheckList);
router.put('/checklist/edit', checkListController.updateChecklist);
router.post('/checklist/new/:id', checkListController.createCopmpanyCheckList);

////////////////////// upload files  ////////////////////////
router.post('/uploadFile', uploadFilesController.uploadFile);
router.delete('/delteFile/:company_id/', uploadFilesController.deleteFile);
router.get('/getFile/:company_id/:filename', uploadFilesController.getFile);
router.get('/getFiles/:company_id', uploadFilesController.getFiles);
router.post('/uploadMultipleFiles', uploadFilesController.uploadMultiFiles);

////////////////////// Guest files  ////////////////////////
router.post('/guest/new', guestsController.addGuest);
router.delete('/guest/delete/:company_id', guestsController.deleteGuest);
router.get('/guests', guestsController.getGuests);
router.post('/guest/login', guestsController.loginGuest);

////////////////////// employee Routes  ////////////////////////
router.post('/employee/new', employeeController.addEmployee);
router.get('/employess/company/:id', employeeController.getEmployees);
router.get('/employee/:id', employeeController.getSingleEmployee);
router.put('/employee/edit/:id', employeeController.updateEmployee);
router.delete('/employee/delete/:id', employeeController.deleteEmployee);

////////////////////// reportTemplate Routes  ////////////////////////
router.get('/reportTemplates', reportTemaplteController.getReportTemplate);

///////////////////////  employee_Report   ////////////////////////////
router.put('/employeeReport/edit/:employee_id', employeeReportController.updateReport);
router.get('/reportTaplate/employee/:id', employeeReportController.getEmployeeReport);
router.post('/employeeReport/new/:employee_id', employeeReportController.addEmployeeReport);
router.get('/reports/employees/:companyId', employeeReportController.getReportsEmployeesByCompanyId);
router.delete('/report/delete/:id', employeeReportController.deleteEmployeeReport);

router.get('/checkAuth', (req, res) => {
    const access_token = req.cookies.accessToken;
    if (access_token) {
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router;
