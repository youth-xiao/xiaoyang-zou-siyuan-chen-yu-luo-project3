const express = require("express");
const router = express.Router();

const TweetAccessor = require("./db/tweet.model");

router.post("/", async function (request, response) {
    const username = request.cookies.username;
    if (!username) {
        response.status(400);
        return response.send("Users need to be logged in to create a new tweet.");
    }

    const content = request.body.content;
    if (!content) {
        response.status(400);
        return response.send("Missing tweet content.");
    }

    const newTweet = {
        username: username,
        content: content,
    };

    const createdTweet = await TweetAccessor.insertTweet(newTweet);
    response.json(createdTweet);
});

// /api/tweet/all => return all tweet
// /api/tweet/all?username=xiaoyang ==> return all pokemon owned by xiaoyang
router.get("/all", async function (req, response) {
    const username = req.cookies.username;
    if (username) {
        const foundTweet = await TweetAccessor.findTweetByUsername(username);
        return response.json(foundTweet);
    } else {
        const foundTweet = await TweetAccessor.getAllTweet();
        return response.json(foundTweet);
    }
});

// /api/tweetId/1 => tweetId = 1
// /api/tweetId/12312312 => tweetId = 12312312
router.get("/:tweetId", function (request, response) {});

router.delete("/:tweetId", function (request, response) {});

router.put("/:tweetId", function (request, response) {});

module.exports = router;
