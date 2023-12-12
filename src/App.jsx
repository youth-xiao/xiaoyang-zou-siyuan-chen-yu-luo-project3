import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import UserPage from "./components/UserPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const handleLogin = async (username, password) => {
    // Here, you would send the 'username' and 'password' to your backend server for verification.
    // This is where you'd make an API call, for example:
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    console.log("Login Server Response:", data);
    if (data.success) {
      setIsLoggedIn(true);
      setCurrentUser({
        username: data.username,
        // ...other user data
      });
      // Save the token to localStorage or cookies
      localStorage.setItem("userToken", data.token);
      // ... further actions like redirecting the user or storing the session
    } else {
      // Handle login failure (e.g., incorrect credentials, user not found, etc.)
    }
  };

  const handleSignUp = async (username, password) => {
    // Similar to handleLogin, make an API call to register the user
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    console.log("Signup Server Response:", data);
    if (data.success) {
      setIsLoggedIn(true);
      setCurrentUser({
        username: data.username,
      });
      // Save the token to localStorage or cookies
      localStorage.setItem("userToken", data.token);
      // Redirect the user to the home page or dashboard
    } else {
      // Handle registration failure (e.g., username already exists, etc.)
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    localStorage.removeItem("userToken"); // Clear the session token from storage
    // Redirect to the login page or home page as needed
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    console.log("Token retrieved from localStorage:", token);
    if (token) {
      // Perform token validation and set user state
      setIsLoggedIn(true);
      // Fetch user data using the token or decode it if JWT
      // setCurrentUser(...)
    }
  }, []);

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        username={currentUser.username}
      />
      <Routes>
        <Route
          path="/home"
          element={<Home userToken={localStorage.getItem("userToken")} />}
        />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route
          path="/register"
          element={<SignUp handleSignUp={handleSignUp} />}
        />
        <Route path="/userPage" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
