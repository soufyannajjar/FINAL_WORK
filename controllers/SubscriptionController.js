let subscriptionController = require('./SubscriptionController');
let connection = require("../db");
// STRIPE PAYMENT SYSTEM
const stripe = require('stripe')("sk_test_51KG3xBKqkrFCiohsDr7mUgnGB7jYnPH7K8SJj9WA1oTYqxAjRkNu52clQ9JStwjciFtKomj36JJtSTYES1NTCA9800HePl3gan");
var url = require('url');


/* IMPORTANT */
const subscriptionPrice = 99; // VERRY IMPORTANT VARIABLE, HERE TO MODIFY THE PRICE FOR THE COMPANY SUBSCRIPTION
/* IMPORTANT */

const addDaysToSubscribtion = async function (req, res) {
    // Add days to User (company) after they have paid their subscription
    let userId = req.user.userId;

    /* IMPORTANT */
    let daysToAdd = 30 // VERRY IMPORTANT VARIABLE, HERE TO MODIFY THE DAYS TO ADD TO THE COMPANY SUBSCRIBTION
    /* IMPORTANT */

    await subscriptionController.getSubscriptionDateByUserId(req, res).then((subscriptionExpirationDateString) => {



        let query = "UPDATE users set `subscriptionExpirationDate`= DATE_ADD(`subscriptionExpirationDate`,INTERVAL ? DAY) where userId = ?";
        let queryArray = [daysToAdd, userId];

        if (!subscriptionController.checkSubscriptionDate(subscriptionExpirationDateString)) { // CHECK IF DATE IS EXPIRED
            console.log("DATE EXPIRED");
            let subscriptionExpirationDate = new Date(Date.now());
            subscriptionExpirationDate.setDate(subscriptionExpirationDate.getDate() + daysToAdd);

            query = "UPDATE users set `subscriptionExpirationDate`= ? where userId = ?";
            queryArray = [subscriptionExpirationDate, userId];
        }

        connection.query(query, queryArray,
            function (error, resultSQL) {
                if (error) {
                    req.flash('error_msg', error);
                } else {
                    req.flash('success_msg', "Success, 30 Days added to your subscription !")
                }
                res.status(200).redirect("/company/dashboard");

            });
    });
}

exports.checkSubscriptionDate = function (date) {
    let dateNow = new Date(Date.now());
    let dateSubscription = new Date(date);
    if (dateSubscription > dateNow) {
        console.log(dateSubscription + " IS GREATER" + dateNow);
        return true; //Subscription is active
    } else if (dateSubscription < dateNow) {
        console.log(dateSubscription + " IS NOT GREATER" + dateNow);

        return false; //Subscription is expired
    } else {
        return false; //Subscription is expired
    }
}

exports.getSubscriptionDateByUserId = async function (req, res, next) {
    let userId = req.user.userId;
    let subscriptionExpirationDate = new Date(Date.now());
    return new Promise((resolve, reject) => {
        connection.query("SELECT subscriptionExpirationDate from users where userId = ? ", userId, function (error, resultSQL) {
            if (error) {
                //console.log(error);
                return resolve(formatDate(subscriptionExpirationDate));
            } else {
                subscriptionExpirationDate = resultSQL[0].subscriptionExpirationDate;
                return resolve(formatDate(subscriptionExpirationDate));
            }
        });
    });

    function formatDate(date) {
        // FORMAT DATE TO "Sun Nov 13 2022" (EXAMPLE)
        let dateSubscription = new Date(date);
        return dateSubscription.toDateString();
    }

}


function getFormattedUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
}

exports.paymentFunction = function (req, res) {
    try {
        var currentHostUrl = getFormattedUrl(req);
        console.log(currentHostUrl);
        stripe.sources.create({
                type: 'bancontact',
                amount: subscriptionPrice * 100,
                currency: 'eur',
                redirect: {
                    return_url: `${currentHostUrl}/company/checkPayment`,
                },
                owner: {
                    name: req.user.lastName,
                    email: req.user.email,
                }
            })
            .then((source) => {
                // console.log(source);
                res.redirect(source.redirect.url);
            })
            .catch(error => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
        req.flash('error_msg', "FATAL error occured..");
    }
    //res.redirect("/company/dashboard");

}

exports.checkPayment = function (req, res) {
    console.log("--------------- ------------- ------------- ------------- ------------- CHECK PAYMENT");
    console.log(req.query);
    console.log(req);
    try {
        stripe.charges.create({
                // locale: locale,
                source: req.query.source,
                // customer: req.user.userId,
                amount: subscriptionPrice * 100,
                currency: "eur",

            })
            .then((paymentInfo) => {
                addDaysToSubscribtion(req, res);
                // SUCCESS !
            })
            .catch(error => {
                console.log(error);
                req.flash('error_msg', "FATAL error occured..");
                res.redirect("/company/dashboard");
            });;
    } catch (error) {
        console.log(error);
        req.flash('error_msg', "FATAL error occured..");
        res.redirect("/company/dashboard");

    }

}