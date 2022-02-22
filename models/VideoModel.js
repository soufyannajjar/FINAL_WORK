 // Video Object imported in videoController

 class Video {

     videoId;
     title;
     videoLink;
     uploadDate;
     description;
     audienceMinAge;
     audienceMaxAge;
     FK_userId; //Foreign key, COMPANY who upload the video

     constructor(videoId, title, videoLink, uploadDate, description, audienceMinAge, audienceMaxAge, FK_userId) {
         this.videoId = videoId;
         this.title = title;
         this.videoLink = videoLink;
         this.uploadDate = uploadDate;
         this.description = description;
         this.audienceMinAge = audienceMinAge;
         this.audienceMaxAge = audienceMaxAge;
         this.FK_userId = FK_userId;
     }

 };

 module.exports = Video;