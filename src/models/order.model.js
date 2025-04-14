"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, required: true, default: {} },
    /*
        order_checkout:{
            totalPrice,
            totalCheckout,
            totalDiscount,
            feeShip,
        }
    */
    order_shipping: { type: Object, required: true, default: {} },
    /*
        street
        district
        city
        country
    */

    order_payment: { type: Object, required: true, default: {} },
    order_products: { type: Array, required: true, default: [] },
    order_trackingNumber: { type: String, default: "#000114042025" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "canceled"],
      default: "pending",
    },
  },
  {
    collection: COLLECTION_NAME,
    timeseries: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = {
  order: model(DOCUMENT_NAME, orderSchema),
};
