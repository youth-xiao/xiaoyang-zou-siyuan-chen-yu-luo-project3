import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styling/Tweet.css";

const Tweet = ({ tweet, loggedInUser, onEdit, setIsTweetChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(tweet.content);
    const isEditable = loggedInUser && tweet.username === loggedInUser;

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put(`api/tweet/id/${tweet._id}`, {
                content: editedContent,
            });

            if (response.status >= 200 && response.status < 300) {
                onEdit({ ...tweet, content: editedContent });
                setIsEditing(false);
                setIsTweetChange((prevCount) => prevCount + 1);
            } else {
                console.error("Error updating tweet. Server returned:", response.status);
            }
        } catch (error) {
            console.error("Error updating tweet:", error.message);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedContent(tweet.content);
    };

    const handleDeleteClick = async () => {
        try {
            await axios.delete(`/api/tweet/id/${tweet._id}`);
            setIsTweetChange((prevCount) => prevCount + 1);
        } catch (error) {
            console.error("Error deleting tweet:", error.message);
        }
    };

    return (
        <div className="tweet-wrapper">
            <div className="tweet">
                <Link to={`/user/${tweet.username}`} className="tweet-link">
                    <p className="tweet-username">{tweet.username}</p>
                </Link>
                {isEditing ? <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={3} cols={50} /> : <p>{tweet.content}</p>}
                <p className="tweet-time">{tweet.createdTime}</p>
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
                            <>
                                <button onClick={handleEditClick} className="edit-button">
                                    Edit
                                </button>
                                <button onClick={handleDeleteClick} className="delete-button">
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
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
    loggedInUser: PropTypes.string,
    onEdit: PropTypes.func,
};

export default Tweet;