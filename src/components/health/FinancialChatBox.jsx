import React, { useState, useRef, useEffect } from 'react';
import './FinancialChatBox.css';

/**
 * FinancialChatBox - Chat with AI about finances
 */
const FinancialChatBox = ({ onChat, loading, score }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '💬 Hi! I\'m your financial advisor. Ask me anything about improving your finances!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Get AI response
    try {
      const response = await onChat(input);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: '❌ Sorry, I couldn\'t process that. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="chat-fab">
        <button
          className="fab-button"
          onClick={() => setIsOpen(true)}
          title="Chat with AI"
        >
          💬
        </button>
      </div>
    );
  }

  return (
    <div className="financial-chatbox">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>Financial Advisor</h3>
          <span className="status-indicator">
            {score && `Score: ${score}/100`}
          </span>
        </div>
        <button
          className="close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.type}`}>
            <div className="message-avatar">
              {msg.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <p className="message-text">{msg.text}</p>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about your finances..."
          disabled={loading}
          rows="2"
          className="chat-input"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="send-btn"
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default FinancialChatBox;
