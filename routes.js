// Get an instance of the express Router and set routes
let express = require("express");
let app = express();
let router = express.Router();

/* ------------ ------------ VIEWS AND POSTS ------------ ------------   */
/* HOME - Views */
router.get('/', (req, res) => {
  res.render('home'); //Render home page
})

router.post('/contactMail', mailController.sendContactMail); //Post sended in home.js to contact the admin of the platform with a form (name, email & message)

router.get("/dashboard", (req, res, next) => {
  checkUser.redirectDashboard(req, res, next); //redirect to dashboard if user go to /dashboard
});


/* LOG IN  - Views */
router.get('/login', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render("login.ejs"); //Render login page if user is not authenticated
    return;
  } else {
    checkUser.redirectDashboard(req, res, next); //Redirect to User dashboard if user is authenticated
  }
});

router.post('/login', authController.postLogin); //Send post to postLogin and log user in
router.get('/passwordReset', (req, res) => {
  res.render('resetPassword'); //Render reset password page
})
router.post('/sendResetCode', authController.sendPasswordResetCode); //Send post to ask passwordReset
router.post('/checkResetCode', authController.checkForPasswordReset); //Send post to ask passwordReset


/* REGISTER - Views */
router.get('/register', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render("register.ejs"); //Render register page if user is not authenticated
    return;
  } else {
    checkUser.redirectDashboard(req, res, next); //Redirect to User dashboard if user is authenticated
  }
});

router.post('/register', authController.postRegister); //Send Post to postRegister and register user


/* LOGOUT  */
router.get('/logout', (req, res) => {
  req.logout(); //Logout
  req.flash('success_msg', 'Logged out !'); //Send message to say that user is logged out
  res.redirect('/'); // redirect to home after logged out
})


/* ------------ COMPANY ------------  */

/* COMPANY DASHBOARD  - Views */
router.get("/company/dashboard", checkUser.checkCompany, dashboardController.getAllCompanyDashboardVariables);
// check if user is company
// get All dashboard variables and render dashboard



/* COMPANY UPLOAD VIDEO  - Views */
router.get("/company/upload", checkUser.checkCompany, (req, res, next) => {
  res.render("company/uploadVideo.ejs", {
    videoObject: 0,
    errorList: 0
  });
});

router.post('/company/upload', videoController.addVideo); //Send Post to addVideo and upload company video in database
router.get('/company/subscription', checkUser.checkCompany, subscriptionController.paymentFunction); //Send user to payment page for subscription
router.get('/company/checkPayment', checkUser.checkCompany, subscriptionController.checkPayment); //Check if user have paid and update his subscription


/* COMPANY VIDEO DETAILS - Views */
router.get("/company/video/:videoId", checkUser.checkCompany, videoController.getVideoById); //Show video details by unique video id
/* ------------ END COMPANY ------------  */

/* API  */
// API CONTROLLERS
let videoApiController = require('./api/VideoApiController');
let videoReviewApiController = require('./api/VideoReviewApiController');
let userApiController = require('./api/UserApiController');

/* --------- VIDEOS REVIEWS--------- */
router.get('/api/allVideoReviews', videoReviewApiController.allVideoReviews); // Get All Video reviews of all video's
router.get('/api/videoReviewById/:videoReviewId', videoReviewApiController.getVideoReviewById); // Get one Video Review by specific id
router.get('/api/getAllReviewsByVideoId/:FK_videoId', videoReviewApiController.getAllReviewsByVideoId); // Get All the reviews from a specific video (by his id)
router.get('/api/getVideoViews/:FK_videoId', videoReviewApiController.getVideoViews); // Get All the views number from a specific video (by his id)
router.post('/api/addVideoReview', videoReviewApiController.addVideoReview); // Add a new review on a specific video
/* --------- END VIDEOS REVIEWS--------- */


/* --------- VIDEOS--------- */
router.get('/api/getVideoById/:videoId', videoApiController.getVideoById); // Get one Video by specific id
router.get('/api/getAllVideosByUser/:FK_userId', videoApiController.getAllVideosByUser); // Get all videos uploaded by a specific user (company)
router.post('/api/addVideo', videoApiController.addVideo); // User (company) add a new video
router.put('/api/updateVideo/:videoId', videoApiController.updateVideo); // User (company) update a his own video
// router.delete('/api/deleteVideo/:idVideo', reviewApiController.deleteVideo); // Delete video (option is not possible)
/* --------- END VIDEOS--------- */


/* --------- USERS--------- */
router.post('/api/newUser', userApiController.newUser); // User (company & viewer) create a new account
router.put('/api/updateUser/:userId', userApiController.updateUser); // User (company & viewer) update a his account
router.post('/api/addMoneyToUser', userApiController.addMoneyToUser); // Add money to User (Viewer) after they have watched a video
router.post('/api/addDaysToSubscribtion', userApiController.addDaysToSubscribtion); // Add days to User (company) after they have paid their subscription
router.post('/api/resetWallet', userApiController.resetWallet); //Admin reasons --> Reset the wallet of viewers after having paying them by bank
router.get('/api/getAllViewers', userApiController.getAllViewers); //get All viewers for Admin reasons --> To pay the viewers via bank and then reset their wallet.
/* --------- END USERS--------- */
/* --------------------------- END API ---------------------------  */


module.exports = router;