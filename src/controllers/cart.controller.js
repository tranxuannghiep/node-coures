"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    console.log(`[P]::addToCart`, req.body);

    new CREATED({
      message: "Successfully addToCart",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  upsertUserCartQuantity = async (req, res, next) => {
    console.log(`[P]::upsertUserCartQuantity`, req.body);

    new SuccessResponse({
      message: "Successfully upsertUserCartQuantity",
      metadata: await CartService.upsertUserCartQuantity(req.body),
    }).send(res);
  };

  deleteUserCart = async (req, res, next) => {
    console.log(`[P]::deleteUserCart`, req.body);

    new SuccessResponse({
      message: "Successfully deleteUserCart",
      metadata: await CartService.deleteUserCart({
        userId: req.body.userId,
        productId: req.body.productId,
      }),
    }).send(res);
  };

  getListUserCart = async (req, res, next) => {
    console.log(`[P]::getListUserCart`, req.body);

    new SuccessResponse({
      message: "Successfully getListUserCart",
      metadata: await CartService.getListUserCart({
        userId: req.query.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
