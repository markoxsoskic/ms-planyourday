const express = require("express");
const router = new express.Router();

router.get("/", (req, res) => {

    let year = new Date().getFullYear();
    res.render("homepage", { year: year });
})

module.exports = router;