import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Tweet from "./Tweet";
import TweetForm from "./TweetForm";
import Cookies from "js-cookie";
import "../styling/UserPage.css";

function UserPage() {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isTweetChange, setIsTweetChange] = useState(0);
  const [editingTweet, setEditingTweet] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    async function fetchTweetsAndUser() {
      try {
        console.log(username);
        const tweetsInfo = await axios.get(`/api/tweet/` + username);
        const userInfo = await axios.get(`/api/user/` + username);
        setTweets(tweetsInfo.data);
        setUser(userInfo.data);
        setEditedContent(userInfo.data.description);
      } catch (error) {
        console.error("Error fetching tweets and user: ", error);
      }
    }
    fetchTweetsAndUser();
    const loggedIn = Cookies.get("username");
    setLoggedInUser(loggedIn);
  }, [isTweetChange]);

  const handleEditDescription = async () => {
    try {
      await axios.put("/api/user/description", {
        description: editedContent,
      });
      setUser({ ...user, description: editedContent });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating description: ", error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(user.description);
  };

  function renderDescription() {
    return (
      <div>
        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
              cols={50}
            />
            <button onClick={handleEditDescription}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>{user.description}</p>
            {loggedInUser === username && (
              <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
        )}
      </div>
    );
  }
  const handleEdit = (editedTweet) => {
    setEditingTweet(editedTweet);
  };
  return (
    <div className="user-page-container">
      {user && (
        <div>
          <h1>{user.username}</h1>
          {renderDescription()}
        </div>
      )}

      {loggedInUser === username && (
        <TweetForm setIsTweetChange={setIsTweetChange} />
      )}

      <div className="tweets-container">
        {Array.isArray(tweets) && tweets.length > 0 ? (
          tweets.map((tweet) => (
            <Tweet
              key={tweet._id}
              tweet={tweet}
              loggedInUser={loggedInUser}
              onEdit={handleEdit}
              setIsTweetChange={setIsTweetChange}
            />
          ))
        ) : (
          <p>No tweets available</p>
        )}
      </div>
    </div>
  );
}

export default UserPage;
