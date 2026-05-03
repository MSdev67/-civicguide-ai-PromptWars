import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Vote, Calendar, MessageSquare, Users, BookOpen, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Language } from "../constants";

export default function Navbar() {
  const location = useLocation();
  const { user, signIn, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t.timeline, path: "/timeline", icon: Calendar },
    { name: t.candidates, path: "/candidates", icon: Users },
    { name: t.simulator, path: "/simulator", icon: Vote },
    { name: t.chatbot, path: "/chatbot", icon: MessageSquare },
    { name: t.quiz, path: "/quiz", icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F27D26] to-[#FFB07C] flex items-center justify-center shadow-[0_0_15px_rgba(242,125,38,0.3)]"
          >
            <Vote size={20} className="text-white" />
          </motion.div>
          <span className="font-display font-bold text-xl tracking-tight text-[#111827]">
            {t.title}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <div className="flex items-center mr-4 pr-4 border-r border-gray-200 gap-3">
             {(["EN", "HI", "KA", "TA", "TE", "ML"] as Language[]).map(lang => (
               <button 
                 key={lang}
                 onClick={() => setLanguage(lang)}
                 className={cn(
                   "text-[10px] font-bold transition-all px-2 py-1 rounded-md",
                   language === lang 
                    ? "text-[#F27D26] bg-[#F27D26]/10 shadow-[0_0_10px_rgba(242,125,38,0.1)]" 
                    : "text-gray-400 hover:text-gray-600"
                 )}
               >
                 {lang}
               </button>
             ))}
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all relative group",
                  isActive ? "text-[#F27D26]" : "text-[#111827]/60 hover:text-[#111827]"
                )}
              >
                <div className="flex items-center gap-2 relative z-10">
                  <item.icon size={16} />
                  {item.name}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[#F27D26]/5 border border-[#F27D26]/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && (
                  <motion.div 
                    initial={false}
                    whileHover={{ scale: 1.05 }}
                    className="absolute inset-0 bg-gray-100/0 group-hover:bg-gray-100 rounded-full transition-colors" 
                  />
                )}
              </Link>
            );
          })}

          <div className="ml-4 pl-4 border-l border-gray-200">
            {user ? (
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 text-gray-400">
                    {user.photoURL ? <img src={user.photoURL} alt="Profile" /> : <UserIcon size={16} />}
                 </div>
                 <button 
                   onClick={logout}
                   className="text-gray-400 hover:text-gray-600 transition-colors"
                   title="Logout"
                 >
                   <LogOut size={18} />
                 </button>
              </div>
            ) : (
              <button 
                onClick={signIn}
                className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-full font-bold text-sm hover:bg-[#111827]/90 transition-all shadow-sm"
              >
                <LogIn size={16} /> Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button className="md:hidden p-2 text-gray-500">
            <span className="sr-only">Menu</span>
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current" />
        </button>
      </div>
    </nav>
  );
}
