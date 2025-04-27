"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Resource";
const COLLECTION_NAME = "Resources";

const resourceSchema = new Schema(
  {
    src_name: {
      // profile
      type: String,
      required: true,
    },
    src_slug: {
      //0001
      type: String,
      required: true,
    },
    src_description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, resourceSchema);
