"use strict";

const { SuccessResponse } = require("../core/success.response");
const { newUser } = require("../services/user.service");


class UserController {
    newUser = async (req, res, next) => {
        console.log(`[P]::createUser`, req.body);

        new SuccessResponse({
            message: "Successfully createUser",
            metadata: await newUser(req.body),
        }).send(res);
    };


}

module.exports = new UserController();
