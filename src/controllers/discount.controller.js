"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    console.log(`[P]::createDiscount`, req.body);

    new CREATED({
      message: "Successfully create discount",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getListProductsByDiscountCode = async (req, res, next) => {
    console.log(`[P]::getListProductsByDiscountCode`, req.body);

    new SuccessResponse({
      message: "Successfully get products by discount",
      metadata: await DiscountService.getListProductsByDiscountCode({
        code: req.params.code,
        shopId: req.user.userId,
        limit: req.query.limit || 10,
        page: req.query.page || 1,
      }),
    }).send(res);
  };

  getListDiscountCodesByShopId = async (req, res, next) => {
    console.log(`[P]::getListDiscountCodesByShopId`, req.body);

    new SuccessResponse({
      message: "Successfully get all discounts by shop",
      metadata: await DiscountService.getListDiscountCodesByShopId({
        shopId: req.user.userId,
        limit: req.query.limit || 10,
        page: req.query.page || 1,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    console.log(`[P]::getDiscountAmount`, req.body);

    new SuccessResponse({
      message: "Successfully get discount amount",
      metadata: await DiscountService.getDiscountAmount({
        code: req.body.code,
        userId: req.body.userId,
        shopId: req.body.shopId,
        products: req.body.products,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
