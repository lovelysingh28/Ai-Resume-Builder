// src/components/ChatBot/useChatBot.js

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const useChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(input);
      const botReply = result.response.text();

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, input, setInput, sendMessage, loading };
};

export default useChatBot;