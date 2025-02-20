"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log(`[P]::createProduct`, req.body);

    new CREATED({
      message: "Successfully create product",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    console.log(`[P]::publishProductByShop`, req.body);

    const { id } = req.params;

    new SuccessResponse({
      message: "Successfully publish product",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: id,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    console.log(`[P]::getAllDraftsForShop`, req.body);

    new SuccessResponse({
      message: "Get list draft success",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    console.log(`[P]::getAllPublishForShop`, req.body);

    new SuccessResponse({
      message: "Get list publish success",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
