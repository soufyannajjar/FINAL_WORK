let connection = require("../db");
let VideoModel = require('../models/VideoModel')


exports.getVideoById = function (req, res) {

  let videoId = req.params.videoId;

  connection.query("SELECT * from videos where videoId = ? ", videoId, function (error, resultSQL) {
    if (error) {
      res.status(400).json({
        'message': error
      });
    } else {

      let result = resultSQL;

      if (!result.length) { // Error message if video doesn't exist
        res.status(400).send('This Video doesn\'t exist.');
      } else {
        res.status(200).json(result[0]);

      }

    }
  });

}

exports.getAllVideosByUser = function (req, res) {

  let FK_userId = req.params.FK_userId;

  connection.query("SELECT * from videos where FK_userId = ? ", FK_userId, function (error, resultSQL) {
    if (error) {
      res.status(400).json({
        'message': error
      });
    } else {

      let result = resultSQL;

      if (!result.length) { // Error message if user doesn't have videos.
        res.status(400).send('This User doesn\'t have videos.');
      } else {
        res.status(200).json(result);

      }

    }
  });

}



exports.addVideo = function (req, res) {


  let videoId = req.body.videoId;
  let title = req.body.title;
  let videoLink = req.body.videoLink;
  let uploadDate = req.body.uploadDate;
  let description = req.body.description;
  let audienceMinAge = req.body.audienceMinAge;
  let audienceMaxAge = req.body.audienceMaxAge;
  let FK_userId = req.body.FK_userId;


  let videoModel = new VideoModel(videoId, title, videoLink, uploadDate, description, audienceMinAge, audienceMaxAge, FK_userId) // Create video and send it to database
  connection.query("INSERT INTO videos set ?", videoModel, function (error, resultSQL) {
    if (error) {
      res.status(400).json({
        'message': error
      });
    } else {
      res.status(200).json({
        'message': 'Video successfully added'
      })


    }
  });
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
      res.status(200).json({
        'message': 'Video successfully updated'
      })


    }
  });
}


exports.deleteVideo = function (req, res) {

  let videoId = req.body.videoId;

  connection.query("DELETE from videos where videoId = ?", videoId, function (error, resultSQL) {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(200).json({
        'message': 'Video successfully Deleted'
      })

    }
  });
};