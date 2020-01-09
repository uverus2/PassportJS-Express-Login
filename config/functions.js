const UserModel = require("../models/User");
const GoogleUser = require("../models/GoogleUser");
const bcrypt = require("bcryptjs");

const doesEmailExist = (newEmail) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: newEmail }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                if (data === null || data.length <= 0) {
                    // Nobody with that email if result is null and less than 0
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    });
};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error_msg", "Please Login first");
    res.redirect("/users/login");
};

const findUserByID = (modelName, id) => {
    let errorMessage = {
        errorDetails: {
            msg: "",
            status: ""
        }
    };
    return new Promise((resolve, reject) => {
        modelName.findById(id, (err, userData) => {
            if (err) {
                errorMessage.errorDetails.msg = err;
                errorMessage.errorDetails.status = 500;
                reject(errorMessage);
            } else {
                resolve(userData);
            }
        });
    });
};

const insertUser = (data) => {
    return new Promise((resolve, reject) => {
        let errorMessage = {
            errorDetails: {
                msg: "",
                status: ""
            }
        };
        // Hash Password
        //takes in salt characters, err, and our salt
        bcrypt.genSalt(10, (err, salt) => {
            // to hash it add the password and the salt, third param is callback with err param and our hashed password
            bcrypt.hash(data.password, salt, (err, hash) => {
                if (err) {
                    errorMessage.errorDetails.msg = err;
                    errorMessage.errorDetails.status = 500;
                    reject(errorMessage);
                } else {
                    // set password to hashed
                    data.password = hash;
                    UserModel.create(data, (err) => {
                        if (err) {
                            errorMessage.errorDetails.msg = err;
                            errorMessage.errorDetails.status = 500;
                            reject(errorMessage);
                        } else {
                            const successMessage = {
                                message: "User Added Succesfully",
                                status: 201
                            };
                            resolve(successMessage);
                        }
                    }); // end of insert
                } // end of else
            }); // end of bcrypt hash
        }); // end of bcrypt

    });
};

const userLogin = (email, done) => {

    return new Promise((resolve, reject) => {
        let errorMessage = {
            errorDetails: {
                msg: "",
                status: ""
            }
        };
        UserModel.findOne({ email: email }, (err, data) => {
            if (err) {
                errorMessage.errorDetails.msg = err;
                errorMessage.errorDetails.status = 500;
                reject(errorMessage);
            } else {
                if (!data) {
                    reject(done(null, false, { message: "That email is not registered" }));
                }
                resolve(data);
            }
        });
    });
};

const createUser = (username, googleId) => {
    return new Promise((resolve, reject) => {
        new GoogleUser({
            username: username,
            googleId: googleId
        }).save((err, userData) => {
            if (err) {
                reject(err);
            } else {
                resolve(userData);
            }
        });
    });
};

const findUser = (googleId) => {
    return new Promise((resolve, reject) => {
        GoogleUser.findOne({ googleId: googleId }, (err, currentUser) => {
            if (err) {
                reject(err);
            } else {
                if (currentUser) {
                    resolve(currentUser);
                } else {
                    resolve(false);
                }
            }
        });
    });
};

const errorCheck = (errors, status) => {
    let error = {
        error: {}
    };
    return new Promise((resolve, reject) => {
        if (!errors.isEmpty()) {
            error.status = status;
            error.error = errors.mapped();
            reject(error);
        } else {
            resolve();
        }
    });
};


module.exports = {
    errorCheck,
    doesEmailExist,
    insertUser,
    ensureAuthenticated,
    userLogin,
    createUser,
    findUser,
    findUserByID
}