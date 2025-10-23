const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
        lastName: { type: String },
        emailId: {
            type: String, lowercase: true, required: true, unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address: " + value);
                }
            }
        },
        password: {
            type: String,
            required: true,
            validate(value) {
                if (!validator.isStrongPassword(value)) {
                    throw new Error("Enter a strong password: " + value)
                }
            }
        },
        age: {
            type: Number,
            min: 18
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message: 'enum validator failed for path `{PATH}` with value `{VALUE}`'
            }
        },
        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo URL: " + value);
                }
            },
        },
        about: {
            type: String,
            default: "This is a default about of the user!",
        },
        skills: {
            type: [String],
        },
    },
    {
        timestamps: true
    }
);




userSchema.methods.generatToken = async function () {
    const user = this;
    const token = await jwt.sign(
        { _id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
    )
    return token;
}
// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.validatePassword = async function (inputPasswordByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(inputPasswordByUser, passwordHash)

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)