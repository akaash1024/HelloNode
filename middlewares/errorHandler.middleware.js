
const errorHandler = (err, req, res, next) => {
    const success = false;
    const status = err.status || 500;
    const message = err.message || "BACKEND ERROR";
    const extraDetails = err.extraDetails || "SOMETHING WENT WRONG";
    return res.status(status).json({ success, status, message, extraDetails })
}

module.exports = errorHandler;
