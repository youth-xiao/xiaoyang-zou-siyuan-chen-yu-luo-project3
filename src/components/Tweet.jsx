import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Tweet = ({ tweet, loggedInUser, onEdit }) => {
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

    return (
        <div>
            <div className="tweet">
                <Link to={`/user/${tweet.username}`} className="tweet-link">
                    <p>{tweet.username}</p>
                </Link>
                {isEditing ? <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={3} cols={50} /> : <p>{tweet.content}</p>}
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
