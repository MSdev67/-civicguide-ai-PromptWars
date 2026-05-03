import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, Scale } from "lucide-react";
import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { cn } from "../../lib/utils";

interface Candidate {
  id: string;
  name: string;
  party: string;
  role: string;
  platform: string;
  bio: string;
}

interface ComparisonModalProps {
  candidates: [Candidate, Candidate];
  isOpen: boolean;
  onClose: () => void;
}

export function ComparisonModal({ candidates, isOpen, onClose }: ComparisonModalProps) {
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && candidates[0] && candidates[1]) {
      generateComparison();
    }
  }, [isOpen]);

  const generateComparison = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Compare these two political candidates for an election in India:
      
      Candidate 1: ${candidates[0].name} (${candidates[0].party}) - ${candidates[0].role}. Platform: ${candidates[0].platform}. Bio: ${candidates[0].bio}
      Candidate 2: ${candidates[1].name} (${candidates[1].party}) - ${candidates[1].role}. Platform: ${candidates[1].platform}. Bio: ${candidates[1].bio}
      
      Provide a neutral, factual comparison in Markdown. Focus on:
      - Key policy differences
      - Alignment with constituency needs
      - Summary of their primary focus
      Keep it professional and unbiased. Use bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAnalysis(response.text || "Comparison unavailable.");
    } catch (error) {
      console.error("AI Comparison Error:", error);
      setAnalysis("Could not generate AI comparison at this time.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#F27D26]/10 rounded-xl">
                  <Scale className="text-[#F27D26]" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#111827]">Candidate Comparison</h2>
                  <p className="text-sm text-gray-500">AI-Powered Strategic Analysis</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {candidates.map((c, i) => (
                  <div key={c.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 relative">
                    <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#111827]">{c.name}</h3>
                      <span className={cn(
                        "text-[10px] font-bold px-3 py-1 rounded-full uppercase",
                        c.party === "BJP" ? "bg-orange-100 text-orange-600" :
                        c.party === "INC" ? "bg-blue-100 text-blue-600" :
                        "bg-green-100 text-green-600"
                      )}>
                        {c.party}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{c.platform}"</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#F27D26] font-bold uppercase tracking-widest text-xs">
                  <Sparkles size={16} /> 
                  Gemini AI Insights
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                    <Loader2 className="animate-spin text-[#F27D26]" size={40} />
                    <p className="font-medium animate-pulse">Analyzing platforms and history...</p>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
                    <div className="whitespace-pre-wrap">{analysis}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                AI analysis is based on available public data and may not reflect real-time changes.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
