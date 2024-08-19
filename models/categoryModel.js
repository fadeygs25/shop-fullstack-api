const mongoose = require('mongoose');



const categorySchema = new mongoose.Schema({

    nameCategory: {
        type: String,
        required: [true, 'Please add a category Name'],

    },



}, { timestamps: true });






module.exports = mongoose.model("Category", categorySchema);