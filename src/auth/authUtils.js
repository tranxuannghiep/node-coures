"use strict";
const jwt = require("jsonwebtoken");
const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    // accessToken

    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: 60 * 60 * 24, // expires in 24 hours
    });

    // refreshToken
    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: 60 * 60 * 24 * 30, // expires in 30 days
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(11111, error);
  }
};

module.exports = { createTokenPair };
