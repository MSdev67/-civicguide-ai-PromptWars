import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Fingerprint, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

const candidates = [
  { id: "1", name: "Sarah Jenkins", symbol: "🌱", party: "Democratic" },
  { id: "2", name: "David Thorne", symbol: "⚡", party: "Republican" },
  { id: "3", name: "Elena Rodriguez", symbol: "🏗️", party: "Independent" },
  { id: "4", name: "Marc Peterson", symbol: "🛡️", party: "Libertarian" },
];

export default function VotingSimulator() {
  const [step, setStep] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleVote = () => {
    if (!selectedId) return;
    setIsCasting(true);
    setTimeout(() => {
      setIsCasting(false);
      setIsConfirmed(true);
    }, 2000);
  };

  const steps = [
    { title: "Verification", icon: ShieldCheck },
    { title: "Ballot Selection", icon: ChevronRight },
    { title: "Confirmation", icon: CheckCircle2 },
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#111827]">Mock Voting Simulator</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Familiarize yourself with the digital voting process in a risk-free environment.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-4 mb-16">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
              step > i + 1 ? "bg-green-50 border-green-200 text-green-600" :
              step === i + 1 ? "bg-[#F27D26]/10 border-[#F27D26]/30 text-[#F27D26]" :
              "bg-white border-gray-100 text-gray-400"
            )}>
              <s.icon size={16} />
              <span className="text-sm font-bold">{s.title}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 shadow-xl rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Fingerprint size={48} className="text-[#F27D26]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3 text-[#111827]">Identity Verification</h2>
                <p className="text-gray-500 mb-8">In a real election, you would provide valid ID. For this simulation, click verify to proceed.</p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="px-12 py-4 bg-[#F27D26] hover:bg-[#FF8B3D] text-white rounded-full font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Verify & Proceed
              </button>
            </motion.div>
          )}

          {step === 2 && !isConfirmed && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111827]">Electronic Ballot</h2>
                <div className="px-3 py-1 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-xs text-green-600 font-bold">
                  <Lock size={12} /> Secure Session
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-12">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-3xl border transition-all text-left group",
                      selectedId === c.id 
                        ? "bg-[#F27D26]/5 border-[#F27D26] shadow-md" 
                        : "bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-white"
                    )}
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{c.symbol}</div>
                      <div>
                        <div className="font-bold text-xl text-[#111827]">{c.name}</div>
                        <div className="text-sm text-gray-400 uppercase tracking-widest">{c.party}</div>
                      </div>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedId === c.id ? "border-[#F27D26] bg-[#F27D26] text-white" : "border-gray-200"
                    )}>
                      {selectedId === c.id && <CheckCircle2 size={20} />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between p-6 bg-yellow-50 border border-yellow-100 rounded-2xl mb-8">
                <div className="flex items-center gap-3 text-yellow-700 text-sm">
                  <AlertCircle size={20} />
                  You can only change your selection before clicking "Cast Vote".
                </div>
              </div>

              <button
                disabled={!selectedId || isCasting}
                onClick={handleVote}
                className="w-full py-6 bg-[#111827] hover:bg-[#111827]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[2rem] font-bold text-xl shadow-lg transition-all flex items-center justify-center gap-4"
              >
                {isCasting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Casting Vote...
                  </>
                ) : (
                  "Cast Vote"
                )}
              </button>
            </motion.div>
          )}

          {isConfirmed && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-8 text-green-600 shadow-sm">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-3 uppercase text-[#111827]">Vote Successfully Cast</h2>
                <p className="text-gray-500 mb-8">Your anonymous vote has been recorded securely. Thank you for participating in this exercise.</p>
              </div>
              <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl inline-block px-12">
                <div className="text-xs text-gray-400 uppercase font-mono mb-2">Receipt Token (SIM)</div>
                <div className="font-mono text-sm tracking-widest text-[#111827] font-bold">CG-AI-8293-XKL-1029</div>
              </div>
              <div className="pt-8">
                  <button
                    onClick={() => {
                        setStep(1);
                        setSelectedId(null);
                        setIsConfirmed(false);
                    }}
                    className="text-gray-400 hover:text-[#F27D26] transition-colors text-sm font-bold uppercase tracking-widest underline underline-offset-8"
                  >
                    Back to Start
                  </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Grid */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>
    </div>
  );
}
