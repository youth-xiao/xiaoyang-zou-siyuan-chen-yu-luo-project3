import React, { useState } from "react";
import axios from "axios";
import "../styling/TweetForm.css";

const TweetForm = ({ setIsTweetChange }) => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("/api/tweet", { content });
      setIsTweetChange((prevCount) => prevCount + 1);
      setContent(""); // Clear the input field after successful submission
      setErrorMessage("");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <label htmlFor="content">Tweet:</label>
          <div className="input-container">
            <input
              type="text"
              id="content"
              value={content}
              onChange={handleInputChange}
              required
              placeholder="What's happening?"
              style={{ width: "400px", height: "200px" }}
            />
          </div>
        </div>

        <button type="submit">Create Tweet</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default TweetForm;
