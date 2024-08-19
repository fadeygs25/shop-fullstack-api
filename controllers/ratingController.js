const Rating = require("../models/ratingModel");
const colors = require('colors');



exports.createRating = async (req, res, next) => {
    try {
        const { productId, message, start, date } = req.body;
        const newRating = new Rating({
            productId,
            userId: req.user.id,
            message,
            start,
            date
        });
        await newRating.save();
        res.json(newRating)
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

//get all ratings
exports.getRatings = async (req, res, next) => {

    try {
        const ratings = await Rating.find();
        res.json(ratings)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

//get all ratings
exports.getRatingByProduct = async (req, res, next) => {

    try {
        const ratings = await Rating.find({ productId: req.params.id });
        res.json(ratings)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.productRating = async (req, res, next) => {
    try {
        const ratings = await Rating.find();
        res.json(ratings);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

exports.countRatings = async (req, res, next) => {
    try {
        const countRatings = await Rating.countDocuments();
        res.json(countRatings);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

// delete product and product image in cloudinary
exports.deleteRating = async (req, res, next) => {
    try {
        const rmRatings = await Rating.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success: true,
            message: "Rating deleted",
        })
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}