let connection = require("../db");
let VideoReview = require('../models/VideoReviewModel')


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

exports.getVideoViews = function (req, res) {

    let FK_videoId = req.params.FK_videoId;

    connection.query("SELECT COUNT(FK_videoId) from videoreviews where FK_videoId = ? ", FK_videoId, function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {

            let result = resultSQL;
            
            if (!result.length) { // Error message if video review doesn't exist
                res.status(400).send('This Video doesn\'t have reviewistics.');
            } else {
                res.status(200).json(result[0]);

            }

        }
    });

}



exports.addVideoReview = function (req, res) {

    let videoReviewId = req.body.videoReviewId;
    let FK_userId = req.body.FK_userId;
    let FK_videoId = req.body.FK_videoId;

    let videoReview = new VideoReview(videoReviewId, FK_userId, FK_videoId); // Create the VideoReview Model and add it to the database
    connection.query("INSERT INTO videoreviews set ?", videoReview, function (error, resultSQL) {
        if (error) {
            res.status(400).json({
                'message': error
            });
        } else {
            res.status(200).json({'message': 'Video Review successfully added'})
        }
    });
}


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

            res.status(200).json({'message': 'Video Review successfully updated'})

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