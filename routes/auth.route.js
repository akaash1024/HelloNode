const authRoute = require("express").Router();
const authController = require("../controllers/auth.controller")

authRoute.route("/signup").post(authController.signUp)
authRoute.route("/signin").post(authController.signIn,)
authRoute.route("/signout").post(authController.signOut)


module.exports = { authRoute }