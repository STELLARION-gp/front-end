import React, { useState } from 'react';
import '../styles/components/_chatbot.scss';
import { Bot, XIcon } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="chatbot-fab" onClick={toggleChatbot}>
        <Bot size={28} />
      </div>

      {isOpen && (
        <div className="chatbot-modal">
          <div className="chatbot-backdrop" onClick={toggleChatbot}></div>
          <div className="chatbot-window">
            <div className="chatbot-header">
              <span>AstroBot Assistant</span>
              <button className="close-btn" onClick={toggleChatbot}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="chatbot-content">
              <p>👋 How can I help you today?</p>
              <input
                type="text"
                className="chatbot-input"
                placeholder="Type your question..."
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
