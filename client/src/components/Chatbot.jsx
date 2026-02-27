import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Minus, Maximize2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini API Configuration
const API_KEY = "AIzaSyDsBPaPGLsRr9FXNop3EgLpSwzvc-w_5wA";
const genAI = new GoogleGenerativeAI(API_KEY);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: "model", 
      parts: [{ text: "Hi there! I'm your 10xCoders assistant. How can I help you level up your coding career today?" }] 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: {
          parts: [{
            text: `You are a helpful assistant for "10xCoders", an all-in-one platform for developers to learn, practice, and advance their careers. 
            Focus on these features:
            - Kanban Board: Organize tasks and manage projects.
            - Career Agent: Personalized career advice and job matches.
            - Personalized Roadmaps: Custom learning paths.
            - Courses: Structured learning modules.
            - Resume Maker: Tech-focused resume creation.
            - Resume Enhancer: AI-powered resume feedback.
            - Interview Preparation: Practice with real tech interview questions.
            - Typing Speed Enhancer: Coding-specific typing practice.
            - Coding Practice: Real-world coding challenges.
            
            Keep your responses concise, professional, and encouraging. IMPORTANT: Do not use any markdown formatting like bolding (**) or bullet points (*) in your response. Use plain text only. If asked about things outside of 10xCoders, politely redirect to how 10xCoders can help with their tech journey.`
          }]
        }
      });
      
      // Gemini API history must start with a 'user' message.
      // Filter out the initial 'model' greeting if it's the first message.
      const chatHistory = messages.filter((msg, index) => 
        index === 0 && msg.role === "model" ? false : true
      );

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: "model", parts: [{ text }] }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { role: "model", parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white transition-shadow"
          >
            <MessageSquare size={30} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">10x Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] opacity-80 uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                  <Minus size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === "user" 
                        ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.parts[0].text.replace(/\*/g, "")}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-600" />
                    <span className="text-xs text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-gray-700"
                />
                <button
                  disabled={!input.trim() || isLoading}
                  onClick={handleSendMessage}
                  className={`absolute right-1.5 p-2 rounded-lg transition-all ${
                    input.trim() && !isLoading 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-gray-400">
                Powered by Gemini 2.0 Flash
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
