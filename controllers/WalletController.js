const {
    NULL
} = require("mysql/lib/protocol/constants/types");
let connection = require("../db");
let Salary = require('../models/SalaryModel');

exports.addMoneyToUser = function (userId) {
    // Add money to User (Viewer) after they have watched a video

    /* IMPORTANT */
    let moneyToAdd = 0.70 // VERRY IMPORTANT VARIABLE, HERE TO MODIFY THE PRICE FOR THE VIEWERS
    /* IMPORTANT */

    connection.query("UPDATE users set actualWallet = actualWallet + ? where userId = ?", [moneyToAdd, userId], function (error, resultSQL) {
        if (error) {

        } else {
            addSalaryHistoryToUser(userId, moneyToAdd, true, undefined, undefined);

        }
    });
}

function addSalaryHistoryToUser(userId, salary, isEarned, req, res) {
    let dateOfPayment = new Date(Date.now()).toUTCString;
    let salaryId = undefined; // Created automatically on the MYSQL SERVER
    let salaryHistory = new Salary(salaryId, userId, salary, isEarned, dateOfPayment); // Create the Salary Model and add it to the database

    connection.query("INSERT INTO salaries set ?", salaryHistory, function (error, resultSQL) {
        if (isEarned == false) {
            if (error) {
                console.log(error);
                req.flash('error_msg', "An error occured, please try again.");
            } else {
                req.flash('success_msg', "Success, wallet of user with id: " + userId + " updated !");
            }

            res.redirect('/admin/dashboard');
        } else {
            console.log(error);
            console.log(resultSQL);
        }
    });
}

exports.reinitialiseWallet = function (req, res) {
    // Set Wallet to €0 to User (Viewer) after they having paying it on his bank number
    let userIdPaid = req.params.userIdPaid;
    let userSalary = req.params.userSalary;

    console.log("-----------");
    console.log(userIdPaid);
    console.log(userSalary);
    console.log("-----------");
    if (parseFloat(userSalary) <= 0) {
        req.flash('error_msg', "You cannot pay nothing.");
        res.redirect('/admin/dashboard');
    } else {
        // Set Wallet to €0 to User (Viewer) after they having paying it on his bank number
        connection.query("UPDATE users set actualWallet = 0 where userId = ?", [userIdPaid], function (error, resultSQL) {
            if (error) {
                console.log(error);
                req.flash('error_msg', "An error occured, please try again.");
                res.redirect('/admin/dashboard');
            } else {
                // Add Salary history to VIEWER dashboard
                addSalaryHistoryToUser(userIdPaid, userSalary, false, req, res);
            }

        });
    }

}



exports.updateBankNumber = function (req, res) {
    let userId = req.user.userId;
    let bankNumber = req.body.bankNumber;
    let errorList = [];
    console.log(bankNumber);
    console.log(errorList);
    //Check if BankNumber is filled & correct
    if (!bankNumber || bankNumber.length < 10) {
        errorList.push("Incorrect Bank Number");
    }
    console.log(errorList);

    if (errorList.length > 0) {
        //Throw error
        req.flash('error_msg', errorList);
        console.log(errorList);
        res.redirect("/viewer/dashboard");
        res.status(500);

    } else {
        console.log("ok");

        connection.query("UPDATE users set bankNumber = ? where userId = ?", [bankNumber, userId], function (error, resultSQL) {
            if (error) {
                console.log(error);
                console.log("errorList");

                req.flash('error_msg', "An error occured, please try again.");
            } else {
                req.flash('success_msg', "Success, We will now pay you on this bank number.")
            }
            res.status(200).redirect("/viewer/dashboard");
        });
    }



}

exports.getWalletAndBankNumberByUserId = function (req, res) {
    let userId = req.user.userId;

    return new Promise((resolve, reject) => {
        let actualWallet = 0.0;
        let bankNumber = "NO BANK NUMBER";
        connection.query("SELECT actualWallet,bankNumber from users where userId = ?", userId, function (error, resultSQL) {
            if (error) {
                console.log(error);
                return resolve(actualWallet, bankNumber);
            } else {
                actualWallet = resultSQL[0].actualWallet;
                bankNumber = resultSQL[0].bankNumber;
                let resultObject = {
                    'actualWallet': actualWallet,
                    'bankNumber': bankNumber
                }

                return resolve(resultObject)
            }
        });
    });

}

exports.getSalaryHistoryByUserId = function (req, res) {
    let userId = req.user.userId;
    return new Promise((resolve, reject) => {
        connection.query("SELECT * from salaries where FK_userId = ? ORDER BY dateOfPayment desc", userId, function (error, resultSQL) {
            if (error) {
                console.log(error);
                return resolve([]);
            } else {
                return resolve(resultSQL)
            }
        });
    });

}