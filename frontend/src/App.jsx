import React, { useState } from "react";
import Chat from "./comps/Chat";

const App = () => {
  const [userId, setUserId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    if (userId.trim()) {
      localStorage.setItem("userId", userId);
      setLoggedIn(true);
    }
  };

  if (loggedIn) {
    return <Chat />;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter your user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button
        onClick={login}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Login
      </button>
    </div>
  );
};

export default App;
