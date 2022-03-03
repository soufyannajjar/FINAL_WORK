let connection = require("../db");
let VideoModel = require('../models/VideoModel')
let videoReviewController = require('./VideoReviewController');

exports.getVideoById = function (req, res, next) {
  let videoId = req.params.videoId;

  connection.query("SELECT * from videos where videoId = ? ", videoId, function (error, resultSQL) {
    if (error) {
      console.log(error);
      //res.redirect("/company/dashboard");;
    } else {
      let video = resultSQL;
      let reviewsArray = [];

      if (!video.length) { // Redirectif video doesn't exist
        res.redirect("/company/dashboard");
      } else {
        //Query the reviews of this video 
        connection.query("SELECT * from videoreviews where FK_videoId = ? ", videoId, function (error, resultSQL) {
          if (error) {
            res.redirect("/company/dashboard");
          } else {

            reviewsArray = resultSQL;
            let videoIsReviewed = true;

            if (!reviewsArray.length) { // Check is video is reviewed by minimum one VIEWER
              videoIsReviewed = false;
            }

            res.render("company/videoDetails.ejs", {
              video: video[0],
              reviewsArray: reviewsArray,
              videoIsReviewed: videoIsReviewed,
              statisticObject: videoReviewController.getAverageStatistics(reviewsArray)
            });

          }
        });
      }

    }
  });

}

exports.getAllVideosByUser = function (req, res) {
  let FK_userId = req.user.userId;
  return new Promise((resolve, reject) => {
    connection.query("SELECT * from videos where FK_userId = ? ", FK_userId, function (error, resultSQL) {
      if (error) {
        return reject(error);
      } else {
        return resolve(resultSQL);
      }
    });
  });
}

exports.addVideo = function (req, res) {
  let errorList = [];
  try {
    let {
      title,
      uploadDate,
      videoLink,
      description,
      audienceMinAge,
      audienceMaxAge,
      FK_userId
    } = req.body;

    validateInformation(req.body)

  } catch (err) {
    console.error(err.message);
  }

  function validateInformation(videoObject) {
    console.log(videoObject);
    console.log("----- CURRENTZ");
    console.log(req.user);
    //Check if user is logged in
    if (req.isAuthenticated()) {
      if (isNaN(req.user.userId)) {
        res.redirect("/login");
      } else {
        if (req.user.isCompany != 1) {
          errorList.push(" YOU ARE NOT A COMPANY, YOU CAN'T UPLOAD A VIDEO");
        }
      }
    } else {
      res.redirect("/login");
    }

    //check if title is filled
    if (!videoObject.title) {
      errorList.push(" Please fill Title");
    }
    //check if description is filled
    if (!videoObject.description) {
      errorList.push(" Please fill Title");
    }

    //check if description is correct
    if (videoObject.description.length > 255) {
      errorList.push(" Incorrect Description length");
    }

    console.log(videoObject.description.length);

    //check if audienceMinAge is filled
    if (!videoObject.audienceMinAge) {
      errorList.push(" Please fill Audience Min Age");
    }
    //check if audienceMaxAge is filled
    if (!videoObject.audienceMaxAge) {
      errorList.push(" Please fill Audience Max Age");
    }
    //check if Audience Min Age & Audience Max Age is correct
    if (isNaN(videoObject.audienceMaxAge) || isNaN(videoObject.audienceMinAge)) {
      errorList.push(" Audience is incorrect");
    }
    //check if Audience Min Age & Audience Max Age is correct
    if (parseInt(videoObject.audienceMaxAge) < parseInt(videoObject.audienceMinAge)) {
      errorList.push(" Max audience need to be higher than min");
    }
    //check if videoLink is filled
    if (!videoObject.videoLink) {
      errorList.push(" Please upload a video!");
    } else {
      //check if e-videoLink is correct
      if (!videoObject.videoLink.includes("http") && !videoObject.videoLink.includes("firebase")) {
        errorList.push("Please upload a video!");
      }
    }


    if (errorList.length > 0) {
      //Throw error
      console.log(" Errors, not passed!");
      req.flash('error_msg', errorList);
      res.render("company/uploadVideo.ejs", {
        videoObject: videoObject,
        errorList: errorList
      });

      res.status(500).redirect('back');
      //res.redirect('/company/upload?title=' + videoObject.title + "&videoLink=" + videoObject.videoLink + "&description=" + videoObject.description + "&audienceMinAge=" + videoObject.audienceMinAge + "&audienceMaxAge=" + videoObject.audienceMaxAge);

      console.log(errorList);
      console.log("ERRORS , NO ");
      res.status(500);

    } else {
      addVideoToDb(videoObject);
    }
  }

  function addVideoToDb(videoObject) {

    let videoId = videoObject.videoId;
    let title = videoObject.title;
    let videoLink = videoObject.videoLink;
    let uploadDate = new Date(Date.now()); //Set the date of today
    let description = videoObject.description;
    let audienceMinAge = videoObject.audienceMinAge;
    let audienceMaxAge = videoObject.audienceMaxAge;
    let FK_userId = req.user.userId; //Get actual connected user id 


    let videoModel = new VideoModel(videoId, title, videoLink, uploadDate, description, audienceMinAge, audienceMaxAge, FK_userId) // Create video and send it to database
    connection.query("INSERT INTO videos set ?", videoModel, function (error, resultSQL) {
      if (error) {
        console.log(error);
        res.status(400).json({
          'message': error
        });
        console.log(error);
      } else {
        res.status(200).redirect('/company/dashboard');
      }
      console.log(resultSQL);
    });
  }
}


