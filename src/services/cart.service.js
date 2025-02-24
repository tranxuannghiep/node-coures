"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { convertToObjectIdMongo } = require("../utils");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async upsertUserCartQuantity({ userId, product }) {
    const { quantity, productId } = product;

    if (quantity === 0)
      return CartService.deleteUserCart({ userId, productId });

    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = {
        new: true,
        upsert: false,
      };

    return await cart
      .findOneAndUpdate(query, updateSet, options)
      .then(async (updatedCart) => {
        if (updatedCart) return updatedCart;
        return await cart.findByIdAndUpdate(
          query,
          {
            $push: {
              cart_products: product,
            },
          },
          options
        );
      });
  }

  static async addToCart({ userId, product = {} }) {
    // check cart ton tai
    const userCart = await cart.findOne({
      cart_userId: userId,
    });

    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    // neu co gio hang nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      await userCart.save();
    }

    return await CartService.upsertUserCartQuantity({ userId, product });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: { productId },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

module.exports = CartService;
