"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { getCities } = require("../../controllers/cities.controller");

const router = express.Router();

router.get("/", asyncHandler(getCities));

module.exports = router;
