let connection = require("../db");
let VideoReview = require('../models/VideoReviewModel')
let walletController = require('./WalletController');


exports.allVideoReviews = function (req, res) {
    connection.query("SELECT * from videoreviews", function (error, resultSQL) {
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

exports.getVideoReviewById = function (req, res) {

    let videoReviewId = req.params.videoReviewId;

    connection.query("SELECT * from videoreviews where videoReviewId = ? ", videoReviewId, function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            let result = resultSQL;

            if (!result.length) { // Error message if video review doesn't exist
                res.status(400).send('This Video review doesn\'t exist.');
            } else {
                res.status(200).json(result[0]);

            }

        }
    });

}

exports.getAllReviewsByVideoId = function (req, res) {

    let FK_videoId = req.params.FK_videoId;

    connection.query("SELECT * from videoreviews where FK_videoId = ? ", FK_videoId, function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            let result = resultSQL;

            if (!result.length) { // Error message if video review doesn't exist
                res.status(400).send('This Video doesn\'t have reviewistics.');
            } else {
                res.status(200).json(result);

            }

        }
    });

}


exports.getAverageStatistics = function (reviewsArray) {
    let statisticObject = {
        "neutral": 0,
        "sad": 0,
        "surprised": 0,
        "happy": 0,
        "angry": 0,
        "disgusted": 0,
        "Q_triggered": 0
    };

    console.log(reviewsArray.length);
    reviewsArray.forEach(element => {
        statisticObject.neutral += element.neutral;
        statisticObject.sad += element.sad;
        statisticObject.surprised += element.surprised;
        statisticObject.angry += element.angry;
        statisticObject.happy += element.happy;
        statisticObject.disgusted += element.disgusted;
        statisticObject.Q_triggered += element.Q_triggered;
    });

    statisticObject.neutral = statisticObject.neutral / reviewsArray.length;
    statisticObject.sad = statisticObject.sad / reviewsArray.length;
    statisticObject.surprised = statisticObject.surprised / reviewsArray.length;
    statisticObject.angry = statisticObject.angry / reviewsArray.length;
    statisticObject.happy = statisticObject.happy / reviewsArray.length;
    statisticObject.disgusted = statisticObject.disgusted / reviewsArray.length;
    statisticObject.Q_triggered = statisticObject.Q_triggered / reviewsArray.length;

    console.log(statisticObject);
    return statisticObject;
}


exports.getVideoReviewsByUser = function (req, res) {

    let FK_userId = req.user.userId;
    let reviewList = [];

    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM videos INNER JOIN videoreviews ON videos.videoId = videoreviews.FK_videoId where videoreviews.FK_userId  = ? ORDER BY DateAndTime DESC", FK_userId, function (error, resultSQL) {

            if (error) {
                console.log(error);
                return resolve(reviewList);
            } else {
                reviewList = resultSQL;
                return resolve(reviewList);
            }
        });
    });

}

exports.sendEmotions = function (req, res) {
    let FK_userId = req.user.userId;
    let FK_videoId = req.body.videoId;
    let emotions = req.body.emotions;
    let Q_general = req.body.Q_general;
    let Q_triggered = parseInt(req.body.Q_triggered);
    let Q_appeal = req.body.Q_appeal;

    let videoReviewId = undefined;
    let videoReview = new VideoReview(videoReviewId, FK_userId, FK_videoId, emotions.neutral, emotions.sad, emotions.surprised, emotions.happy, emotions.angry, emotions.disgusted, Q_general, Q_triggered, Q_appeal); // Create the VideoReview Model and add it to the database
    connection.query("INSERT INTO videoreviews set ?", videoReview, function (error, resultSQL) {
        if (error) {
            console.log(error);
            res.status(400).send(error);
        } else {
            console.log(resultSQL);
            res.status(200).send(resultSQL);
            walletController.addMoneyToUser(FK_userId);
        }
    });

    //TODO: SEND MONEY WITH WALLET CONTROLLER

};



exports.updateVideoReview = function (req, res) {

    let idVideoReview = req.body.idVideoReview;
    let BrandName = req.body.BrandName;
    let VideoReviewName = req.body.VideoReviewName;
    let StartYear = req.body.StartYear;
    let EndYear = req.body.EndYear;
    let BasePrice = req.body.BasePrice;

    let videoReview = new VideoReview(BrandName, VideoReviewName, StartYear, EndYear, BasePrice); // Créer le model et ensuite le remplacer dans la base de donnée
    connection.query("UPDATE videoreviews set ? where idVideoReview = ?", [videoReview, idVideoReview], function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            res.status(200).json({
                'message': 'Video Review successfully updated'
            })

        }
    });
}



exports.deleteVideoReview = function (req, res) {



    let idVideoReview = req.body.idVideoReview;

    connection.query("DELETE from videoreviews where idVideoReview = ?", idVideoReview, function (error, resultSQL) {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200);
            res.redirect('back');
        }
    });
};