"use strict";

const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Spu";
const COLLECTION_NAME = "spus";

const productSchema = new Schema(
    {
        product_id: {
            type: String,
            required: true,
            default: "",
        },
        product_name: {
            type: String,
            required: true,
        },
        product_thumb: {
            type: String,
            required: true,
        },
        product_description: String,
        product_slug: String,
        product_price: {
            type: Number,
            required: true,
        },
        product_category: {
            type: Array,
            required: true,
            default: [],
        },
        product_quantity: {
            type: Number,
            required: true,
        },

        product_shop: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
        },
        product_attributes: {
            type: Schema.Types.Mixed,
            required: true,
        },

        /*
          {
            attribute_id: 12345, // style ao [han quoc, thoi trang, mua he]
            attribute_values: [
                {
                    value_id: 12345,
                    value_name: "han quoc",
                }
            ]   
          }
        */

        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be less 5.0"],
            set: (val) => Math.round(val * 10) / 10,
        },
        product_variations: {
            type: Array,
            default: [],
        },

        /*
            
            tier_variations:[
                {
                    images:[],
                    name: "color",
                    options: ["red","green"]
                },
                {
                    images:[],
                    name: "size",
                    options: ["M","L","XL"]
                }
            ]
            
        */

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

//create index for name, description
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before .save() and .create()
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});


module.exports = model(DOCUMENT_NAME, productSchema)
