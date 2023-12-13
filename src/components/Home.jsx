import "../styling/Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "./Tweet";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState(null);
  const [editingTweet, setEditingTweet] = useState(null);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/tweet/");
        const sortedTweets = response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        );
        setTweets(sortedTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    const fetchUser = () => {
      const cookieString = document.cookie;
      const usernameCookie =
        cookieString &&
        cookieString.split("; ").find((row) => row.startsWith("username="));
      const username = usernameCookie ? usernameCookie.split("=")[1] : null;
      setLoggedInUser(username ? { username } : null);

      const tokenCookie = cookieString
      .split("; ")
      .find((row) => row.startsWith("userToken="));

      const token = tokenCookie
      ? tokenCookie.split("=")[1]
        : null;
      
      console.log("check fetched token: ", token);
      setToken(token);
    };
    fetchedData();
    fetchUser();
  }, []);

  const handleEdit = (editedTweet) => {
    setEditingTweet(editedTweet);
  };

  return (
    <div className="home-container">
      <h1>Twitter Home Page</h1>
      <div className="tweets-container">
        {tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            loggedInUser={loggedInUser}
            onEdit={ handleEdit }
            token={token}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
