import "../styling/Home.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Tweet from "./Tweet";

const Home = () => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await axios.get("http://localhost:3500/api/tweet/");
        const sortedTweets = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTweets(sortedTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };
    fetchedData();
  }, []);

  return (
    <div className="home-container">
      <h1>Twitter Home Page</h1>
      <div className="tweets-container">
        {tweets.map((tweet) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default Home;
