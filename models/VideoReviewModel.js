class VideoReview {

    videoReviewId;
    FK_userId; //User who viewed the video
    FK_videoId; //Video who is viewed
    neutral; //percentage
    sad; //percentage
    surprised; //percentage
    happy; //percentage
    angry; //percentage
    disgusted; //percentage
    Q_general; //1.	What did you think of this commercial in general? (Open)
    Q_triggered; //2. Were you triggered to perform an action? (E.g. buying a product)? (1-5 multiple choice)
    Q_appeal; //3. Do you think this commercial will appeal to the target group? Why or why not?

    constructor(videoReviewId, FK_userId, FK_videoId, neutral, sad, surprised, happy, angry, disgusted, Q_general, Q_triggered, Q_appeal) {
        this.videoReviewId = videoReviewId;
        this.FK_userId = FK_userId;
        this.FK_videoId = FK_videoId;
        this.neutral = neutral;
        this.sad = sad;
        this.surprised = surprised;
        this.happy = happy;
        this.angry = angry;
        this.disgusted = disgusted;
        this.Q_general = Q_general;
        this.Q_triggered = Q_triggered;
        this.Q_appeal = Q_appeal;
    }

};
module.exports = VideoReview;