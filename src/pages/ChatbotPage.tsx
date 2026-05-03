import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Trash2, ShieldAlert } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { askGemini, detectFakeNews } from "../services/geminiService";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  isFakeNewsAnalysis?: boolean;
  analysis?: any;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "model", text: "Hello! I'm CivicGuide AI. How can I help you understand the election process today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const responseText = await askGemini(input, messages.map(m => ({ role: m.role, parts: m.text })));
    
    const botMsg: Message = { id: (Date.now() + 1).toString(), role: "model", text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleFakeNewsAnalysis = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const analysis = await detectFakeNews(input);
    
    const botMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      role: "model", 
      text: "I've analyzed that claim for you. Here is what I found:",
      isFakeNewsAnalysis: true,
      analysis
    };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="py-8 h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-[#111827]">
          <Bot className="text-[#F27D26]" /> AI Civic Assistant
        </h1>
        <p className="text-gray-400 text-sm">Ask questions or paste news for fact-checking.</p>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white border border-gray-100 rounded-3xl shadow-lg">
        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shrink-0",
                  msg.role === "user" ? "bg-[#F27D26] text-white" : "bg-gray-100 text-gray-500"
                )}>
                  {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={cn(
                  "p-4 rounded-3xl leading-relaxed text-sm md:text-base",
                  msg.role === "user" ? "bg-[#F27D26]/10 border border-[#F27D26]/20 text-[#111827]" : "bg-gray-50 border border-gray-100 text-[#111827]"
                )}>
                  <div className="prose prose-slate max-w-none prose-sm md:prose-base">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  
                  {msg.isFakeNewsAnalysis && msg.analysis && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 p-4 rounded-2xl bg-white border border-gray-200 space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Trust Score</span>
                        <span className={cn(
                          "text-lg font-bold",
                          msg.analysis.trustScore > 70 ? "text-green-600" : msg.analysis.trustScore > 40 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {msg.analysis.trustScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            msg.analysis.trustScore > 70 ? "bg-green-500" : msg.analysis.trustScore > 40 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${msg.analysis.trustScore}%` }}
                        />
                      </div>
                      <p className="text-sm italic text-gray-600">{msg.analysis.summary}</p>
                      {msg.analysis.biases && (
                         <div className="flex flex-wrap gap-2 pt-2">
                           {msg.analysis.biases.map((b: string) => (
                             <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-400 uppercase">
                               {b}
                             </span>
                           ))}
                         </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-2 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
            <div className="flex gap-2">
                <button 
                    onClick={() => setMessages([{ id: Date.now().toString(), role: "model", text: "Chat cleared. How else can I help?" }])}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear chat"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="text-[10px] text-gray-400 flex items-center gap-1 uppercase tracking-tighter font-bold">
                <ShieldAlert size={12} className="text-[#F27D26]" /> Powered by Gemini
            </div>
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about voting registration, candidates, or paste news..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F27D26]/20 focus:border-[#F27D26] transition-all resize-none pr-32"
            />
            <div className="absolute right-2 flex gap-1">
                <button
                    onClick={handleFakeNewsAnalysis}
                    disabled={isTyping || !input.trim()}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all disabled:opacity-50 text-[10px] font-bold uppercase px-3 shadow-sm border border-blue-100"
                >
                    Fact Check
                </button>
                <button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="p-2 bg-[#F27D26] hover:bg-[#FF8B3D] text-white rounded-xl transition-all disabled:opacity-50 shadow-md transform hover:scale-105 active:scale-95"
                >
                    <Send size={18} />
                </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-3">
             CivicGuide AI can make mistakes. Verify important information with local election authorities.
          </p>
        </div>
      </div>
    </div>
  );
}
