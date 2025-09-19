"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const { oneSku } = require("../services/sku.service");
const { newSpu, oneSpu } = require("../services/spu.service");


class ProductController {

  findOneSpu = async (req, res, next) => {
    console.log(`[P]::findOneSpu`, req.body);

    const { product_id } = req.query

    new SuccessResponse({
      message: "Find Spu Successfully",
      metadata: await oneSpu({ spu_id: product_id }),
    }).send(res);
  };

  findOneSku = async (req, res, next) => {
    console.log(`[P]::findOneSku`, req.body);

    const { sku_id, product_id } = req.query

    new SuccessResponse({
      message: "Find Sku Successfully",
      metadata: await oneSku({ sku_id, product_id }),
    }).send(res);
  };

  createSpu = async (req, res, next) => {
    console.log(`[P]::createSpu`, req.body);

    new CREATED({
      message: "Successfully create spu",
      metadata: await newSpu({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };


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

  updateProduct = async (req, res, next) => {
    console.log(`[P]::updateProduct`, req.body);

    new SuccessResponse({
      message: "Successfully create product",
      metadata: await ProductService.updateProduct(
        req.params.id,
        req.body.product_type,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
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

  unpublishProductByShop = async (req, res, next) => {
    console.log(`[P]::unpublishProductByShop`, req.body);

    const { id } = req.params;

    new SuccessResponse({
      message: "Successfully unpublish product",
      metadata: await ProductService.unpublishProductByShop({
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

  getListSearchProduct = async (req, res, next) => {
    console.log(`[P]::getListSearchProduct`, req.body);

    const { keySearch } = req.params;

    new SuccessResponse({
      message: "Get list publish success",
      metadata: await ProductService.searchProducts(keySearch),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    console.log(`[P]::findAllProducts`, req.body);

    new SuccessResponse({
      message: "Get list publish success",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    console.log(`[P]::findProduct`, req.body);
    const { product_id } = req.params;
    new SuccessResponse({
      message: "Get list publish success",
      metadata: await ProductService.findProduct({ product_id }),
    }).send(res);
  };
}

module.exports = new ProductController();
