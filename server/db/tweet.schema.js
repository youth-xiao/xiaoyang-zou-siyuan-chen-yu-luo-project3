const Schema = require("mongoose").Schema;

exports.TweetSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    createdTime: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "tweetTable" },
);