exports.updateVideo = function (req, res) {

  let videoId = req.body.videoId;

  let title = req.body.title;
  //let videoLink =  req.body.videoLink;
  let uploadDate = req.body.uploadDate;
  let description = req.body.description;
  let audienceMinAge = req.body.audienceMinAge;
  let audienceMaxAge = req.body.audienceMaxAge;
  let FK_userId = req.body.FK_userId;

  let videoModel = new VideoModel(videoId, title, uploadDate, videoLink, description, audienceMinAge, audienceMaxAge, FK_userId); // Create video model then update it in database
  connection.query("UPDATE videos set ? where videoId = ?", [videoModel, videoId], function (error, resultSQL) {
    if (error) {
      res.status(400).json({
        'message': error
      });
    } else {
      res.status(200).redirect('back');

    }
  });
}

exports.deleteVideo = function (req, res) {

  let videoId = req.body.videoId;

  connection.query("DELETE from videos where videoId = ?", videoId, function (error, resultSQL) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).redirect('back');
    }
  });
};


exports.getViewerRandomVideo = function (req, res) {
  let FK_userId = req.user.userId;
  console.log("GET RANDOM VIDEO");
  console.log(FK_userId);

  let ageYear = new Date(req.user.birthDate).getFullYear();
  var year = new Date().getFullYear()
  let age = year - ageYear;
  console.log("age");
  console.log(age);
  // TODO: ADD AGE to query !!!!
  connection.query("SELECT * from videos WHERE audienceMinAge <= ? AND audienceMaxAge >= ? AND videoId NOT IN (SELECT FK_videoId from videoreviews where FK_userId = ?) LIMIT 1", [age, age, FK_userId], function (error, resultSQL) {
    if (error) {
      console.log(error);
    } else {
      console.log(resultSQL);
      if (resultSQL.length == 0) {
        //EVERYTHING SEEN WOW!
        //TODO: BUG!
        console.log("EVERYTHING SEEN");
        req.flash('error', "WOW! You have seen all the videos available for your age group. Please try again later.")
        res.redirect("/viewer/dashboard");
      } else {
        res.render("viewer/watch.ejs", {
          video: resultSQL[0]
        });
      }


    }
  });
};