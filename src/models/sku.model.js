"use strict";

const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Sku";
const COLLECTION_NAME = "skus";

const skuSchema = new Schema(
    {
        sku_id: {
            type: String,
            required: true,
            default: "",
            unique: true,
        }, // string "{spu_id}123456-{shop_id}"
        sku_tier_idx: {
            type: Array,
            default: [0], // [1,0], [1,1]
        },
        /*
            color: ["red", "green"] => [0, 1],
            size: ["M", "L"] => [0, 1]
            => red + M = [0,0]
            => red + L = [0,1]
            => green + M = [1,0]
            => green + L = [1,1]
        */
        sku_default: {
            type: Boolean,
            default: false,
        },

        sku_sort: {
            type: Number,
            default: 0,
        },

        sku_price: {
            type: String,
            required: true,
        },

        sku_stock: {
            type: Number,
            required: true,
        },

        product_id: {
            type: String,
            required: true,
        }, // ref to spu product

        isDraft: {
            type: Boolean,
            default: true,
            index: true,
            select: false,
        },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);



module.exports = model(DOCUMENT_NAME, skuSchema)
