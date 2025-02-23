"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", //percentage
    },
    discount_value: {
      type: Number, //10.000 - 10%
      required: true,
    },
    discount_max_value: {
      // so tien toi da
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // so luong discount duoc ap dung
      type: Number,
      required: true,
    },
    discount_uses_count: {
      // so luong discount da su dung
      type: Number,
      required: true,
    },
    discount_users_used: {
      // ai da su dung
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      // so luong discount duoc su dung cho moi user
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};
