let connection = require("../db");
let User = require('../models/UserModel');


exports.newUser = function (req, res) {
    console.log("test");
    console.log(req);
    let userId = req.body.userId;
    let profileImgUrl = req.body.profileImgUrl;
    let lastName = req.body.lastName;
    let firstName = req.body.firstName;
    let email = req.body.email;
    let password = req.body.password;
    let isCompany = req.body.isCompany;
    let adress = req.body.adress;
    let companyNumber = req.body.companyNumber;
    let subscriptionExpirationDate = req.body.subscriptionExpirationDate;
    let birthDate = req.body.birthDate;
    let bankNumber = req.body.bankNumber;
    let actualWallet = req.body.actualWallet;

    let userModel = new User(userId, profileImgUrl, lastName, firstName, isCompany, email, password, adress, birthDate, companyNumber, subscriptionExpirationDate, bankNumber, actualWallet) // Create User and send it to database
    connection.query("INSERT INTO users set ?", userModel, function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {
            res.status(200).json({
                'message': 'User successfully created'
            })

        }
    });
}

exports.updateUser = function (req, res) {
    let userId = req.body.userId;
    let profileImgUrl = req.body.profileImgUrl;
    let lastName = req.body.lastName;
    let firstName = req.body.firstName;
    let email = req.body.email;
    let password = req.body.password;
    let adress = req.body.adress;
    let isCompany = req.body.isCompany;
    let companyNumber = req.body.companyNumber;
    let subscriptionExpirationDate = req.body.subscriptionExpirationDate;
    let birthDate = req.body.birthDate;
    let bankNumber = req.body.bankNumber;
    let actualWallet = req.body.actualWallet;

    let userModel = new User(userId, profileImgUrl, lastName, firstName, isCompany, email, password, adress, birthDate, companyNumber, subscriptionExpirationDate, bankNumber, actualWallet) // Create User and send it to database
    connection.query("UPDATE users set ? where userId = ?", [userModel, userId], function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {
            res.status(200).json({
                'message': 'User successfully updated'
            })
        }
    });
}


exports.addMoneyToUser = function (req, res) {
    // Add money to User (Viewer) after they have watched a video
    let userId = req.body.userId;

    /* IMPORTANT */
    let moneyToAdd = 0.70 // VERRY IMPORTANT VARIABLE, HERE TO MODIFY THE PRICE FOR THE VIEWERS
    /* IMPORTANT */

    connection.query("UPDATE users set actualWallet = actualWallet + ? where userId = ?", [moneyToAdd, userId], function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            res.status(200).json({
                'message': 'Money Successfully added! '
            });

        }
    });
}



exports.addDaysToSubscribtion = function (req, res) {
    // Add days to User (company) after they have paid their subscription
    let userId = req.body.userId;

    /* IMPORTANT */
    let daysToAdd = 30 // VERRY IMPORTANT VARIABLE, HERE TO MODIFY THE DAYS TO ADD TO THE COMPANY SUBSCRIBTION
    /* IMPORTANT */

    connection.query("UPDATE users set `subscriptionExpirationDate`= DATE_ADD(`subscriptionExpirationDate`,INTERVAL ? DAY) where userId = ?", [daysToAdd, userId], function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            res.status(200).json({
                'message': 'Subscription Successfully updated! '
            });

        }
    });
}

exports.resetWallet = function (req, res) {
    //Admin reasons --> Reset the wallet of viewers after having paying them by bank

    let userId = req.body.userId;
    connection.query("UPDATE users set actualWallet = 0 where userId = ?", userId, function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            res.status(200).json({
                'message': 'Wallet is now €0 ! The viewer has been paid. '
            });

        }
    });
}

exports.getAllViewers = function (req, res) {
    //get All viewers for Admin reasons --> To pay the viewers via bank and then reset their wallet.

    connection.query("SELECT * from users where isCompany = 0", function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            let allModels = resultSQL;

            res.status(200).json(allModels);
        }
    });
};