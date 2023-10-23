const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbConnection = require("../db/database");
const User = require("../models/user");
const Token = require("../models/token");

dbConnection();

router.get("/user/confirm/:token", async (req, res) => {

    let year = new Date().getFullYear();

    try {
        Token.findOne({ token: req.params.token })
            .then((found) => {
                User.findOneAndUpdate({ _id: found.userId }, { $set: { verified: true } })
                    .then(() => {
                        Token.findByIdAndRemove(found.userId);
                        res.status(200).render("verification-success-page", { year: year });
                    }).catch((err) => {
                        console.log(err);
                    });
            })
    } catch (error) {
        res.status(400).send("An error occured.");
    }
})

module.exports = router;