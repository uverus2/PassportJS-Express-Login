const express = require("express");
const mainRoutes = require("./routes/index");
const userRoutes = require("./routes/users");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();
const passportSetUp = require("./config/passport");
const passport = require("passport");

// Static Files
app.use(express.static(__dirname + '/src'));


// DB config
const db = require("./config/keys").MongoURL;

//Connect to mongo 
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log("DB Connected")).catch(err => console.log(err));

app.use(require('cookie-parser')());

// BodyParser
//Allows data from forms using req.body
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middlware
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// EJS Views
//layout allows to create a layout for a page
app.use(expressLayouts);
app.set("view engine", "ejs");

// Use Routes
app.use("/", mainRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));