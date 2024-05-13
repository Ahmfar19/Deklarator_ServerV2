 const sendResponse = (res, code, statusMessage, message, error, data) => {
    res.status(code).send({
        statusCode: code,
        statusMessage: statusMessage,
        ok: code === 200,
        message: message,
        error:error,
        data: data,
    });
}

module.exports = {
    sendResponse
};

