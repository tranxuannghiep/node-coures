"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

// ORDER-001 : order successfully
// ORDER-002 : order failed
// PROMOTION-001: new PROMOTION
// SHOP-001: new product by user following

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    noti_senderId: { type: Types.ObjectId, ref: "Shop" },
    noti_receiverId: { type: Number },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  Notification: model(DOCUMENT_NAME, notificationSchema),
};
