const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            maxLength: 50
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            maxLength: 60
        },

        short_description: {
            type: String,
            maxLength: 200
        },

        long_description: {
            type: String,
            default: ""
        },

        original_price: {
            type: Number,
            required: true
        },

        discount_percentage: {
            type: Number,
            default: 5
        },

        final_price: {
            type: Number
        },

        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories"
        },

        brand_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "brand"
        },

        color_ids: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color"
            }
        ],

        thumbnail: {
            type: String,
            default: null
        },

        images: [
            {
                type: String
            },
        ],

        stock: {
            type: Boolean,
            default: true
        },

        topSelling: {
            type: Boolean,
            default: false
        },
        
        status: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

const productModel = mongoose.model("product", productSchema);
module.exports = productModel;