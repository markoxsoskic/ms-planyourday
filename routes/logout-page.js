const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbConnection = require("../db/database");
const User = require("../models/user");

dbConnection();

router.get("/pages/:id/logout", (req, res) => {

    let year = new Date().getFullYear();

    User.findOne({ _id: req.params.id })
        .then((found) => {
            User.updateOne({ _id: found._id }, { $set: { logged: false } })
                .then(() => {
                    res.render("logout-page", { year: year });
                }).catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        })
})

module.exports = router;