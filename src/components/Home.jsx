import "../styling/Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "./Tweet";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
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
    fetchedData();
    const cookieString = document.cookie;
    const usernameCookie =
      cookieString &&
      cookieString.split("; ").find((row) => row.startsWith("username="));
    const username = usernameCookie ? usernameCookie.split("=")[1] : null;
    setLoggedInUser(username ? { username } : null);
  }, []);

  const handleEdit = (editedTweet) => {
    setEditingTweet(editedTweet);
  };

  const handleSaveEdit = async (tweetId, updatedContent) => {
    console.log("tweetId: ", tweetId);
    console.log("check link: ", `http://localhost:3500/api/tweet/id/${tweetId}`);
    try {
      const token = localStorage.getItem("userToken");
      console.log("check token: ", token);
      const response = await axios.put(
        `http://localhost:3500/api/tweet/id/${tweetId}`,
        { content: updatedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedTweet = response.data;
      console.log("updatedTweet: ", updatedTweet);
      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === updatedTweet._id ? updatedTweet : tweet,
        ),
      );
      setEditingTweet(null);
    } catch (error) {
      console.error("Error updating tweet:", error);
    }
  };

  return (
    <div className="home-container">
      <h1>Twitter Home Page</h1>
      <div className="tweets-container">
        {tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            onEdit={
              loggedInUser && tweet.username === loggedInUser.username
                ? handleEdit
                : null
            }
            handleSaveEdit={handleSaveEdit}
          />
        ))}
      </div>

      {editingTweet && (
        <div className="edit-modal">
          <textarea
            value={editingTweet.content}
            onChange={(e) =>
              setEditingTweet({ ...editingTweet, content: e.target.value })
            }
          />
          <button onClick={() => handleSaveEdit(editingTweet._id, editingTweet.content)}>
            Save
          </button>
          <button onClick={() => setEditingTweet(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Home;
