import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <ShieldCheck className="text-blue-500" />,
      title: "Verified Insights",
      description: "Real-time fake news detection for candidate claims and election news.",
    },
    {
      icon: <Zap className="text-yellow-500" />,
      title: "Personalized Journey",
      description: "Tailored timelines based on your location and voter eligibility.",
    },
    {
      icon: <Globe className="text-green-500" />,
      title: "Multilingual Support",
      description: "Access critical civic information in 6 major Indian languages.",
    }
  ];

  return (
    <div className="py-12 md:py-24">
      {/* Hero Section */}
      <div className="text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F27D26]/30 bg-[#F27D26]/10 text-[#F27D26] text-xs font-semibold mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(242,125,38,0.2)]"
        >
          <Sparkles size={14} className="animate-spin-slow" />
          {t.tagline}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-6 text-[#111827] leading-[1.1]"
        >
          {t.heroTitle.split('.').map((part, i) => i === 0 ? <span key={i}>{part}.<br className="hidden md:block" /></span> : <span key={i}>{part}</span>)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          {t.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/timeline"
            className="w-full md:w-auto px-10 py-5 bg-[#F27D26] hover:bg-[#FF8B3D] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(242,125,38,0.3)] group"
          >
            {t.getStarted} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/chatbot"
            className="w-full md:w-auto px-10 py-5 bg-white hover:bg-gray-50 border border-gray-200 rounded-full font-bold transition-all shadow-sm"
          >
            {t.askAI}
          </Link>
        </motion.div>

        {/* Decorative Floating Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-40">
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[10%] left-[5%] w-32 h-32 bg-[#F27D26]/20 blur-3xl rounded-full"
           />
           <motion.div 
             animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-blue-500/20 blur-3xl rounded-full"
           />
        </div>
      </div>

      {/* Feature Grid */}
      <section className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FeatureCard 
            key={i}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={0.4 + i * 0.1}
          />
        ))}
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#F27D26]/20 shadow-sm transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F27D26]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-[#111827]">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-light">{description}</p>
    </motion.div>
  );
}
