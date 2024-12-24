const { verifyToken } = require('./helpers/utils.js');

async function verifyInlogged(req, res, next) {
    const token = req.cookies?.accessToken;
    const fingerprint = req.query?.cid + req.cookies?.staff_id;
    const authenticated = await verifyToken(fingerprint, token);
    if (authenticated) {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
}

module.exports = {
    verifyInlogged,
};
