const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Cart = require("../models/cartModel");
const Rating = require("../models/ratingModel");
const data = require("../data");


exports.createSeed = async (req, res, next) => {
    //seed for category
    await Cart.remove({});
    const createdCart = await Cart.insertMany(data.carts);


    //seed for category
    await Category.remove({});
    const createdCategory = await Category.insertMany(data.categories);


    //seed for products
    await Product.remove({});
    const createdProduct = await Product.insertMany(data.products);

    //seed for products
    await Rating.remove({});
    const createdRating = await Rating.insertMany(data.ratings);


    //seed for users
    await User.remove({});
    const createdUser = await User.insertMany(data.users);






    res.send({ createdUser, createdProduct, createdCategory, createdCart });
}

