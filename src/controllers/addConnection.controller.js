const { connectionManager } = require('../databases/connectionManagment');
const { sendResponse } = require('../helpers/apiResponse');

const addConnection = async (req, res) => {
    try {
        const { key, databaseName, password, adminEmail, user } = req.body;
        await connectionManager.addConnect(key, {
            databaseOption: {
                database: databaseName,
                password: password,
                user,
            },
            AdminEmail: adminEmail,
        });
        sendResponse(res, 201, 'Created', 'Successfully created a connection.', null, null);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getConnections = async (req, res) => {
    try {
        const result = await connectionManager.getConnections();
        sendResponse(res, 201, 'Created', 'Successfully retrived all connections.', null, result);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    addConnection,
    getConnections,
};
