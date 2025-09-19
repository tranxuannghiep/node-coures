const { ConflictRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
const { sendEmailToken } = require("./email.service");


const newUser = async ({ email = null, captcha = null }) => {
    const user = await userModel.findOne({ user_email: email }).lean();
    if (user) {
        throw ConflictRequestError("Email already exists");
    }

    const result = await sendEmailToken({ email });

    return result
}


module.exports = {
    newUser
}