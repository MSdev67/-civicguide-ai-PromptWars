import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Calendar, MessageSquare, Users, Info, Settings, LayoutDashboard, HelpCircle } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import TimelinePage from "./pages/TimelinePage";
import ChatbotPage from "./pages/ChatbotPage";
import CandidateDashboard from "./pages/CandidateDashboard";
import VotingSimulator from "./pages/VotingSimulator";
import QuizPage from "./pages/QuizPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#F9FAFB] text-[#111827] selection:bg-[#F27D26] selection:text-white selection:bg-opacity-30">
            <Navbar />
            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto overflow-x-hidden">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
                  <Route path="/timeline" element={<PageWrapper><TimelinePage /></PageWrapper>} />
                  <Route path="/chatbot" element={<PageWrapper><ChatbotPage /></PageWrapper>} />
                  <Route path="/candidates" element={<PageWrapper><CandidateDashboard /></PageWrapper>} />
                  <Route path="/simulator" element={<PageWrapper><VotingSimulator /></PageWrapper>} />
                  <Route path="/quiz" element={<PageWrapper><QuizPage /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </main>
            
            {/* Glassmorphism Background Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F27D26] blur-[150px] opacity-[0.05] rounded-full animate-pulse" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[150px] opacity-[0.05] rounded-full animate-pulse delay-1000" />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
