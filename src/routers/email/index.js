"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { newTemplate } = require("../../controllers/email.controller");

const router = express.Router();

router.post("/template", asyncHandler(newTemplate));

module.exports = router;
