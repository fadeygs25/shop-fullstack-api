const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const cloudinary = require('../config/cloudinary');
const colors = require('colors');



exports.createProduct = async (req, res, next) => {

    try {
        const { nameProduct, price, image, categoryId } = req.body;
        const result = await cloudinary.uploader.upload(image, {
            folder: "products",
            width: 1000,
            crop: "scale"
        })
        const product = await Product.create({
            nameProduct,
            price,
            pic: result.secure_url,
            picId: result.public_id,
            categoryId
        });
        res.json(product)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.displayProduct = async (req, res, next) => {


    try {
        const products = await Product.find();
        res.json(products)
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.countProducts = async (req, res, next) => {
    try {
        const countProducts = await Product.countDocuments();
        res.json(countProducts);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.findProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}


exports.searchProduct = async (req, res, next) => {

    try {
        const products = await Product.find({ name: req.params.id });
        res.status(201).json({
            success: true,
            products
        })
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

// Update product image in Cloudinary and product data in MongoDB.
exports.updateProduct = async (req, res, next) => {
    try {
        //current product
        const product = await Product.findByIdAndUpdate(req.params.id);
        const form = req.body
        //build the data object
        console.log(req.body)

        if (product) {
            //if you want to update usernamse or email
            product.nameProduct = form.nameProduct || product.nameProduct;
            product.description = form.description || product.description;
            product.price = form.price || product.price;
            product.categoryId = form.categoryId || product.categoryId;

            if (req.body.image) {
                const ImgId = product.picId;
                if (ImgId) {
                    await cloudinary.uploader.destroy(ImgId);
                }

                const newImage = await cloudinary.uploader.upload(req.body.image, {
                    folder: "products",
                    width: 1000,
                    crop: "scale"
                });

                product.pic = newImage.secure_url;
                product.picId = newImage.public_id
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(401).send({ message: 'User not Found!' });
        }

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}



// delete product and product image in cloudinary
exports.deleteProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id);
        //retrieve current image ID
        const imgId = product.imageId;
        if (imgId) {
            await cloudinary.uploader.destroy(imgId);
        }

        const rmProduct = await Product.findByIdAndDelete(req.params.id);

        res.json({
            productId: req.params.id,
            toasts: [{ message: 'Product deleted', type: 'success' }]
        });

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}





// display category
exports.productCategory = async (req, res, next) => {

    try {
        const cat = await Product.find().populate('category', 'name').distinct('category');
        res.status(201).json({
            success: true,
            cat
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}




