const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    rating: {
        type: Number,
        min: 0, // Minimum rating
        max: 5, // Maximum rating
        default: 0, // Default rating if not provided
    },
    // sku: {
    //     type: String,
    //     required: true,
    //     unique: true, // Ensure that SKU is unique
    // },
    image: {
        type: [String],
        required: true,
    },
    images: [{
        type: String, // Array of URLs or paths for additional images
    }],
    
    // tracking creator
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // }
    
}, {
    timestamps: true,
});


module.exports = mongoose.model("Product", productSchema);