import React, { useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./components/Chat";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleRegister = () => {
    window.scrollTo({ bottom: 0, behavior: "smooth" });
    console.log("Going");
  };

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  if (!token) {
    return (
      <div>
        <Register onRegister={handleRegister} />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return <Chat token={token} />;
};

export default App;
