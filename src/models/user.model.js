"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    user_slug: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
      default: "",
    },
    user_password: {
      type: String,
      required: true,
    },
    user_salt: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    user_phone: {
      type: String,
      required: true,
    },
    user_sex: {
      type: String,
      default: "",
    },
    user_avatar: {
      type: String,
      default: "",
    },
    user_date_of_birth: {
      type: Date,
      default: null,
    },
    user_role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    user_status: {
      type: String,
      enum: ["active", "pending", "block"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, userSchema);
