let connection = require("../db");
const bcrypt = require('bcrypt');
let User = require('../models/UserModel');
let ResetCode = require('../models/ResetCodeModel');
let passport = require("passport");
var crypto = require('crypto');
let mailController = require("./MailController");
const {
    cp
} = require("fs");


exports.postLogin = function (req, res, next) {


    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);



};

exports.sendPasswordResetCode = function (req, res, next) {
    //Create Security Key for Password Reset
    console.log(req);
    let email = req.body.email
    //let email = "test@test.be"
    var generatedResetCode = Math.floor(Math.random() * 9999999);
    console.log(generatedResetCode);
    let ResetCodeModel = new ResetCode(email, generatedResetCode, true);
    console.log(ResetCodeModel);
    connection.query("INSERT INTO resetcodes set ?", ResetCodeModel, function (error, resultSQL) {
        if (error) {
            console.log(error)
            res.status(400).json({
                'message': error
            });
        } else {
            mailController.sendResetPassword(generatedResetCode, email);
            res.status(200);
        }
    });
    //res.redirect("back");
};

exports.checkForPasswordReset = function (req, res, next) {
    //Check if code is correct and update password
    let givenEmail = req.body.email
    let givenCode = req.body.code;
    let givenNewPassword = req.body.newPassword;

    //Check if password is correct
    if (givenNewPassword.length < 6) {
        req.flash('error_msg', "Password atleast 6 characters, try again with the same code");
        res.redirect("back");
    } else {
        //Get resetcodes from databases with given email , given code and it must be ACTIVE
        connection.query("SELECT * from resetcodes where email = ? AND code = ? AND isActive = true", [givenEmail, givenCode], function (error, resultSQL) {
            if (error) {
                console.log(error);
                req.flash('error_msg', "Incorrect code.")
            } else {
                let allCodes = resultSQL;
                let codeIsCorrect = false;
                console.log(allCodes);

                allCodes.forEach(element => {
                    //Check for each element if code is correct 
                    if (element.code == givenCode) {
                        codeIsCorrect = true;
                    }
                });

                if (codeIsCorrect) {
                    //HASH USER PASSWORD
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(givenNewPassword, salt, (err, hashedPassword) => {
                            if (err) throw err;
                            //UPDATE RESETCODE AND DESACTIVATE IT
                            connection.query("UPDATE resetcodes set `isActive` = false where code = ?", givenCode, function (error, resultSQL) {
                                if (error) {
                                    req.flash('error_msg', "Incorrect code.")
                                } else {
                                    //UPDATE USER PASSWORD
                                    connection.query("UPDATE users set `password`= ? where email = ?", [hashedPassword, givenEmail], function (error, resultSQL) {
                                        if (error) {
                                            req.flash('error_msg', "Incorrect code.")
                                        } else {
                                            req.flash('success_msg', "Password changed !")
                                        }
                                        res.redirect("back");
                                    });
                                }
                            });


                        })
                    );
                } else {
                    req.flash('error_msg', "Incorrect code.");
                    res.redirect("back");

                }
            }
        });

    }
};



