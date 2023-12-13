import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import "../styling/Tweet.css";


const Tweet = ({ tweet, loggedInUser, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const isEditable = loggedInUser && tweet.username === loggedInUser.username;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`api/tweet/id/${tweet._id}`, {
        content: editedContent,
      });

      // Check if the response status is within the success range (e.g., 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Notify the parent component about the edit
        onEdit({ ...tweet, content: editedContent });
        setIsEditing(false);
      } else {
        // Handle non-successful response
        console.error(
          "Error updating tweet. Server returned:",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error updating tweet:", error.message);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(tweet.content);
  };

  return (
    <Link to={`/user/${tweet.username}`} className="tweet-link">
      {" "}
      {/* Use Link to wrap the entire div */}
      <div className="tweet">
        <p>{tweet.username}</p>
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
            cols={50}
          />
        ) : (
          <p>{tweet.content}</p>
        )}
        <p>{tweet.createdTime}</p>
        {isEditable && (
          <div>
            {isEditing ? (
              <>
                <button onClick={handleSaveClick} className="save-button">
                  Save
                </button>
                <button onClick={handleCancelClick} className="cancel-button">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={handleEditClick} className="edit-button">
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

Tweet.propTypes = {
  tweet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdTime: PropTypes.string.isRequired,
  }).isRequired,
  loggedInUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  onEdit: PropTypes.func,
};

export default Tweet;
