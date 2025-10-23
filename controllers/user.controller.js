const { ConnectionRequest } = require("../models/connectionRequest.model");
const User = require("../models/user.model")


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const receivedRequests = async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA);
        // }).populate("fromUserId", ["firstName", "lastName"]);

        // const data = connectionRequests.map(request => request.fromUserId)

        res.status(200).json({ success: true, message: "Connection requests fetched successfully.. ", data:connectionRequests })

    } catch (error) {
        next(error)
    }
}

const connections = async (req, res, next) => {
    try {
        let loggedInUser = req.user;
        const allConnections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        const data = allConnections.map(doc => {
            if (doc.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return doc.toUserId;
            }
            return doc.fromUserId;
        })

        res.status(200).json({ success: true, message: "All connection fetched successfully. ..", data })
    } catch (error) {
        next(error)
    }

}

const feed = async (req, res, next) => {
    
    try {
        const loggedInUser = req.user;
        
        const page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 10);
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ],
        })

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.status(200).json({ success: true, message: `Feed fetched successfully`, data: users })
        
    } catch (error) {
        next(error)
    }
}


module.exports = { receivedRequests, connections, feed }