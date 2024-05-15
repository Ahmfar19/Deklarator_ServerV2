const sendResponse = (res, code, statusMessage, message, error, data) => {
    res.send({
        statusCode: code,
        statusMessage: statusMessage,
        ok: code === 200 || code === 202 || code === 201,
        message: message,
        error: error,
        data: data,
    });
}

module.exports = {
    sendResponse
};

