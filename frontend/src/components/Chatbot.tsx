import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/_chatbot.scss';
import { Bot, XIcon, Send, Trash2, Minimize2, Wifi, WifiOff } from 'lucide-react';
import { useChatbot } from '../hooks/chatbot/useChatbot';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the custom hook for chatbot functionality
  const { messages, isLoading, sendMessage, clearMessages } = useChatbot();

  // Check backend connection status
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/chatbot/health`);
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch {
        setBackendStatus('disconnected');
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const minimizeChatbot = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageText = inputValue.trim();
    setInputValue('');
    await sendMessage(messageText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <>
      <div className="chatbot-fab" onClick={toggleChatbot}>
        <Bot size={28} />
        {messages.length > 1 && (
          <div className="message-indicator">
            {messages.length - 1}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-backdrop" onClick={toggleChatbot}></div>
          <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>
            <div className="chatbot-header">
              <div className="header-info">
                <Bot size={20} />
                <span>AstroBot Assistant</span>
                <div className={`status-indicator ${backendStatus}`} title={
                  backendStatus === 'connected' ? 'Connected to AI backend' :
                    backendStatus === 'disconnected' ? 'Using local responses (backend offline)' :
                      'Checking connection...'
                }>
                  {backendStatus === 'connected' && <Wifi size={12} />}
                  {backendStatus === 'disconnected' && <WifiOff size={12} />}
                </div>
              </div>
              <div className="header-actions">
                <button className="action-btn" onClick={clearMessages} title="Clear chat">
                  <Trash2 size={16} />
                </button>
                <button className="action-btn" onClick={minimizeChatbot} title="Minimize">
                  <Minimize2 size={16} />
                </button>
                <button className="close-btn" onClick={toggleChatbot} title="Close">
                  <XIcon size={20} />
                </button>
              </div>
            </div>

            {!isMinimized && (
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
                      <div className="message-time">{formatTime(message.timestamp)}</div>
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
                      className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      title="Send message"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <div className="input-hint">
                    Press Enter to send, or click the send button
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
