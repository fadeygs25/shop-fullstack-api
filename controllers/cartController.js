const Cart = require("../models/cartModel");
const colors = require('colors');



exports.createCart = async (req, res, next) => {
    try {
        const { productId, price } = req.body;
        const cartExist = await Cart.findOne({ productId: req.body.productId, userId: req.user.id });
        if (cartExist) {
            return res.status(400).json([{ message: 'roduct is available', type: 'error' }]);
        }

        const newCart = new Cart({
            userId: req.user.id,
            productId,
            price,
        });


        await newCart.save();
        if (!newCart) return res.status(400).json([{ message: 'Cart not created', type: 'error' }]);
        if (newCart) return res.status(400).json([{ message: 'Cart created', type: 'success' }]);

        res.send(newCart)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.updateCart = async (req, res, next) => {
    try {
        const { price, quantity } = req.body;
        const cart = await Cart.findOneAndUpdate(
            { _id: req.params.id },
            { price, quantity },
            { new: true }
        );
        res.json(cart);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

exports.displayCart = async (req, res, next) => {


    try {
        const carts = await Cart.find();
        res.status(201).json({
            success: true,
            carts
        })

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

exports.mineCart = async (req, res, next) => {


    try {
        const carts = await Cart.find({ userId: req.user._id });
        res.json(carts)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.countCart = async (req, res, next) => {


    try {
        const countCart = await Cart.countDocuments({ userId: req.params.id });
        res.status(201).json({
            success: true,
            count: countCart
        })

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.countCarts = async (req, res, next) => {


    try {
        const countCart = await Cart.countDocuments();
        res.status(201).json({
            success: true,
            count: countCart
        })

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.findProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: "Product not found!" });
        }
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

// Update product image in Cloudinary and product data in MongoDB.
exports.updateOrder = async (req, res, next) => {
    try {
        //current product
        const currentProduct = await Product.findById(req.params.id);

        //build the data object
        const data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category
        }

        //modify image conditionnally
        if (req.body.image !== '') {
            const ImgId = currentProduct.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: "products",
                width: 1000,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
        }

        const productUpdate = await Product.findOneAndUpdate(req.params.id, data, { new: true })

        res.status(200).json({
            success: true,
            productUpdate
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}



// delete product and product image in cloudinary
exports.deleteCart = async (req, res, next) => {


    try {
        const cart = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({
            cartId: req.params.id,
            toasts: [{ message: 'Blog deleted', type: 'success' }]
        });
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

// delete product and product image in cloudinary
exports.deleteMineCarts = async (req, res, next) => {


    try {
        const cart = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({
            cartId: req.params.id,
            toasts: [{ message: 'Blog deleted', type: 'success' }]
        });
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

// delete product and product image in cloudinary
exports.deleteUserCarts = async (req, res, next) => {


    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success: true,
            message: " cart deleted",
        })

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

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}




