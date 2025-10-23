const userRoute = require("express").Router();
const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated.middleware");
const userController = require("../controllers/user.controller")




userRoute.route("/requests/received").get(isUserAuthenticated, userController.receivedRequests)
userRoute.route("/requests/connections").get(isUserAuthenticated, userController.connections)
userRoute.route("/feed").get(isUserAuthenticated, userController.feed)


module.exports = { userRoute }