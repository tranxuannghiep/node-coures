"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const {
  createResource,
  resourceList,
  createRole,
  roleList,
} = require("../services/rbac.service");

class RbacController {
  createResource = async (req, res, next) => {
    console.log(`[P]::createResource`, req.body);

    new CREATED({
      message: "Successfully createResource",
      metadata: await createResource(req.body),
    }).send(res);
  };

  resourceList = async (req, res, next) => {
    console.log(`[P]::resourceList`, req.body);

    new SuccessResponse({
      message: "Successfully resourceList",
      metadata: await resourceList(req.body),
    }).send(res);
  };

  createRole = async (req, res, next) => {
    console.log(`[P]::createRole`, req.body);

    new SuccessResponse({
      message: "Successfully createRole",
      metadata: await createRole(req.body),
    }).send(res);
  };

  roleList = async (req, res, next) => {
    console.log(`[P]::roleList`, req.body);

    new SuccessResponse({
      message: "Successfully roleList",
      metadata: await roleList(req.body),
    }).send(res);
  };
}

module.exports = new RbacController();
