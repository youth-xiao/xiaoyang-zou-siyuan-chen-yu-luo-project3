import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styling/Login.css";

const Login = ({ handleLogin, setIsLoggedIn, setCurrentUser }) => {
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
        const result = await handleLogin(username, password);
        if (result.success) {
            localStorage.setItem("userToken", result.token); // Save the token
            setIsLoggedIn(true); // Update login state
            setCurrentUser({ username: username }); // Update current user
            navigate("/");
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
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>

                <div className="input-container">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" className="login-button">
                    Login
                </button>
            </form>
        </div>
    );
};

Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    setIsLoggedIn: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
};

export default Login;
