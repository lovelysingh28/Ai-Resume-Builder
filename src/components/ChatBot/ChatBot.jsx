// src/components/ChatBot/ChatBot.jsx
// ============================================================
// UI REDESIGN ONLY — All chatbot logic is untouched.
// Changes: auto-popup on load, premium animations, glassmorphism
// window, modern header with avatar + status, typed bubble styles,
// animated typing indicator, ripple send button, scroll-to-bottom.
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import useChatBot from "./useChatBot"; // ← UNCHANGED: same hook
import "./ChatBot.css";

const ChatBot = () => {
  // UI STATE — new: auto-open on mount + minimize support
  const [isOpen, setIsOpen]       = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const messagesEndRef = useRef(null);

  // ── UNCHANGED: all chatbot logic comes from the hook ──
  const { messages, input, setInput, sendMessage, loading } = useChatBot();

  // [UI] Auto-popup on first page load after 1.2s delay
  useEffect(() => {
    if (!hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened]);

  // [UI] Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  // [UI] Ripple effect on send button click
  const handleRipple = (e) => {
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();
    circle.style.cssText = `
      width:${diameter}px;height:${diameter}px;
      left:${e.clientX - rect.left - radius}px;
      top:${e.clientY - rect.top - radius}px;
      position:absolute;border-radius:50%;
      background:rgba(255,255,255,0.35);
      transform:scale(0);animation:cb-ripple 0.55s linear;
      pointer-events:none;
    `;
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
    sendMessage(); // ← UNCHANGED
  };

  return (
    <>
      {/* ── FLOATING ACTION BUTTON ── */}
      <button
        className={`cb-fab ${isOpen ? "cb-fab--active" : ""}`}
        onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
        aria-label={isOpen ? "Close chat" : "Open AI Assistant"}
      >
        <span className="cb-fab__ring cb-fab__ring--1" />
        <span className="cb-fab__ring cb-fab__ring--2" />

        <span className={`cb-fab__icon ${isOpen ? "cb-fab__icon--hidden" : ""}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className={`cb-fab__icon ${!isOpen ? "cb-fab__icon--hidden" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </span>

        {!isOpen && messages.length === 0 && (
          <span className="cb-fab__badge">1</span>
        )}
      </button>

      {/* ── CHAT WINDOW ── */}
      <div
        className={`cb-window ${isOpen ? "cb-window--open" : ""} ${isMinimized ? "cb-window--minimized" : ""}`}
        role="dialog"
        aria-label="AI Assistant Chat"
      >
        {/* ── HEADER ── */}
        <div className="cb-header">
          <div className="cb-header__glow" />

          <div className="cb-avatar">
            <div className="cb-avatar__img">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.9)"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="cb-avatar__status" />
          </div>

          <div className="cb-header__info">
            <span className="cb-header__name">AI Assistant</span>
            <span className="cb-header__sub">
              <span className="cb-header__dot" />
              Online · Gemini
            </span>
          </div>

          <div className="cb-header__actions">
            <button
              className="cb-ctrl-btn"
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              className="cb-ctrl-btn cb-ctrl-btn--close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── MESSAGES ── */}
        <div className="cb-messages" aria-live="polite">
          {messages.length === 0 && (
            <div className="cb-welcome">
              <div className="cb-welcome__icon">✨</div>
              <p className="cb-welcome__title">Hi there! 👋</p>
              <p className="cb-welcome__sub">Ask me anything about your resume, career, or job applications.</p>
            </div>
          )}

          {/* UNCHANGED: messages from useChatBot hook */}
          {messages.map((msg, i) => (
            <div key={i} className={`cb-bubble-wrap cb-bubble-wrap--${msg.role}`}>
              {msg.role === "bot" && (
                <div className="cb-bubble-avatar">AI</div>
              )}
              <div className={`cb-bubble cb-bubble--${msg.role}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* Animated typing indicator replaces "Typing..." text */}
          {loading && (
            <div className="cb-bubble-wrap cb-bubble-wrap--bot">
              <div className="cb-bubble-avatar">AI</div>
              <div className="cb-bubble cb-bubble--bot cb-typing">
                <span className="cb-typing__dot" />
                <span className="cb-typing__dot" />
                <span className="cb-typing__dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── INPUT AREA ── */}
        <div className="cb-input-area">
          <input
            className="cb-input"
            type="text"
            placeholder="Type your message..."
            value={input}                                          // ← UNCHANGED
            onChange={(e) => setInput(e.target.value)}             // ← UNCHANGED
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}  // ← UNCHANGED
            aria-label="Chat message"
            autoComplete="off"
          />
          <button
            className="cb-send-btn"
            onClick={handleRipple}
            aria-label="Send"
            disabled={!input.trim() || loading}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="white" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBot;