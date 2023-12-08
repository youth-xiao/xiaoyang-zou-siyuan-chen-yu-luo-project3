const mongoose = require("mongoose");
const TweetSchema = require("./user.schema").TweetSchema;
const TweetModel = mongoose.model("UserSchema", TweetSchema);

function insertTweet(tweet) {
    return TweetModel.create(tweet);
}

function findTweetByUsername(username) {
    return TweetModel.findOne({ username: username }).exec();
}

function getAllTweet() {
    return TweetModel.find().exec();
}

function findTweetById(id) {
    return TweetModel.findById(id).exec();
}

module.exports = {
    insertTweet,
    findTweetByUsername,
    getAllTweet,
    findTweetById,
};
