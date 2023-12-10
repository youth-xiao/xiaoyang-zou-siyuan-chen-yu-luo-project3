import PropTypes from "prop-types";

const Tweet = ({ tweet }) => {
  return (
    <div className="tweet">
      <p>{tweet.username}</p>
      <p>{tweet.content}</p>
      <p>{tweet.createdTime}</p>
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
};

export default Tweet;