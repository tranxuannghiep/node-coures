const { randomInt } = require("crypto")
const otpModel = require("../models/otp.model")

const generatorTokenRandom = () => {
    return randomInt(0, Math.pow(
        2, 32
    ))
}


const newOtp = async ({ email }) => {
    try {
        // 1. generate token
        const token = generatorTokenRandom()

        // 2. new token or otp
        const newToken = await otpModel.create({
            otp_token: token,
            otp_email: email
        })

        return newToken

    } catch (error) {

    }
}

module.exports = {
    newOtp
}