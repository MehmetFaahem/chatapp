import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../App.css";
import { jwtDecode } from "jwt-decode";
import Icon from "../assets/react.png";

const Chat = ({ token }) => {
  const [inputHeight, setInputHeight] = useState("auto");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  if (!token) {
    throw new Error("No token found");
  }

  const decodedToken = jwtDecode(token);
  const [activeUsers, setActiveUsers] = useState([]);
  const currentUser = decodedToken.userId;

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get(
          `https://belabosh.onrender.com/users/active/${currentUser}`
        );
        setActiveUsers(response.data);
      } catch (error) {
        console.error("Error fetching active users", error);
      }
    };

    fetchActiveUsers();
  }, [currentUser]);

  useEffect(() => {
    socketRef.current = io("https://belabosh.onrender.com", {
      query: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server");
    });

    socketRef.current.on("users", (users) => {
      setUsers(users);
    });

    socketRef.current.on("privateMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      // Show notification
      if (
        message.senderId !== decodedToken.userId &&
        Notification.permission === "granted"
      ) {
        new Notification(`New message from ${message.senderName}`, {
          body: message.message,
          icon: Icon,
        });
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  // Request notification permission when the component mounts
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        const response = await axios.get(
          `https://belabosh.onrender.com/messages/${selectedUser.userId}/${decodedToken.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      }
    };
    fetchMessages();
  }, [selectedUser, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      const message = {
        senderId: socketRef.current.id,
        senderName: decodedToken.userId, // Your username
        recipientId: selectedUser.userId,
        message: newMessage,
        timestamp: new Date(),
      };
      socketRef.current.emit("privateMessage", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      await setInputHeight("20px");
      setNewMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setInputHeight("20px");
      handleSendMessage();
    }
  };

  return (
    <div className="container">
      <div className="side-drawer">
        <h1>{decodedToken.userName.toUpperCase()}</h1>
        <h2>Active Users</h2>
        <ul>
          {activeUsers.map((user) => (
            <li
              key={user.userId}
              onClick={() => {
                setSelectedUser(user);
                console.log(user);
              }}
              style={{
                backgroundColor:
                  user?.userId === selectedUser?.userId ? "gray" : "white",
                padding: "20px",
                color:
                  user?.userId === selectedUser?.userId ? "white" : "black",
              }}
            >
              {user.userId.replace("@gmail.com", "").charAt(0).toUpperCase() +
                user.userId.replace("@gmail.com", "").slice(1)}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        <div className="messages">
          {messages

            .filter(
              (mes) =>
                mes.senderName === decodedToken.userId ||
                selectedUser.email === mes.senderName
            )
            // .filter((mes) => selectedUser.email === mes.senderName)
            .map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.senderName === decodedToken.userId ? "own" : "other"
                }`}
              >
                <div className="message-content">
                  <strong>{message.senderName}: </strong> {message.message}
                  <div className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <textarea
            value={newMessage}
            onChange={(e) => {
              setInputHeight("auto");
              setNewMessage(e.target.value);
            }}
            onPaste={() => setInputHeight("auto")}
            placeholder="Type a message"
            onKeyDown={handleKeyPress}
            style={{
              height: inputHeight,
              resize: "none",
              overflowY: "scroll",
              overflowX: "hidden",
              maxHeight: "200px",
            }}
            rows="1"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
