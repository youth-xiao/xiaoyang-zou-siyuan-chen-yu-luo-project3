import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import "../styling/Navbar.css";

const Navbar = ({ isLoggedIn, handleLogout, username }) => {
    const navigate = useNavigate();

    const performLogout = () => {
        handleLogout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/home" className="navbar-link">
                Home
            </Link>

            {isLoggedIn ? (
                <div className="auth-links">
                    <Link className="navbar-link navbar-username" to={`/user/${username}`}>
                        {username}
                    </Link>
                    <button onClick={performLogout} className="navbar-link">
                        Logout
                    </button>
                </div>
            ) : (
                <div className="auth-links">
                    <Link to="/login" className="navbar-link">
                        Log In
                    </Link>
                    <Link to="/register" className="navbar-link">
                        Sign Up
                    </Link>
                </div>
            )}
        </nav>
    );
};

Navbar.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    handleLogout: PropTypes.func.isRequired,
    username: PropTypes.string,
};

export default Navbar;
