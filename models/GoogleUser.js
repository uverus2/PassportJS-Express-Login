const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema
const googleSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
        required: true
    }
});

// Create a Model
const GoogleUser = mongoose.model("GoogleUser", googleSchema, "googleUsers");

// Export it
module.exports = GoogleUser;