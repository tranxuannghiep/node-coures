"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();

router.delete("", asyncHandler(cartController.deleteUserCart));
router.patch("", asyncHandler(cartController.upsertUserCartQuantity));
router.post("", asyncHandler(cartController.addToCart));
router.get("", asyncHandler(cartController.getListUserCart));

module.exports = router;
