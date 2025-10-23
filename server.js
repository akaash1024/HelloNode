require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler.middleware");
const cors = require("cors")

const { authRoute } = require("./routes/auth.route");
const { profileRoute } = require("./routes/profile.route");
const { requestRoute } = require("./routes/request.route");
const { userRoute } = require("./routes/user.route");

const app = express();

//middlewares
app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute)
app.use("/api/profile", profileRoute)
app.use("/api", requestRoute)
app.use("/api/user", userRoute)

// error handler
app.use(errorHandler)

// database connection
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`⚙️ Server is listening at http://localhost:${PORT}`);
    })
})