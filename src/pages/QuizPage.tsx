import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Trophy, RefreshCcw, ChevronRight, Check, X } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";

const quizQuestions = [
  {
    question: "What is the minimum age to vote in elections in India?",
    options: ["16", "18", "21", "25"],
    answer: 1,
    explanation: "The 61st Amendment to the Constitution of India lowered the voting age from 21 to 18 in 1988."
  },
  {
    question: "How long is the term of a member of the Lok Sabha?",
    options: ["2 years", "4 years", "5 years", "6 years"],
    answer: 2,
    explanation: "Members of the Lok Sabha (House of the People) are elected for a five-year term."
  },
  {
    question: "Which of these is the official app for voter services in India?",
    options: ["Voter Helpline", "MyVote India", "Digital Election", "Civic Dashboard"],
    answer: 0,
    explanation: "The 'Voter Helpline' app by ECI is the primary digital tool for voter registration and information in India."
  },
  {
    question: "What does EVM stand for in Indian elections?",
    options: ["Electronic Voting Method", "Electronic Voting Machine", "Every Vote Matters", "Election Verified Monitor"],
    answer: 1,
    explanation: "EVM stands for Electronic Voting Machine, used since the late 1990s in Indian elections."
  },
];

export default function QuizPage() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const saveResult = async (finalScore: number) => {
    if (!user) return;
    setIsSaving(true);
    const path = "quiz_results";
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        score: finalScore,
        total: quizQuestions.length,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving result:", error);
      // We don't necessarily want to block the UI if saving fails, 
      // but we could use handleFirestoreError if we wanted to be strict.
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    let newScore = score;
    if (selectedOption === quizQuestions[currentQuestion].answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      saveResult(newScore);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="py-24 text-center max-w-2xl mx-auto">
           <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-gray-100 shadow-xl rounded-[3rem] p-12"
           >
             <div className="w-24 h-24 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center mx-auto mb-8 text-yellow-600">
               <Trophy size={48} />
             </div>
             <h2 className="text-4xl font-bold mb-4 uppercase text-[#111827]">Quiz Complete!</h2>
             <p className="text-xl text-gray-500 mb-8">
               You scored <span className="text-[#F27D26] font-bold">{score}</span> out of <span className="font-bold text-[#111827]">{quizQuestions.length}</span>.
             </p>
             <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button
                  onClick={restart}
                  className="w-full md:w-auto px-8 py-4 bg-[#F27D26] hover:bg-[#FF8B3D] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  Try Again <RefreshCcw size={18} />
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full md:w-auto px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-full font-bold transition-all text-gray-600"
                >
                  Go Home
                </button>
             </div>
           </motion.div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3 text-[#111827]">
            <HelpCircle className="text-[#F27D26]" /> Civic IQ Quiz
          </h1>
          <p className="text-gray-400 mt-1">Test your knowledge of the democratic process.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase font-mono mb-1">Question</div>
          <div className="text-xl font-bold tracking-widest text-[#111827]">{currentQuestion + 1} / {quizQuestions.length}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <h3 className="text-2xl md:text-3xl font-medium leading-tight text-[#111827]">
              {question.question}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => setSelectedOption(idx)}
                  className={cn(
                    "p-6 rounded-3xl border text-left transition-all relative group",
                    selectedOption === idx ? "bg-[#F27D26]/10 border-[#F27D26] text-[#F27D26]" : "bg-gray-50 border-gray-100 hover:border-gray-200 text-gray-700",
                    showExplanation && idx === question.answer ? "bg-green-50 border-green-200 text-green-600" :
                    showExplanation && selectedOption === idx && idx !== question.answer ? "bg-red-50 border-red-200 text-red-600" : ""
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option}</span>
                    {showExplanation && idx === question.answer && <Check className="text-green-500" size={20} />}
                    {showExplanation && selectedOption === idx && idx !== question.answer && <X className="text-red-500" size={20} />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-50">
              {!showExplanation ? (
                <button
                   disabled={selectedOption === null}
                   onClick={() => setShowExplanation(true)}
                   className="ml-auto px-10 py-4 bg-[#111827] hover:bg-[#111827]/90 text-white rounded-full font-bold transition-all disabled:opacity-30 flex items-center gap-2 shadow-md"
                >
                  Check Answer
                </button>
              ) : (
                <div className="w-full space-y-6">
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 italic text-gray-500 text-sm">
                    {question.explanation}
                  </div>
                  <button
                    onClick={handleNext}
                    className="w-full py-4 bg-[#F27D26] hover:bg-[#FF8B3D] text-white rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"} <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {quizQuestions.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-12 h-1 rounded-full transition-all duration-500",
                  i === currentQuestion ? "bg-[#F27D26]" : i < currentQuestion ? "bg-green-500" : "bg-gray-200"
                )} 
              />
            ))}
          </div>
      </div>
    </div>
  );
}
