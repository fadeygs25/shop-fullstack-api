const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const ratingSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Please add a product id'],

  },
  userId: {
    type: String,
    required: [true, 'Please add a user id'],

  },
  message: {
    type: String,
    required: [true, 'Please add a message'],

  },
  start: {
    type: String,
    required: [true, 'Please add a start'],

  },
  date: {
    type: String,
    required: [true, 'Please add a date'],

  },
}, { timestamps: true });

// get the token
ratingSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
}

module.exports = mongoose.model("Rating", ratingSchema);