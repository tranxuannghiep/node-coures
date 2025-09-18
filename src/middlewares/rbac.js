"use strict";

const { AuthFailureError } = require("../core/error.response");
const { roleList } = require("../services/rbac.service");
const { rbac } = require("./role.middleware");

/**
 *
 * @param {string} action //read, delete or update
 * @param {*} resource // profile, balance,...
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const grants = await roleList({
         limit: 30, page: 1, search: ""
      });
      
      await rbac.setGrants(grants);
      const role_name = req.query.role;
      const permission = rbac.can(role_name)[action](resource);

      if (!permission.granted) {
        throw new AuthFailureError("Permission denied");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
