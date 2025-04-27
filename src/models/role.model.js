"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// const grantList = [
//   {
//     role: "admin",
//     resource: "profile",
//     actions: ["update:any"],
//     attributes: "*",
//   },
//   {
//     role: "admin",
//     resource: "balance",
//     actions: ["update:any"],
//     attributes: "* !amount",
//   },

//   {
//     role: "shop",
//     resource: "profile",
//     actions: ["update:own"],
//     attributes: "*",
//   },
//   {
//     role: "shop",
//     resource: "balance",
//     actions: ["update:own"],
//     attributes: "* !amount",
//   },

//   {
//     role: "user",
//     resource: "profile",
//     actions: ["update:own"],
//     attributes: "*",
//   },
//   {
//     role: "user",
//     resource: "balance",
//     actions: ["read:own"],
//     attributes: "*",
//   },
// ];

const roleSchema = new Schema(
  {
    role_name: {
      type: String,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    role_slug: {
      type: String, //0000777
      required: true,
    },
    role_status: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    role_description: {
      type: String,
      default: "",
    },
    role_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [
          {
            type: String,
            required: true,
          },
        ],
        attributes: {
          type: String,
          default: "*",
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, roleSchema);
