"use strict";

const { ForbiddenError } = require("../core/error.response");
const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    throw new ForbiddenError();
  }
  // check objKey

  const objKey = await findById(key);
  if (!objKey) {
    throw new ForbiddenError();
  }
  req.objKey = objKey;
  return next();
};

const permission = (permission) => {
  return async (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new ForbiddenError("Permission denied");
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new ForbiddenError("Permission denied");
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
