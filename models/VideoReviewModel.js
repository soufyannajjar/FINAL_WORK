class VideoReview {

    videoReviewId;
    FK_userId; //User who viewed the video
    FK_videoId; //Video who is viewed

    constructor(videoReviewId, FK_userId, FK_videoId) {

        this.videoReviewId = videoReviewId;
        this.FK_userId = FK_userId;
        this.FK_videoId = FK_videoId;
    }

};
module.exports = VideoReview;