"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  createResource,
  resourceList,
  createRole,
  roleList,
} = require("../../controllers/rbac.controller");
const { grantAccess } = require("../../middlewares/rbac");
const router = express.Router();

router.post("/resource", asyncHandler(createResource));
router.get("/resource", asyncHandler(resourceList));
router.post("/role", asyncHandler(createRole));
router.get("/role", grantAccess("readAny", "profile"), asyncHandler(roleList));

module.exports = router;
