const { isUserAuthenticated } = require("../middlewares/isUserAuthenticated.middleware");
const { connectionRequestSchema } = require("../models/connectionRequest.model");
const connectionRequestController = require("../controllers/connectionRequest.controller")

const requestRoute = require("express").Router();

requestRoute.route("/send/:status/:toUserId").post(isUserAuthenticated, connectionRequestController.sendConnectionRequest)

requestRoute.route("/review/:status/:requestId").post(isUserAuthenticated, connectionRequestController.reviewConnectionRequest)


module.exports = { requestRoute }