const Schema = require("mongoose").Schema;

exports.TweetSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        content: {
            type: String,
            // minLength: 1,
            // maxLength: 100,
        },
        createdTime: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "tweetTable" }
);
