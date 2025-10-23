const { ConnectionRequest } = require("../models/connectionRequest.model")
const User = require("../models/user.model")

const sendConnectionRequest = async (req, res, next) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) throw new Error(`Invalid status type: ${status}`)

        const toUser = await User.findById(toUserId);
        if (!toUser) throw new Error(`User not found!!`)

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionRequest) throw new Error(`Connection Request Already Exists!!`)

        const data = await ConnectionRequest.create({ fromUserId, toUserId, status })
        let message = status === "interested" ? `${req.user.firstName} is instested in ${toUser.firstName}` : `${req.user.firstName} ignored ${toUser.firstName}'s profile. ..`

        res.status(200).json({ success: true, message, data })
    } catch (error) {
        error.status = 400;
        next(error)
    }
}

const reviewConnectionRequest = async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        
        const { requestId, status } = req.params;
        console.log(requestId, status);
        

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) throw new Error(`Invalid status type: ${status}`)

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionRequest) throw new Error(`Connection request not found . ..`)

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.status(200).json({ success: true, messaage: `${loggedInUser.firstName} has ${status} your request.` })
    } catch (error) {
        next(error)
    }
}

module.exports = { sendConnectionRequest, reviewConnectionRequest }