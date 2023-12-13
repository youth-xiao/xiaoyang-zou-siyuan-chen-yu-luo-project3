import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styling/Login.css";

const SignUp = ({ handleSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    const result = await handleSignUp(username, password);
    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={onSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}
        <div className="input-container">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="sign-up-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

SignUp.propTypes = {
  handleSignUp: PropTypes.func.isRequired,
};

export default SignUp;
