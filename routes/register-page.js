const express = require("express");
const router = new express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbConnection = require("../db/database");
const User = require("../models/user");
const Token = require("../models/token");
const emailVerification = require("../utils/send-email");

dbConnection();

router.get("/register", (req, res) => {

    let year = new Date().getFullYear();
    res.render("register-page", { year: year });
})

router.post("/register", (req, res) => {

    let year = new Date().getFullYear();

    let fName = req.body.fName;
    let fNameFirstLetter = fName.slice(0, 1);
    let fNameOtherLetters = fName.slice(1, fName.length);
    fName = fNameFirstLetter.toUpperCase() + fNameOtherLetters.toLowerCase();

    let city = req.body.city;
    let cityFirstLetter = city.slice(0, 1);
    let cityOtherLetters = city.slice(1, city.length);
    city = cityFirstLetter.toUpperCase() + cityOtherLetters.toLowerCase();

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

        let year = new Date().getFullYear();

        if (err) console.log(err);

        let newUser = new User({
            fName: fName,
            lName: req.body.lName,
            email: req.body.email,
            password: hash,
            city: city
        })

        const token = new Token({
            userId: newUser._id,
            token: crypto.randomBytes(16).toString("hex")
        });

        const link = `https://ms-planyourday.onrender.com/user/confirm/${token.token}`;

        User.findOne({ email: newUser.email })
            .then((found) => {
                if (found) {
                    res.render("register-error-page", { year: year });
                } else {
                    newUser.save()
                        .then(() => {
                            token.save();
                            console.log(token);
                            emailVerification(newUser.email, link);
                            res.status(200).render("verification-alert-page", { year: year });
                        }).catch((err) => {
                            console.log(err)
                        });
                }
            })
    });
})

module.exports = router;