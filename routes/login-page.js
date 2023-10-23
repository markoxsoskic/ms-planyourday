const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbConnection = require("../db/database");
const User = require("../models/user");

dbConnection();

router.get("/login", (req, res) => {

    let year = new Date().getFullYear();
    res.render("login-page", { year: year });
})

router.post("/login", (req, res) => {

    let year = new Date().getFullYear();

    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email: email })
        .then((found) => {
            if (found) {
                if (found.verified) {
                    bcrypt.compare(password, found.password, (err, result) => {
                        if (result === true) {
                            User.updateOne({ _id: found._id }, { $set: { logged: true } })
                                .then(() => {
                                    res.redirect(`/pages/planyourday/${found._id}`);
                                }).catch((err) => {
                                    console.log(err);
                                    res.send("An error has occured.");
                                })
                        } else {
                            res.render("login-error-page", { year: year });
                        }
                    });
                } else {
                    res.render("unverified-page", { year: year });
                }
            } else {
                res.render("invalid-page", { year: year });
            }
        }).catch((err) => {
            console.log(err);
        });
});

module.exports = router;