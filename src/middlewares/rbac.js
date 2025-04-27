"use strict";

const { AuthFailureError } = require("../core/error.response");
const { ac } = require("./role.middleware");

/**
 *
 * @param {string} action //read, delete or update
 * @param {*} resource // profile, balance,...
 */
const grantAccess = async (action, resource) => {
  return async (req, res, next) => {
    try {
      const role_name = res.query.role;
      const permission = ac.can(role_name)[action](resource);

      if (!permission.granted) {
        throw new AuthFailureError("Permission denied");
      }
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
