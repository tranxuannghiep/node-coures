"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "City";
const COLLECTION_NAME = "cities";

const userSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        sorder: {
            type: Number,
            required: true,
        },
        location: {
            type: [{
                type: {
                    type: String,
                    enum: ['Point']
                },
                coordinates: {
                    type: [Number]
                },
                correct: {
                    type: Boolean,
                    default: false
                }
            },
            ]
        },
        translation: {
            type: [{
                languageCode: {
                    type: String,
                    default: 'vi',
                    required: true
                },
                name: {
                    type: String,
                    index: 'text',
                    required: true
                },
                prefix: {
                    type: String
                }
            },
            ],
            required: true
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, userSchema);
