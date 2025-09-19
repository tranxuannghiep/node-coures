"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

router.get("/sku/select_variation", asyncHandler(productController.findOneSku));
router.get("/spu/get_sp_info", asyncHandler(productController.findOneSpu));

router.get("", asyncHandler(productController.findAllProducts));
router.get("/:product_id", asyncHandler(productController.findProduct));

// authentication
router.use(authentication);

router.post("/spu/new", asyncHandler(productController.createSpu));
router.post("/create-product", asyncHandler(productController.createProduct));
router.patch(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);

router.patch(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop)
);

router.patch("/:id", asyncHandler(productController.updateProduct));

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/publish/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
