import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SystemMessage = {
  id: 1,
  body: "Welcome to the Nest Chat app",
  author: "Bot",
};

// create a new socket instance with localhost URL
const socket = io('http://localhost:3000', {
     autoConnect: false, 
     extraHeaders:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
     }
    }
);

function Chat({ currentUser, onLogout }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([SystemMessage]);

  // useEffect(() => {
  //   socket.connect(); // connect to socket

  //   socket.on("connect", () => { // fire when we have connection
  //     console.log("Socket connected");
  //   });

  //   socket.on("disconnect", () => { // fire when socked is disconnected
  //     console.log("Socket disconnected");
  //   });

  //   // listen chat event messages
  //   socket.on("chat", (newMessage) => {
  //     console.log("New message added", newMessage);
  //     setMessages((previousMessages) => [...previousMessages, newMessage]);
  //   });

  //   // remove all event listeners
  //   return () => {
  //     socket.off("connect");
  //     socket.off("disconnect");
  //     socket.off("chat");
  //   };
  // }, []);

  const handleSendMessage = (e) => {
    if (e.key !== "Enter" || inputValue.trim().length === 0) return;

    // send a message to the server
    socket.emit("chat", { author: currentUser, body: inputValue.trim() });
    setInputValue("");
  };

  const handleLogout = () => {
    socket.disconnect(); // disconnect when we do logout
    onLogout();
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <span>Nest Chat App</span>
        <button className="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="chat-message-list">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              currentUser === message.author ? "outgoing" : ""
            }`}
          >
            <div className="chat-message-wrapper">
              <span className="chat-message-author">{message.author}</span>
              <div className="chat-message-bubble">
                <span className="chat-message-body">{message.body}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-composer">
        <input
          className="chat-composer-input"
          placeholder="Type message here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;