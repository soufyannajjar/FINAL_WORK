// Get an instance of the express Router and set routes
let express = require("express");
let app = express();
let router = express.Router();


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