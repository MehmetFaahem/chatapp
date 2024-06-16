import React, { useState } from "react";
import Chat from "./comps/Chat";
import "./App.css";

const App = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    if (userId.trim() && userName.trim()) {
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      setLoggedIn(true);
    }
  };

  if (loggedIn) {
    return <Chat />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button
          onClick={login}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default App;
