import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Tweet from "./Tweet";
import TweetForm from "./TweetForm";
import Cookies from "js-cookie";

function UserPage() {
    const [user, setUser] = useState(null);
    const [tweets, setTweets] = useState([]);
    // const [description, setDescription] = useState("");
    const [loggedInUser, setLoggedInUser] = useState("");
    const { username } = useParams();

    useEffect(() => {
        async function fetchTweetsAndUser() {
            try {
                const tweetsInfo = await axios.get(`/api/tweet/` + username);
                const userInfo = await axios.get(`/api/user/` + username);
                setTweets(tweetsInfo.data);
                setUser(userInfo.data);
            } catch (error) {
                console.error("Error fetching tweets and user: ", error);
            }
        }
        fetchTweetsAndUser();
        const loggedIn = Cookies.get("username");
        setLoggedInUser(loggedIn);
    }, [username, tweets]);

    return (
        <div>
            {user && (
                <div>
                    <h1>{user.username}</h1>
                    <p>{user.description}</p>
                    {loggedInUser === username && <button>Edit Description</button>}
                </div>
            )}
            {loggedInUser === username && <TweetForm />}
            <div className="tweets-container">{Array.isArray(tweets) && tweets.length > 0 ? tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} onEdit={loggedInUser && tweet.username === loggedInUser.username ? handleEdit : null} />) : <p>No tweets available</p>}</div>
        </div>
    );
}

export default UserPage;
