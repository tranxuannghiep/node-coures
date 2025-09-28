"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { createIndex } = require("../../controllers/elasticsearch.controller");

const router = express.Router();

router.put("/", asyncHandler(createIndex));

module.exports = router;
