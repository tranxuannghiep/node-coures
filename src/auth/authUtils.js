"use strict";
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keytoken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = jwt.sign(payload, publicKey, {
    expiresIn: 60 * 60 * 24, // expires in 24 hours
  });

  // refreshToken
  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: 60 * 60 * 24 * 30, // expires in 30 days
  });

  return { accessToken, refreshToken };
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) {
    throw new AuthFailureError("Invalid Request");
  }

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) {
    throw new NotFoundError("Not Found keyStore");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request");
  }

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid User");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { createTokenPair, authentication };
