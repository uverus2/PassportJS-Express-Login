const express = require("express");
const router = express.Router();
const functions = require("../config/functions");
const { check, body, validationResult } = require('express-validator');
const passwordValidator = require("password-validator");
const passport = require("passport");


const passwordValidation = new passwordValidator();
passwordValidation.has().uppercase().has().lowercase().has().digits().has().symbols().has().not().spaces();


// Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Register
router.get("/register", (req, res) => {
    res.render("register");
});


// Register Post
router.post("/register", [
    body("name").exists().withMessage("Name must be supplied").isAlpha().withMessage("Name must contain only letters").isLength({ min: 3 }).withMessage('Name must be at least three characters long'),
    body("email").isEmail().withMessage("Email must be in an email format e.g - name@email.co").custom(async email => {
        const doesEmailExist = await functions.doesEmailExist(email);
        try {
            if (!doesEmailExist) {
                return Promise.reject("Email is taken, pick another one");
            } else {
                return Promise.resolve();
            }
        } catch (err) {
            console.log(err);
        }
    }),
    body("password2").exists().withMessage("Conformation Password must be entered"),
    body("password").exists().withMessage("Password must be supplied").isLength({ min: 8 }).withMessage("Password must be longer than 8 characters, have an upper character, a low character, a symbol, a number and have no spaces").custom((pass, { req }) => {
        if (pass !== req.body.password2) {
            return Promise.reject("Passwords do not match");
        } else {
            return Promise.resolve();
        }
    }).custom(pass => {
        const isPasswordValid = passwordValidation.validate(pass);
        if (!isPasswordValid) {
            return Promise.reject("Password must contain one upper character, a low character, a symbol, a number and have no spaces");
        } else {
            return Promise.resolve();
        }
    })
], async(req, res) => {
    try {
        const errors = validationResult(req);
        await functions.errorCheck(errors, 400);
        // allows values with those keys to be stored in a unique variable
        const { name, email, password, password2 } = req.body;

        let userObject = {
            name: name,
            email: email,
            password: password
        }
        const userInserted = await functions.insertUser(userObject);
        req.flash("success_msg", "You are now registered and can log in");
        res.status(userInserted.status).redirect("/users/login");

    } catch (e) {
        const { name, email, password, password2 } = req.body;
        res.status(e.status).render("register", {
            e,
            name,
            email,
            password2,
            password
        })
    }
});

router.get("/google", passport.authenticate("google", {
    // what we want to retrive from the user's profile
    scope: ["profile"]
}));

// Login Handle
router.get("/google/redirect", (req, res, next) => {
    passport.authenticate("google", {
        successRedirect: "/dashboardGoogle",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
});

// Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login")
});

module.exports = router;