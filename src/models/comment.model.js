"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "comment";
const COLLECTION_NAME = "comments";

const commentSchema = new Schema(
  {
    comment_productId: {
      type: Types.ObjectId,
      ref: "Product",
    },
    comment_userId: {
      type: Number,
    },
    comment_content: {
      type: String,
      required: true,
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  Comment: model(DOCUMENT_NAME, commentSchema),
};
