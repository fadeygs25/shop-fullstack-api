const express = require("express");
const session = require("express-session");
const path = require("path");
const logger = require("morgan");
require('dotenv').config();
const dotenv = require("dotenv");
const { Connect } = require("./config/connect");
const cors = require("cors");
const passport = require("passport");
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//IMPORT ROUTES
const categoryRoutes = require('./routes/categoryRoute');
const seedRoutes = require('./routes/seedRoute');
const productRoutes = require('./routes/productRoute');
const googleAuth = require("./routes/googleAuth");
const userRoutes = require('./routes/userRoute');
const orderRoutes = require('./routes/orderRoute');
const cartRoutes = require('./routes/cartRoute');
const ratingRoutes = require('./routes/ratingRoute');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '100mb',
  extended: true
}));
app.use(cookieParser());
app.use(cors());

//express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// get api palpal
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});


//dotenv
dotenv.config();
Connect();

//morgan
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
require("./auth/google-auth")(passport);
app.use(express.static(path.join(__dirname, "public")));


// ROUTES MIDDLEWARE
app.use("/", googleAuth);
app.use("/api/category", categoryRoutes)
app.use("/api", seedRoutes)
app.use("/api/product", productRoutes)
app.use("/api/user", userRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/rating", ratingRoutes)

module.exports = app;
