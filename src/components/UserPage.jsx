import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Tweet from "./Tweet";

function UserPage(props) {
    const [user, setUser] = useState(null);
    const [tweets, setTweets] = useState([]);
    // const [description, setDescription] = useState("");
    // const [newTweet, setNewTweet] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(null);
    const { username } = useParams();

    useEffect(() => {
        async function fetchTweetsAndUser() {
            try {
                const tweetsInfo = await axios.get(`http://localhost:3500/api/tweet/` + username);
                const userInfo = await axios.get(`http://localhost:3500/api/user/` + username);
                setTweets(tweetsInfo.data);
                setUser(userInfo.data);
            } catch (error) {
                console.error("Error fetching tweets and user: ", error);
            }
        }
        fetchTweetsAndUser();
        const cookieString = document.cookie;
        const usernameCookie = cookieString && cookieString.split("; ").find((row) => row.startsWith("username="));
        const loggedIn = usernameCookie ? usernameCookie.split("=")[1] : null;
        setLoggedInUser(loggedIn ? { loggedIn } : null);
    }, [username]);

    return (
        <div>
            {user && (
                <div>
                    <h1>{user.username}</h1>
                    <p>{user.description}</p>
                    <button>Edit Description</button>
                </div>
            )}
            <div>
                <input type="text" placeholder="Enter your new tweet..."></input>
                <button>Post Tweet</button>
            </div>

            <div className="tweets-container">{Array.isArray(tweets) && tweets.length > 0 ? tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} onEdit={loggedInUser && tweet.username === loggedInUser.username ? handleEdit : null} />) : <p>No tweets available</p>}</div>
        </div>
    );
}

export default UserPage;
