const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
});

module.exports = mongoose.model("User", userSchema);