import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import UserPage from "./components/UserPage";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  async function handleLogin(username, password) {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      console.log("check data", data);
      setIsLoggedIn(true);
      setCurrentUser({ username });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }


  async function handleSignUp(username, password) {
    try {
      const response = await fetch("/api/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      Cookies.set("username", username, { expires: 1 });
      setIsLoggedIn(true);
      setCurrentUser({ username });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser({});
    Cookies.remove("username");
  };

  useEffect(() => {
    const username = Cookies.get("username");
    if (username) {
      setIsLoggedIn(true);
      setCurrentUser({ username });
    } else {
      setIsLoggedIn(false);
      setCurrentUser({});
    }
  }, []);

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        username={currentUser.username}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login
              handleLogin={handleLogin}
              setIsLoggedIn={setIsLoggedIn}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path="/register"
          element={<SignUp handleSignUp={handleSignUp} />}
        />
        <Route path="/user/:username" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
