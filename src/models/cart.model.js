"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    /*
        [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            }
        ]
    */
    cart_count_product: { type: Number, required: true, default: 0 },
    cart_userId: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timeseries: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

cartSchema.pre("save", function (next) {
  this.cart_count_product = this.cart_products.length;
  next();
});

module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
