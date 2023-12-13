import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

const Tweet = ({ tweet, loggedInUser, onEdit, token }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(tweet.content);
    const isEditable = loggedInUser && tweet.username === loggedInUser.username;

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            console.log("check token: ", token);
            console.log("check link: ", `http://localhost:3500/api/tweet/id/${tweet._id}`);

            const response = await axios.put(
                `http://localhost:3500/api/tweet/id/${tweet._id}`,
                {
                    content: editedContent,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Check if the response status is within the success range (e.g., 200-299)
            if (response.status >= 200 && response.status < 300) {
                // Notify the parent component about the edit
                onEdit({ ...tweet, content: editedContent });
                setIsEditing(false);
            } else {
                // Handle non-successful response
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
        <div className="tweet">
            <p>{tweet.username}</p>
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
    token: PropTypes.string.isRequired,
};

export default Tweet;
