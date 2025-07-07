import React, { useState } from "react";
import "../../styles/components/learner/Chat.scss";
import Button from "../Button";

interface ChatProps {
  guideName: string;
}

const Chat: React.FC<ChatProps> = ({ guideName }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "You", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">Chat with {guideName}</div>
      <div className="chat-messages">
        {messages.length === 0 && <div className="chat-placeholder">No messages yet.</div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender === "You" ? "user" : "guide"}`}>
            <span className="chat-sender">{msg.sender}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        <Button variant="secondary" onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default Chat;
