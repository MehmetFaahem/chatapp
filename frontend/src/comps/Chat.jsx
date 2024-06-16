import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import SideDrawer from "./SideDrawer";
import "../App.css";

const socket = io("http://localhost:3000", {
  query: {
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
  },
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    socket.on("privateMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("users", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("connect");
      socket.off("privateMessage");
      socket.off("users");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && recipientId.trim()) {
      const msg = {
        senderId: userId,
        senderName: userName,
        recipientId,
        message,
        timestamp: new Date(),
      };
      socket.emit("privateMessage", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
      setMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredUsers = users.filter((user) => user.userId !== userId);

  return (
    <div className="container">
      <SideDrawer users={filteredUsers} setRecipientId={setRecipientId} />
      <div className="chat-window">
        <h1>Chat with {recipientId}</h1>
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.senderId === userId ? "own" : "other"}`}
            >
              <div>
                <strong>{msg.senderName}:</strong> {msg.message}
              </div>
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
