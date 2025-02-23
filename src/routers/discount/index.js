"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.post("/amount", asyncHandler(discountController.getDiscountAmount));

// authentication
router.use(authentication);

router.post("", asyncHandler(discountController.createDiscount));
router.get("", asyncHandler(discountController.getListDiscountCodesByShopId));
router.get(
  "/:code",
  asyncHandler(discountController.getListProductsByDiscountCode)
);

module.exports = router;
