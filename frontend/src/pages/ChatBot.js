import React, { useState, useEffect, useRef } from "react";
import "../styles/ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Hi there! I'm CrowdBot 🤖", 
      options: ["Report Emergency", "Get Help", "Contact Support"],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Refs for animations
  const chatBoxRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle new messages
  useEffect(() => {
    scrollToBottom();
    
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  // Animation effects
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      chatBoxRef.current?.classList.add("animate-in");
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    toggleButtonRef.current?.classList.add("pulse");
    setTimeout(() => {
      toggleButtonRef.current?.classList.remove("pulse");
    }, 1000);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { 
      from: "user", 
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botReply = generateBotReply(input);
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const selectQuickReply = (option) => {
    const userMsg = { 
      from: "user", 
      text: option,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botReply = generateBotReply(option);
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 800);
  };

  const generateBotReply = (msg) => {
    msg = msg.toLowerCase();
    let response = {
      from: "bot",
      timestamp: new Date()
    };

    if (msg.includes("emergency") || msg.includes("report")) {
      return {
        ...response,
        text: "For emergencies, please use the 'Report Emergency' button at the top of the page for immediate assistance. 🚨",
        action: "highlight-emergency"
      };
    } else if (msg.includes("help") || msg.includes("support")) {
      return {
        ...response,
        text: "I can help with:",
        options: ["How to report", "Check status", "Contact team"]
      };
    } else if (msg.includes("contact") || msg.includes("email")) {
      return {
        ...response,
        text: "You can reach our support team at: support@crowdsolve.com 📧"
      };
    } else if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
      return {
        ...response,
        text: "Hello! How can I assist you today? 😊",
        options: ["Report Issue", "Get Help", "Contact Support"]
      };
    } else {
      return {
        ...response,
        text: "I'm still learning. Try asking about emergencies, help, or contact info. 💡",
        options: ["Emergency help", "Contact options", "What can you do?"]
      };
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? "open" : ""}`}>
      <button 
        ref={toggleButtonRef}
        className="chat-toggle"
        onClick={toggleChat}
        aria-label="Chat toggle"
      >
        <div className="chat-icon">💬</div>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
        <div className="toggle-pulse"></div>
      </button>

      {isOpen && (
        <div 
          ref={chatBoxRef}
          className={`chat-box ${isMinimized ? "minimized" : ""}`}
        >
          <div className="chat-header">
            <div className="header-content">
              <div className="bot-avatar">
                <div className="avatar-pulse"></div>
                CB
              </div>
              <div className="header-text">
                <h3>CrowdBot Assistant</h3>
                <p className="status">
                  {isTyping ? (
                    <span className="typing-indicator">
                      <span>•</span>
                      <span>•</span>
                      <span>•</span>
                    </span>
                  ) : (
                    "Online"
                  )}
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="minimize-btn"
                onClick={minimizeChat}
                aria-label="Minimize chat"
              >
                −
              </button>
              <button 
                className="close-btn"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          </div>

          <div className="chat-body">
            <div className="welcome-message">
              <p>Welcome to CrowdSolve support!</p>
              <p>How can I help you today?</p>
            </div>

            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`chat-message ${msg.from}`}
                data-timestamp={formatTime(msg.timestamp)}
              >
                {msg.from === "bot" && (
                  <div className="bot-marker"></div>
                )}
                <div className="message-content">
                  {msg.text}
                  {msg.options && (
                    <div className="quick-replies">
                      {msg.options.map((option, idx) => (
                        <button
                          key={idx}
                          className="quick-reply"
                          onClick={() => selectQuickReply(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.from === "user" && (
                  <div className="user-marker"></div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="chat-message bot typing">
                <div className="bot-marker"></div>
                <div className="typing-indicator">
                  <span>•</span>
                  <span>•</span>
                  <span>•</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <div className="input-container">
              <input
                type="text"
                value={input}
                placeholder="Type your message..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button 
                className="send-btn"
                onClick={sendMessage}
                disabled={!input.trim()}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
            <div className="footer-note">
              CrowdBot v2.1 • Powered by CrowdSolve
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;