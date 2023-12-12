import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

const Tweet = ({ tweet, loggedInUser, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(tweet.content);
  const isEditable = loggedInUser && tweet.username === loggedInUser.username;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    try {
      const token = localStorage.getItem("userToken");
      console.log("check token: ", token);
      console.log("check link: ", `http://localhost:3500/api/tweet/id/${tweet._id}`);
      
      axios
        .put(`http://localhost:3500/api/tweet/id/${tweet._id}`, {
          content: editedContent,
        })
        .then(() => {
          // Notify the parent component about the edit
          onEdit({ ...tweet, content: editedContent });
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Error updating tweet:", error);
        });
    } catch (error) {
      console.error("Error updating tweet:", error);
    }
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(tweet.content);
  };

  return (
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
