const express = require("express");
const Router = express.Router();
const passport = require("passport");

Router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

Router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL_DEV + "/login",
    session: false,
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    const jwt = req.user.jwtGenerateToken();
    res.cookie('token', jwt);
    res.redirect(clientUrl);
  },
);



module.exports = Router;
