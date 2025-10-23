const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user.model")



const viewProfile = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({ success: true, message: "User fetched successfully", data: user })
    } catch (error) {
        next(error)
    }
}

const updateProfile = async (req, res, next) => {
    try {
        if (!validateEditProfileData(req)) throw new Error("Invalid Edit Request, Update not allowed")

        const loggedInUser = req.user;
        console.log(loggedInUser);

        /**
         * // ! OR
         * // Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
         * // await loggedInUser.save();
         * */

        const updatedUser = await User.findByIdAndUpdate(loggedInUser._id, req.body, { new: true, runValidators: true, returnDocument: "after" });

        res.json({ message: `${loggedInUser.firstName}, your profile updated successfuly`, data: updatedUser, });

    } catch (error) {
        next(error)
    }
}

module.exports = { viewProfile, updateProfile }