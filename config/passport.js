const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const keys = require("./keys");
const functions = require("../config/functions");
const GoogleStrategy = require("passport-google-oauth20");
const passport = require("passport");


passport.use(
    new GoogleStrategy({
        // option for Google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: "/users/google/redirect"

    }, async(accessToken, refreshToken, profile, done) => {
        // passport callback function
        // create a new User Module
        try {
            const findCurrentUser = await functions.findUser(profile.id);
            if (!findCurrentUser) {
                const creatingUser = await functions.createUser(profile.displayName, profile.id);
                console.log("User Has been created " + creatingUser);
                done(null, creatingUser);
            } else {
                console.log("User is regonized: " + findCurrentUser);
                done(null, findCurrentUser);
            }
        } catch (err) {
            console.log("The following error has occured " + err)
        }
    }),
);

passport.use(
    new LocalStrategy({ usernameField: "email" }, async(email, password, done) => {
        try {
            const user = await functions.userLogin(email, done);
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    process.nextTick(function() {
                        return done(null, user);
                    });
                    //return done(null, user)
                } else {
                    return done(null, false, { message: "Password Incorect" });
                }
            });
        } catch (e) {
            console.log(e);
        }
    })
); // end of passport use


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, id);
});