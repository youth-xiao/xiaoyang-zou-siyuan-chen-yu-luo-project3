const express = require("express");
const router = express.Router();

const TweetAccessor = require("./db/tweet.model");

/**
 * Logged in user can create new tweets
 */
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

/**
 * Get all available tweets on home page
 */
router.get("/", async function (request, response) {
    try {
        const foundTweets = await TweetAccessor.getAllTweet();
        return response.json(foundTweets);
    } catch (error) {
        response.status(500);
        return response.send("Error fetching tweets.");
    }
});

/**
 * Get all tweets based on a username (for a specific user page)
 *
 * e.g., /api/tweet/xiaoyang ==> return all tweets owned by xiaoyang
 */
router.get("/:username", async function (request, response) {
    const requestedUsername = request.params.username;
    if (!requestedUsername) {
        response.status(400);
        return response.send("Username parameter is missing.");
    }
    try {
        const foundTweets = await TweetAccessor.findTweetByUsername(requestedUsername);
        return response.json(foundTweets);
    } catch (error) {
        response.status(500);
        return response.send("Error fetching user's tweets.");
    }
});

/**
 * Get tweet by ID
 * e.g., /api/tweet/:tweetId => return tweet with :tweetId
 * everyone can get every tweet
 */
router.get("/id/:tweetId", async function (request, response) {
  const tweetId = request.params.tweetId;
  if (!tweetId) {
    response.status(400);
    return response.send("Tweet ID parameter is missing.");
  }
  try {
    const foundTweet = await TweetAccessor.findTweetById(tweetId);
    if (!foundTweet) {
      response.status(404);
      return response.send("Tweet not found.");
    }
    return response.json(foundTweet);
  } catch (error) {
    response.status(500);
    return response.send("Error fetching tweet.");
  }
});

/**
 * Middleware to check tweet ownership
 * only when the user is logged in, they have access to edit their tweets
 */
const checkTweetOwnership = async function (request, response, next) {
  const tweetId = request.params.tweetId;
  const username = request.cookies.username;
  if (!username) {
    response.status(401);
    return response.send("User not logged in.");
  }
  try {
    const foundTweet = await TweetAccessor.findTweetById(tweetId);

    if (!foundTweet) {
      response.status(404);
      return response.send("Tweet not found.");
    }
    if (foundTweet.username !== username) {
      response.status(403);
      return response.send(
        "You do not have permission to perform this action.",
      );
    }
    next(); // If ownership is confirmed, proceed to the next handler
  } catch (error) {
    response.status(500);
    return response.send("Error checking tweet ownership.");
  }
};

/**
 * Delete tweet by ID
 * e.g., /api/tweet/:tweetId => delete tweet with :tweetId
 */
router.delete(
  "/id/:tweetId",
  checkTweetOwnership,
  async function (request, response) {
    const tweetId = request.params.tweetId;
    if (!tweetId) {
      response.status(400);
      return response.send("Tweet ID parameter is missing.");
    }

    try {
      const deletedTweet = await TweetAccessor.deleteTweetById(tweetId);
      if (!deletedTweet) {
        response.status(404);
        return response.send("Tweet not found.");
      }
      return response.json(deletedTweet);
    } catch (error) {
      response.status(500);
      return response.send("Error deleting tweet.");
    }
  },
);

/**
 * Update tweet by ID
 * e.g., /api/tweet/:tweetId => update tweet with :tweetId
 */
router.put(
  "/id/:tweetId",
  checkTweetOwnership,
  async function (request, response) {
    const tweetId = request.params.tweetId;
    const updatedContent = request.body.content;
    if (!tweetId || !updatedContent) {
      response.status(400);
      return response.send("Tweet ID or updated content is missing.");
    }

    try {
      const updatedTweet = await TweetAccessor.updateTweetById(
        tweetId,
        updatedContent,
      );
      if (!updatedTweet) {
        response.status(404);
        return response.send("Tweet not found.");
      }
      return response.json(updatedTweet);
    } catch (error) {
      response.status(500);
      return response.send("Error updating tweet.");
    }
  },
);

module.exports = router;
