const profileRoute = require("express").Router();
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated.middleware")
const profileController = require("../controllers/profile.controller")


profileRoute.route("/view").get(isUserAuthenticated, profileController.viewProfile)
profileRoute.route("/edit").patch(isUserAuthenticated, profileController.updateProfile)

module.exports = { profileRoute }