import React, { useRef, useEffect } from "react";
import "../styles/components/_chatbot.scss";
import { XIcon, Rocket, Trash2 } from "lucide-react";
import { useChatbot } from "../hooks/chatbot/useChatbot";
import { useChatbotContext } from "../contexts/ChatbotContext";
import chatbot from "../../src/assets/chatbot.png";

const Chatbot: React.FC = () => {
  const { isOpen, toggleChatbot } = useChatbotContext();
  const [inputValue, setInputValue] = React.useState("");
  const [backendStatus, setBackendStatus] = React.useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the custom hook for chatbot functionality
  const { messages, isLoading, sendMessage, clearMessages } = useChatbot();

  // Check backend connection status
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/chatbot/health`);
        if (response.ok) {
          setBackendStatus("connected");
        } else {
          setBackendStatus("disconnected");
        }
      } catch {
        setBackendStatus("disconnected");
      }
    };

    checkBackendConnection();
    // Check every 30 seconds
    const interval = setInterval(checkBackendConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue("");
    await sendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <>
      <div className="chatbot-fab" onClick={toggleChatbot}>
        <img src={chatbot} alt="Chatbot" className="chatbot-fab-icon" />
        {messages.length > 1 && (
          <div className="message-indicator">{messages.length - 1}</div>
        )}
      </div>

      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-backdrop" onClick={toggleChatbot}></div>

          {/* Status indicator in top-left */}
          <div className="chatbot-status">
            <div className={`status-dot ${backendStatus}`}></div>
            <span>
              {backendStatus === "connected"
                ? "AI Connected"
                : backendStatus === "disconnected"
                ? "Local Mode"
                : "Connecting..."}
            </span>
          </div>

          {/* Control buttons in top-right */}
          <div className="chatbot-controls">
            <button
              className="control-btn delete-btn"
              onClick={clearMessages}
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>
            <button
              className="control-btn"
              onClick={toggleChatbot}
              title="Close"
            >
              <XIcon size={18} />
            </button>
          </div>

          <div className="chatbot-window">
            <>
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.sender}`}>
                    <div className="message-content">
                      {message.isTyping ? (
                        <div className="typing-indicator">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      ) : (
                        <div className="message-text">{message.text}</div>
                      )}
                    </div>
                    <div className="message-time">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-input-area">
                <div className="input-container">
                  <input
                    ref={inputRef}
                    type="text"
                    className="chatbot-input"
                    placeholder="Ask me about space, satellites, or STELLARION..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <button
                    className={`send-btn ${inputValue.trim() ? "active" : ""}`}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    title="Send message"
                  >
                    <Rocket size={24} />
                  </button>
                </div>
                <div className="input-hint">
                  Press Enter to send, or click the send button
                </div>
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
