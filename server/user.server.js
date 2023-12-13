const express = require("express");
const router = express.Router();

const bycrpt = require("bcryptjs");

const UserAccessor = require("./db/user.model");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Get all registered users
 */
router.get("/", async function (request, response) {
    const foundUser = await UserAccessor.getAllUser();
    return response.json(foundUser);
});

/**
 * Get user by username
 */
router.get("/:username", async function (request, response) {
    const requestedUsername = request.params.username;
    if (!requestedUsername) {
        response.status(400);
        return response.send("Username parameter is missing.");
    }
    try {
        const foundUser = await UserAccessor.getUserByUsername(requestedUsername);
        return response.json(foundUser);
    } catch (error) {
        response.status(500);
        return response.send("Error fetching user's tweets.");
    }
});

/**
 * Create a new user (with unique username and encrypted password)
 */
router.post("/", async function (request, response) {
    const body = request.body;
    const username = body.username;
    const password = body.password;
    if (!username || !password) {
        response.status(401);
        return response.send("Incomplete request");
    }
    hashedPassword = bycrpt.hashSync(password, 10);
    const newUser = {
        username: username,
        password: hashedPassword,
    };

    try {
        const createdUser = await UserAccessor.insertUser(newUser);
        // response.cookie("username", createdUser.username);
        return response.json("Successfully created new user " + createdUser.username);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            // Error code 11000 indicates a duplicate key (unique constraint) violation
            response.status(400);
            return response.send("Username is already taken.");
        } else {
            // Handle other errors
            response.status(500);
            return response.send("Error creating user.");
        }
    }
});

/**
 * Login with username and password
 */
router.post("/login", async function (request, response) {
    const body = request.body;
    const username = body.username;
    const password = body.password;
    if (!username || !password) {
        response.status(401);
        return response.send("Incomplete request");
    }

    const receivedUser = await UserAccessor.getUserByUsername(username);
    if (!receivedUser) {
        response.status(404);
        return response.send("No user with username " + username);
    }

    if (bycrpt.compareSync(password, receivedUser.password)) {
        const secretKey = crypto.randomBytes(32).toString("hex");
        const token = jwt.sign({ username }, secretKey, { expiresIn: "1d" });
        response.cookie("username", receivedUser.username);
        response.status(200);
        return response.send({ token, loggedIn: true });
    } else {
        response.status(404);
        return response.send("No user with username + password combo exists " + username);
    }
});

/**
 * Update user description if logged in
 */
router.put("/description", async function (request, response) {
    const username = request.cookies.username;
    const newDescription = request.body.description;

    if (!username) {
        response.status(401);
        return response.send("User is not logged in");
    }
    try {
        const updatedUser = await UserAccessor.updateUserDescription(username, newDescription);
        if (!updatedUser) {
            response.status(404);
            return response.send("User not found");
        }
        return response.json(updatedUser);
    } catch (error) {
        response.status(500);
        return response.send("Error updating description");
    }
});

/**
 * Logout user, reset cookies.username
 */
router.post("/logout", async function (request, response) {
    // this doesn't delete the cookie, but expires it immediately
    response.clearCookie("username");
    response.send();
});

/**
 * Test if the user is logged in
 */
router.get("/isLoggedIn", function (request, response) {
    const username = request.cookies.username;

    response.send({
        isLoggedIn: !!username,
        username: username,
    });
});

module.exports = router;
