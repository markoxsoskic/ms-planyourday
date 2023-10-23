const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    verified: { type: Boolean, default: false },
    logged: { type: Boolean, default: false }
})

const User = new mongoose.model("PYD-User", userSchema);

module.exports = User;