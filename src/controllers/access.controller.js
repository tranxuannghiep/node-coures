"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    console.log(`[P]::handleRefreshToken`, req.body);
    new SuccessResponse({
      message: "Get token successfully",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        keyStore: req.keyStore,
        user: req.user,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    console.log(`[P]::logout`, req.body);
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };

  login = async (req, res, next) => {
    console.log(`[P]::login`, req.body);
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    console.log(`[P]::signUp`, req.body);
    new CREATED({
      message: "Successfully signed up",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