exports.postRegister = function (req, res) {
    let errorList = [];
    try {
        let {
            lastName,
            firstName,
            email,
            password,
            c_password,
            adress,
            isCompany,
            companyNumber,
            birthDate,
            bankNumber,
        } = req.body;

        validateInformation(req.body)

    } catch (err) {
        console.error(err.message);
    }

    function encryptPasswordThenNewUserToDb(userObject) {
        //        console.log(userObject);
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(userObject.password, salt, (err, hash) => {
                if (err) throw err;
                //save pass to hash
                password = hash;
                userObject.password = password;
                newUserToDb(userObject);
            })
        );
    }

    async function newUserToDb(userObject) {


        /* IMPORTANT */
        let profileImgUrl = "https://firebasestorage.googleapis.com/v0/b/emotify-final-work.appspot.com/o/profile.png?alt=media&token=ac246af9-d457-4ebc-9cab-f0c64a4be283";
        // = Defaultprofile picture url;
        let subscriptionExpirationDate = new Date(Date.now());
        subscriptionExpirationDate.setDate(subscriptionExpirationDate.getDate() + 10);
        // = GET 10 FREE DAYS
        /* IMPORTANT */

        let userId = userObject.userId;
        let lastName = userObject.lastName;
        let firstName = userObject.firstName;
        let email = userObject.email;
        let password = userObject.password;
        let isCompany = parseInt(userObject.isCompany);
        let adress = userObject.adress;
        let companyNumber = userObject.companyNumber;
        let birthDate = userObject.birthDate;
        let bankNumber = userObject.bankNumber;
        let actualWallet = 0.0;

        //Prepare data types for company/viewer
        if (isCompany) {
            console.log("User is Company !");
            birthDate = undefined;
            bankNumber = undefined;
        } else {
            console.log("User is Viewer !");
            companyNumber = undefined;
            adress = undefined;
        }

        let userModel = new User(userId, profileImgUrl, lastName, firstName, isCompany, email, password, adress, birthDate, companyNumber, subscriptionExpirationDate, bankNumber, actualWallet) // Create User and send it to database
        connection.query("INSERT INTO users set ?", userModel, function (error, resultSQL) {
            if (error) {
                console.log(error)
                res.status(400).json({
                    'message': error
                });
                res.status(403).json({
                    'message': error
                });
                res.status(500).json({
                    'message': error
                });
            } else {
                res.status(200).redirect('back');
                //console.log(req.isAuthenticated());
            }
        });

    }

    async function validateInformation(userObject) {

        let isCompany = parseInt(userObject.isCompany);
        //If Email is correct, check if it exists in database
        connection.query("SELECT email from users where email = ? ", userObject.email, function (error, resultSQL) {
            if (error) {
                console.log("error!");
                // console.log(error);
                //errorList.push("E-mail already exist");
            } else {
                if (resultSQL[0]) {
                    if (resultSQL[0].email == userObject.email) {
                        errorList.push("E-mail already exist");
                    }
                }
            }
            //Check if isCompany is a boolean
            if (isCompany != 0 && isCompany != 1 && isCompany != true && isCompany != false) {
                errorList.push(" FATAL ERROR, PLEASE REFRESH THIS PAGE.");
            }

            //check if E-mail is filled
            if (!userObject.email) {
                errorList.push(" Please fill E-mail");
            } else {

                //check if e-mail is correct
                if (!userObject.email.includes("@") && !userObject.email.includes(".")) {
                    errorList.push("Incorrect e-mail");
                }
            }

            //check if Password is filled
            if (!userObject.password) {
                errorList.push(" Please fill Password");
            } else {
                //check if Password have more than 6 characters
                if (userObject.password.length < 6) {
                    errorList.push(" Password atleast 6 characters");
                }
            }
            //check if confirm Password is filled
            if (!userObject.c_password) {
                errorList.push(" Please fill Confirm Password");
            }

            //check if Adress & Company number are filled when user selected COMPANY
            if (isCompany) {
                if (!userObject.adress || !userObject.companyNumber) {
                    errorList.push(" Please fill Adress & Company Number");
                }
            } else {
                //check if birthDate & BankNumber are filled when user selected VIEWER
                if (!userObject.birthDate || !userObject.bankNumber) {
                    errorList.push(" Please fill BirthDate & BankNumber");
                }
            }

            //check if password match
            if (userObject.password !== userObject.c_password) {
                errorList.push(" Passwords don't match");
            }




            if (errorList.length > 0) {
                //Throw error
                console.log(" Errors, not passed!");
                req.flash('error_msg', errorList)
                res.redirect("/register")
                console.log(errorList);

                console.log("false");
                res.status(500);

            } else {
                encryptPasswordThenNewUserToDb(userObject);
            }

        });
    }
};

exports.getAllViewers = function (req, res) {
    //get All viewers for Admin reasons --> To pay the viewers via bank and then reset their wallet.
    return new Promise((resolve, reject) => {

        connection.query("SELECT * from users where isCompany = 0", function (error, resultSQL) {
            if (error) {
                return reject(error);
            } else {
                return resolve(resultSQL);
            }

        });
    });

};