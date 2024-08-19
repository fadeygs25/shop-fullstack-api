const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer")
const cloudinary = require('../config/cloudinary');
const jwt = require("jsonwebtoken");
const colors = require('colors');


exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        let toasts = [];

        if (!username) toasts.push({ message: 'User name is required', type: 'error' });

        if (!password) toasts.push({ message: 'A valid Password is required', type: 'error' });
        if (password && (password.length < 8 || password.length > 20)) toasts.push({ message: 'Password must be at least 6 - 12 characters long', type: 'error' });

        if (!email) toasts.push({ message: 'A valid Email is required', type: 'error' });

        if (toasts.length > 0) return res.status(400).json(toasts);


        const checkUser = await User.findOne({ email, username });

        if (checkUser) {
            return res.status(400).json([{ message: 'User already exists', type: 'error' }]);
        }

        const newUser = new User(req.body);
        await newUser.save();

        generateToken(newUser._id, 200, res);

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

exports.google = async (req, res, next) => {
    try {
        const { uid, displayName, email, photoURL, stsTokenManager } = req.body;
        const user = await User.findOne({ googleId: uid, secret: stsTokenManager.accessToken })
        console.log(req.body)
        if (user) {
            let update = await User.findOneAndUpdate(
                { _id: user._id },
                {
                    fullName: displayName,
                    email: email,
                    pic: photoURL,
                    secret: stsTokenManager.accessToken,
                },
                { new: true }
            )
            await generateToken(update, 200, res);
        }
        if (!user) {
            const newUser = new User({
                googleId: uid,
                username: "",
                number: "0",
                address: "Nothing",
                fullName: displayName,
                email: email,
                pic: photoURL,
                secret: stsTokenManager.accessToken,
            });
            newUser.save()
            generateToken(newUser, 200, res);
        }
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}

exports.signin = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        let toasts = [];
        if (!password) toasts.push({ message: 'A valid Password is required', type: 'error' });
        if (password && (password.length < 8 || password.length > 12)) toasts.push({ message: 'Password must be at least 6 - 12 characters long', type: 'error' });

        if (!email || !validatedEmail(email)) toasts.push({ message: 'A valid Email is required', type: 'error' });

        if (toasts.length > 0) return res.status(400).json(toasts);

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json([{ message: 'User does not exist', type: 'error' }]);


        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json([{ message: 'Invalid credentials', type: 'error' }]);

        const payload = {
            user: {
                id: user._id
            }
        }

        generateToken(user, 200, res);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.forgotPass = async (req, res, next) => {
    const { email, OTP } = req.body;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    })
    const mailOption = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "KODING 101 PASSWORD RECOVERY",
        html: `<!DOCTYPE html>
  <html lang="en" >
  <head>
    <meta charset="UTF-8">
    <title>CodePen - OTP Email Template</title>
    
  
  </head>
  <body>
  <!-- partial:index.partial.html -->
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
      <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Koding 101 Inc</p>
        <p>1600 Amphitheatre Parkway</p>
        <p>California</p>
      </div>
    </div>
  </div>
  <!-- partial -->
    
  </body>
  </html>`,
    };

    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log(info.response);
        }
    })
}

exports.updateUser = async (req, res, next) => {

    try {
        const user = await User.findByIdAndUpdate(req.params.id);
        //if user exists
        const form = req.body;
        console.log(req.body)
        if (user) {
            //if you want to update username or email
            user.username = form.username || user.username;
            user.fullName = form.fullName || user.fullName;
            user.email = form.email || user.email;
            user.number = form.number || user.number;
            user.address = form.address || user.address;
            user.role = form.role || user.role;

            if (req.body.image) {
                const ImgId = user.picId;
                if (ImgId) {
                    await cloudinary.uploader.destroy(ImgId);
                }

                const newImage = await cloudinary.uploader.upload(req.body.image, {
                    folder: "users",
                    width: 1000,
                    crop: "scale"
                });

                user.pic = newImage.secure_url;
                user.picId = newImage.public_id
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(401).send({ message: 'User not Found!' });
        }
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }
}






//LOG OUT USER
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}



// USESR PROFILE 
exports.userProfile = async (req, res, next) => {
    try {

        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}




exports.allUsers = async (req, res, next) => {

    try {
        const users = await User.find();
        res.json(users)
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

// Count User 
exports.countUsers = async (req, res, next) => {
    try {

        const countUsers = await User.countDocuments();
        res.json(countUsers)
    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

exports.findUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);
        res.json(user)

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

// delete User and User image in cloudinary
exports.deleteUser = async (req, res, next) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({
            userId: req.params.id,
            toasts: [{ message: 'User deleted', type: 'success' }]
        })

    } catch (err) {
        console.error(`ERROR: ${err.message}`.bgRed.underline.bold);
        res.status(500).send('Server Error');
    }

}

function validatedEmail(email) {
    const regex = /\S+@\S+\.\S+/;

    //validemail@mail.com returns true whereas validemail.mail.com returns false
    return regex.test(email);
}


const generateToken = async (user, statusCode, res) => {


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 3600 // 24 hours
    });

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.EXPIRE_TOKEN)
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json(token)
}


