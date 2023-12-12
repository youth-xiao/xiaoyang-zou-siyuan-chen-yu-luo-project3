const mongoose = require("mongoose");
const TweetSchema = require("./tweet.schema").TweetSchema;
const TweetModel = mongoose.model("TweetSchema", TweetSchema);

function insertTweet(tweet) {
  return TweetModel.create(tweet);
}

function findTweetByUsername(username) {
  return TweetModel.find({ username: username }).exec();
}

function getAllTweet() {
  return TweetModel.find().exec();
}

function updateTweetById(tweetId, updatedContent) {
  return TweetModel.findByIdAndUpdate(
    tweetId,
    { content: updatedContent },
    { new: true },
  ).exec();
}

function findTweetById(id) {
  return TweetModel.findById(id).exec();
}

function deleteTweetById(tweetId) {
  return TweetModel.findByIdAndDelete(tweetId).exec();
}

module.exports = {
  insertTweet,
  findTweetByUsername,
  getAllTweet,
  findTweetById,
  updateTweetById,
  deleteTweetById,
};
