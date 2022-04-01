let subscriptionController = require('./SubscriptionController');
let walletController = require('./WalletController');
let videoController = require('./VideoController');
let videoReviewController = require('./VideoReviewController');
let authController = require('./AuthController');

exports.getAllCompanyDashboardVariables = async function (req, res) {
    //1. First get All Videos by User Company
    await videoController.getAllVideosByUser(req, res).then(async (videoList) => {

        let isFilled = true;
        if (!videoList.length) { // Error message if user doesn't have videos.
            isFilled = false;
        }
        //1. Then get Subscription Date - User Company  && render everything

        await subscriptionController.getSubscriptionDateByUserId(req, res).then((subscriptionExpirationDateString) => {
            res.render("company/dashboard.ejs", {
                videos: videoList,
                subscriptionActive: subscriptionController.checkSubscriptionDate(subscriptionExpirationDateString),
                subscriptionExpirationDate: subscriptionExpirationDateString,
                isFilled: isFilled,
            });
        });
    });

}

exports.getAllViewerDashboardVariables = async function (req, res) {
    //1. First get All Videos Reviws by User Viewer
    await videoReviewController.getVideoReviewsByUser(req, res).then(async (reviewList) => {
        let isFilled = true;
        if (!reviewList.length) { // Error message if user doesn't have videos.
            isFilled = false;
        }
        //2. Then get Wallet - User Viewer 
        await walletController.getWalletAndBankNumberByUserId(req, res).then(async (walletAndBank) => {
            //2. Then get the salary history  && render everything
            await walletController.getSalaryHistoryByUserId(req, res).then((historyList) => {
                res.render("viewer/dashboard.ejs", {
                    videos: reviewList,
                    isFilled: isFilled,
                    historyList: historyList,
                    bankNumber: walletAndBank.bankNumber,
                    actualWallet: walletAndBank.actualWallet.toFixed(2),
                });
            });
        });
    });

}

exports.getAllAdminDashboardVariables = async function (req, res) {
    //1. First get All Videos Reviws by User Viewer
    await authController.getAllViewers(req, res).then(async (userList) => {
        let isFilled = true;
        if (!userList.length) { // Error message if user doesn't have videos.
            isFilled = false;
        }
        console.log(userList);
        res.render("admin/dashboard.ejs", {
            viewers: userList,
            isFilled: isFilled,
        });
    });

}