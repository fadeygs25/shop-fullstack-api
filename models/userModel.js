const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  pic: {
    type: String,
    default: "https://res.cloudinary.com/dungnguyen25/image/upload/v1679318563/avatar-default/143086968_2856368904622192_1959732218791162458_n_edneps.png",
  },
  picId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  secret: {
    type: String,
  },
  number: {
    type: Number,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "super-admin"],
    default: "user",
  },
}, { timestamps: true });


// encrypting password before saving
userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10);
});



// verify password
userSchema.methods.comparePassword = async function (yourPassword) {
  return await bcrypt.compare(yourPassword, this.password);
}

// get the token
userSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
}


module.exports = mongoose.model("users", userSchema);