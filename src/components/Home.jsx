import "../styling/Home.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Tweet from "./Tweet";
import TweetForm from "./TweetForm";

const Home = () => {
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [, setEditingTweet] = useState(null);
  const [isTweetChange, setIsTweetChange] = useState(0);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get("api/tweet/");
        const sortedTweets = response.data.sort((a, b) => {
          const dateA = new Date(a.createdTime).getTime();
          const dateB = new Date(b.createdTime).getTime();
          console.log(dateB - dateA);
          return dateB - dateA;
        });
        setTweets(sortedTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    const fetchUser = () => {
      const loggedIn = Cookies.get("username");
      setLoggedInUser(loggedIn);
    };
    fetchedData();
    fetchUser();
  }, [isTweetChange]);

  const handleEdit = (editedTweet) => {
    setEditingTweet(editedTweet);
  };

  return (
    <div className="home-container">
      <h1>Twitter Home Page</h1>
      {loggedInUser === loggedInUser && (
        <TweetForm setIsTweetChange={setIsTweetChange} />
      )}
      <div className="tweets-container">
        {tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            loggedInUser={loggedInUser}
            onEdit={handleEdit}
            setIsTweetChange={setIsTweetChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
