"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const {
  createResource,
  resourceList,
  createRole,
  roleList,
} = require("../../controllers/rbac.controller");
const router = express.Router();

router.post("/resource", asyncHandler(createResource));
router.get("/resource", asyncHandler(resourceList));
router.post("/role", asyncHandler(createRole));
router.get("/role", asyncHandler(roleList));

module.exports = router;
