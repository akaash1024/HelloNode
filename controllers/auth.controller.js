const { validateSignUpData } = require("../utils/validation")
const User = require("../models/user.model")

const signUp = async (req, res, next) => {
    try {
        validateSignUpData(req)

        const { firstName, lastName, emailId, password, skills } = req.body;

        const newUser = await User.create({ firstName, lastName, emailId, password, skills })

        const token = newUser.generatToken()

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
        });

        res.status(201).json({ success: true, message: "Account Created Successfully. ..", data: newUser })

    } catch (error) {
        next(error)
    }
}

const signIn = async (req, res, next) => {
    try {
        const { emailId, password } = req.body;
        
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {
            throw new Error("Invalid Credentials")
        }

        const token = await user.generatToken()
        console.log(token);
        

        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.status(200).json({ success: true, message: "Login Successful. ..", data: user })

    } catch (error) {
        next(error)
    }
}

const signOut = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Signout Successful!!");
}

module.exports = { signUp, signIn, signOut }