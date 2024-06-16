import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import SideDrawer from "./SIdeDrawer";

const socket = io("http://localhost:3000", {
  query: {
    userId: localStorage.getItem("userId"),
  },
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    socket.on("privateMessage", (data) => {
      console.log("Private message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("users", (userList) => {
      console.log("Users connected:", userList);
      setUsers(userList);
    });

    return () => {
      socket.off("privateMessage");
      socket.off("users");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && recipientId.trim()) {
      console.log("Sending private message:", {
        senderId: userId,
        recipientId,
        message,
      });
      socket.emit("privateMessage", { senderId: userId, recipientId, message });
      setMessage("");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <SideDrawer users={users} setRecipientId={setRecipientId} />
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>Chat App</h1>
        <div>
          <input
            type="text"
            placeholder="Recipient ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button
            onClick={sendMessage}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Send
          </button>
        </div>
        <div>
          <h2>Messages</h2>
          <div id="messages" style={{ marginTop: "20px" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
              >
                <strong>{msg.senderId}:</strong> {msg.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
