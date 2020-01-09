const express = require("express");
const router = express.Router();
const functions = require("../config/functions");

const UserModel = require("../models/User");
const GoogleModel = require("../models/GoogleUser");

// Welcpme Page
router.get("/", (req, res) => {
    res.render("welcome");
});

// Dashboard
router.get("/dashboard", functions.ensureAuthenticated, async(req, res) => {
    try {
        const userDataFromId = await functions.findUserByID(UserModel, req.user);
        res.render("dashboard", {
            name: userDataFromId.name
        });
    } catch (e) {
        console.log(e);
    }
});

// Dashboard
router.get("/dashboardGoogle", functions.ensureAuthenticated, async(req, res) => {
    try {
        const userDataFromId = await functions.findUserByID(GoogleModel, req.user);
        res.render("dashboard", {
            name: userDataFromId.username
        });
    } catch (e) {
        console.log(e);
    }

});

module.exports = router;