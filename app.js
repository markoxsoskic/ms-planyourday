require("dotenv").config();

const express = require("express");
const app = express();

const ejs = require("ejs");
const bodyParser = require("body-parser");

const homepage = require("./routes/homepage");
const loginPage = require("./routes/login-page");
const registerPage = require("./routes/register-page");
const plannerPage = require("./routes/planner-page");
const confirmationPage = require("./routes/confirm-token-page");
const logoutPage = require("./routes/logout-page");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes.

app.use(homepage);
app.use(loginPage);
app.use(registerPage);
app.use(plannerPage);
app.use(confirmationPage);
app.use(logoutPage);

app.listen(process.env.PORT);