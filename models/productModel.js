const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const productSchema = new mongoose.Schema({

    nameProduct: {
        type: String,
    },

    price: {
        type: Number,
    },

    pic: {
        type: String,
    },

    picId: {
        type: String,
    },

    categoryId: {
        type: String,
    },


}, { timestamps: true });






module.exports = mongoose.model("Product", productSchema);