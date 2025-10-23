const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const isUserAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            const err = new Error("Unauthorized: Token not provided.");
            err.status = 401;
            return next(err);
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            err.status = 401;
            err.message = "Unauthorized: Invalid token.";
            return next(err);
        }

        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            const err = new Error("Unauthorized: User not found.");
            err.status = 401;
            return next(err);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { isUserAuthenticated };
