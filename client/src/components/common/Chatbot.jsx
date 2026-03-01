import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = "AIzaSyCb8-MGlU6y-y9FG_kXUVt1Ax5p03XOQOg";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hello! I'm your City Assistant. How can I help you today?" }
  ]);
  
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new message or when typing starts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const quickPrompts = [
    { label: "🚰 Water Leak", text: "I want to report a water leakage." },
    { label: "💡 No Power", text: "There is a power outage in my area." },
    { label: "🗑️ Garbage", text: "Garbage has not been collected in my street." },
    { label: "🛣️ Pothole", text: "There is a dangerous pothole on the main road." }
  ];

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isTyping) return;

    // 1. Add User Message to UI
    setMessages((prev) => [...prev, { role: "user", text: messageText }]);
    setInput("");
    setIsTyping(true); // Show WhatsApp typing animation

    // 2. Get Logged-in User Data
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    let botFinalText = "I have noted your concern and informed the department.";
    let success = false;

    try {
      // 3. AI Categorization & Response Logic
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ 
              parts: [{ 
                text: `Context: City Management System. User says: "${messageText}". 
                Reply in 1 short helpful sentence. Identify the department: Water, Electricity, Waste, or Municipal.` 
              }] 
            }]
          })
        }
      );

      const data = await response.json();
      if (response.ok && data.candidates) {
        botFinalText = data.candidates[0].content.parts[0].text;
        success = true;
      }
    } catch (err) {
      console.error("AI Error:", err);
    }

    // 4. WhatsApp Style Delay (Simulate thinking)
    setTimeout(async () => {
      setMessages((prev) => [...prev, { role: "model", text: botFinalText }]);
      setIsTyping(false);

      // 5. AUTO-SYNC WITH BACKEND
      // This sends the data to your server.js /api/complaints/ai-submit route
      if (storedUser.phoneNumber) {
        try {
          const dept = botFinalText.includes("Water") ? "Water" : 
                       botFinalText.includes("Electricity") ? "Electricity" : 
                       botFinalText.includes("Waste") ? "Waste" : "Municipal";

          await fetch('http://localhost:5000/api/complaints/ai-submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: storedUser.phoneNumber,
              description: messageText,
              dept: dept,
              category: "AI Chatbot"
            })
          });
        } catch (e) {
          console.log("Backend sync failed, check if server is running.");
        }
      }
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, y: 100, filter: "blur(10px)" }}
            className="mb-4 w-[380px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Premium Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative shrink-0">
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-4 border-blue-600 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight tracking-tight">Nagar-Setu AI</h3>
                  <p className="text-[11px] text-blue-100 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Online & Ready
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto bg-[#F8FAFC] space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-3xl text-[13.5px] shadow-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none shadow-blue-100 font-medium' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-normal'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* WhatsApp-style Typing Animation */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div 
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay }}
                        className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer with Quick Access & Input */}
            <div className="p-5 bg-white border-t border-slate-50 space-y-4">
              
              {/* Quick Access Chips */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {quickPrompts.map((chip, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ y: -2, backgroundColor: "#EFF6FF" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage(chip.text)}
                    className="bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold py-2.5 px-4 rounded-xl whitespace-nowrap transition-colors"
                  >
                    {chip.label}
                  </motion.button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-1.5 border border-transparent focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 ring-blue-50 transition-all">
                <input 
                  className="flex-1 bg-transparent border-none py-2 text-[14px] outline-none text-slate-700 placeholder:text-slate-400 font-medium" 
                  placeholder="Tell me about an issue..." 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSendMessage()}
                  className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button 
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)} 
        className="w-16 h-16 bg-blue-600 rounded-2xl shadow-[0_15px_40px_-10px_rgba(37,99,235,0.6)] flex items-center justify-center relative border-b-4 border-blue-800 transition-all"
      >
        <span className="text-3xl text-white">💬</span>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-4 border-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
      </motion.button>
    </div>
  );
};

export default Chatbot;