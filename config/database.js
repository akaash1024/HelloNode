const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_SECRET)
        console.log(`Database has been connected ... `);
    } catch (error) {
        console.error(`Failed to connect database`, error.message)
        process.exit(1)
    }
}

module.exports = {connectDB}