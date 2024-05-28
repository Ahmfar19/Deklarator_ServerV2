const Test = require('../models/test.model');


const createUser = async (req, res) => {
    try {
        const { username, fname, lname, phone, email, role, password } = req.body;
        const { connectionName } = req.query;
        const test = new Test({ username, fname, lname, phone, email, role, password }, connectionName);
        
        const userId = await test.createUser();
        res.status(201).json({ test });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        const { connectionName } = req.query;
        const users = await Test.getAllUsers(connectionName); // Pass connectionName to the model method

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    createUser,
    getUsers
};
