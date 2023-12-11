import PropTypes from "prop-types";

const Tweet = ({ tweet, onEdit }) => {
  return (
    <div className="tweet">
      <p>{tweet.username}</p>
      <p>{tweet.content}</p>
      <p>{tweet.createdTime}</p>
      {onEdit && (
        <button onClick={() => onEdit(tweet)} className="edit-button">
          Edit
        </button>
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
  onEdit: PropTypes.func,
};

export default Tweet;