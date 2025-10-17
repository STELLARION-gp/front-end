import React, { useState } from "react";
import "../../styles/components/learner/GuideLearnerChat.scss";
import { Send } from "lucide-react";

interface Message {
  text: string;
  sender: "learner" | "guide";
}

interface GuideLearnerChatProps {
  onClose: () => void;
}

const GuideLearnerChat: React.FC<GuideLearnerChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your guide for the Astronomy session.", sender: "guide" },
    { text: "Hi! When does the session start?", sender: "learner" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim() === "") return;

    const updatedMessages: Message[] = [...messages, { text: newMessage, sender: "learner" }];
    setMessages(updatedMessages);
    setNewMessage("");
  };

  return (
    <div className="guide-learner-chat-wrapper">
      <div className="guide-learner-chat-header">
        <h3>Guide Chat</h3>
        <button className="close-chat-btn" onClick={onClose}>×</button>
      </div>
      <div className="guide-learner-chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`guide-learner-chat-message ${msg.sender === "learner" ? "learner" : "guide"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="guide-learner-chat-input-area">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default GuideLearnerChat;
