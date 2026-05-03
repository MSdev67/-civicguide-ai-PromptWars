import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Mail, Globe, Twitter, ArrowRight, UserCircle, MapPin, Zap, Info, Plus, Check, Scale, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { Skeleton } from "../components/ui/Skeleton";
import { ComparisonModal } from "../components/ui/ComparisonModal";

interface Candidate {
  id: string;
  name: string;
  party: string;
  role: string;
  platform: string;
  bio: string;
  constituency: string;
  image?: string;
  pulse: {
    recentStatement: string;
    upcomingRally: string;
    popularityScale: number;
  };
}

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Arjun Sharma",
    party: "BJP",
    role: "Incumbent MP",
    platform: "Digital Infrastructure & Economic Growth",
    bio: "Focusing on making the constituency a tech hub with sustainable urban planning.",
    constituency: "Bengaluru Central",
    pulse: {
      recentStatement: "Promised 24/7 high-speed public Wi-Fi in all parks.",
      upcomingRally: "M.G. Road Square, May 5th, 4:00 PM",
      popularityScale: 85
    }
  },
  {
    id: "2",
    name: "Priya Lakshmi",
    party: "INC",
    role: "Former Minister",
    platform: "Social Welfare & Education Reform",
    bio: "Advocating for universal healthcare and state-of-the-art public schools.",
    constituency: "Bengaluru Central",
    pulse: {
      recentStatement: "Announced plan for 500 new community health clinics.",
      upcomingRally: "Cubbon Park North Gate, May 6th, 10:00 AM",
      popularityScale: 78
    }
  },
  {
    id: "3",
    name: "Rajesh Gowda",
    party: "AAP",
    role: "Social Activist",
    platform: "Transparency & Clean Governance",
    bio: "Committed to eradicating corruption and improving baseline public services like water and power.",
    constituency: "Bengaluru South",
    pulse: {
      recentStatement: "Unveiled real-time digital corruption tracking portal.",
      upcomingRally: "Jayanagar 4th Block, May 4th, 6:00 PM",
      popularityScale: 62
    }
  },
  {
    id: "4",
    name: "Meeda Khan",
    party: "Independent",
    role: "Environmentalist",
    platform: "Green Urbanization & Water Rights",
    bio: "Focusing on lake restoration and decentralized waste management systems.",
    constituency: "Bengaluru North",
    pulse: {
      recentStatement: "Demands immediate moratorium on lake-side construction.",
      upcomingRally: "Hebbal Lake Front, May 7th, 7:00 AM",
      popularityScale: 45
    }
  }
];

export default function CandidateDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [search, filter]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length < 2) return [...prev, id];
      return [prev[1], id];
    });
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.platform.toLowerCase().includes(search.toLowerCase()) ||
                         c.constituency.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || c.party === filter;
    return matchesSearch && matchesFilter;
  });

  const parties = ["All", ...new Set(candidates.map(c => c.party))];
  const selectedCandidates = candidates.filter(c => selectedIds.includes(c.id)) as [Candidate, Candidate?];

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-[#111827]">Candidate Explorer</h1>
          <p className="text-gray-500 max-w-xl">
            Real-time insights and side-by-side comparisons of Lok Sabha candidates in your region.
          </p>
        </div>
        
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-4 bg-[#F27D26]/5 border border-[#F27D26]/20 rounded-3xl"
          >
            <div className="flex -space-x-4">
              {selectedCandidates.map(c => (
                <div key={c?.id} className="w-10 h-10 rounded-full bg-white border-2 border-[#F27D26] flex items-center justify-center text-xs font-bold text-[#F27D26] shadow-md">
                  {c?.name.charAt(0)}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <div className="font-bold text-[#111827]">{selectedIds.length}/2 Selected</div>
              <button 
                disabled={selectedIds.length < 2}
                onClick={() => setIsCompareModalOpen(true)}
                className="text-[#F27D26] font-bold text-xs uppercase hover:underline disabled:opacity-50 flex items-center gap-1"
              >
                Compare with AI <Sparkles size={12} />
              </button>
            </div>
            {selectedIds.length === 2 && (
               <button 
                onClick={() => setIsCompareModalOpen(true)}
                className="ml-4 px-6 py-2 bg-[#F27D26] text-white rounded-xl text-sm font-bold shadow-lg hover:bg-[#FF8B3D] transition-all"
               >
                 Launch Comparison
               </button>
            )}
          </motion.div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, issue, or constituency..."
            className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F27D26]/20 focus:border-[#F27D26] shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-300">
            <div className="w-px h-6 bg-gray-100 mx-2" />
            <MapPin size={18} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Current Region</span>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {parties.map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={cn(
                "px-6 py-4 rounded-2xl border transition-all text-sm font-medium whitespace-nowrap",
                filter === p 
                  ? "bg-[#F27D26] border-[#F27D26] text-white shadow-md" 
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-8 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-6">
               <div className="flex justify-between">
                  <Skeleton variant="circle" className="w-20 h-20" />
                  <Skeleton className="w-20 h-8 rounded-full" />
               </div>
               <Skeleton className="h-6 w-3/4" />
               <Skeleton className="h-4 w-1/2 bg-gray-50" />
               <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
               </div>
            </div>
          ))
        ) : (
          <AnimatePresence>
            {filteredCandidates.map((candidate, idx) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                index={idx} 
                isSelected={selectedIds.includes(candidate.id)}
                onSelect={() => toggleSelection(candidate.id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {isCompareModalOpen && selectedCandidates[0] && selectedCandidates[1] && (
        <ComparisonModal 
          candidates={[selectedCandidates[0], selectedCandidates[1]!]} 
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}
    </div>
  );
}

function CandidateCard({ 
  candidate, 
  index, 
  isSelected, 
  onSelect 
}: { 
  candidate: Candidate, 
  index: number, 
  isSelected: boolean,
  onSelect: () => void 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "p-8 rounded-[3rem] bg-white border transition-all flex flex-col group relative",
        isSelected ? "ring-2 ring-[#F27D26] border-transparent shadow-2xl" : "border-gray-100 shadow-sm hover:border-[#F27D26]/20 hover:shadow-xl"
      )}
    >
      <button 
        onClick={onSelect}
        className={cn(
          "absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center transition-all border",
          isSelected ? "bg-[#F27D26] border-[#F27D26] text-white shadow-lg" : "bg-white border-gray-100 text-gray-300 hover:border-gray-300"
        )}
      >
        {isSelected ? <Check size={20} /> : <Plus size={20} />}
      </button>

      <div className="flex items-start gap-6 mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:bg-[#F27D26]/5 transition-colors">
          <UserCircle size={50} className="text-gray-300 group-hover:text-[#F27D26]/30 transition-colors" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-tighter">
              {candidate.party}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <Zap size={10} /> LIVE
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#111827]">{candidate.name}</h3>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{candidate.role}</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 mb-8">
        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
           <div className="flex items-center gap-2 text-xs font-bold text-[#F27D26] uppercase mb-2">
             <MapPin size={14} /> Constituency
           </div>
           <p className="text-sm font-semibold text-[#111827]">{candidate.constituency}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
           <div className="relative">
              <div className="text-[10px] font-bold text-gray-300 uppercase mb-2 flex items-center gap-1">
                <Info size={12} /> Recent Pulse
              </div>
              <p className="text-sm text-gray-600 italic border-l-2 border-[#F27D26]/30 pl-3">
                "{candidate.pulse.recentStatement}"
              </p>
           </div>
           
           <div className="p-4 rounded-2xl bg-[#111827]/5 border border-[#111827]/10">
              <div className="text-[10px] font-bold text-blue-600 uppercase mb-2">Upcoming Trail</div>
              <p className="text-xs font-bold text-[#111827]">{candidate.pulse.upcomingRally}</p>
           </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto">
        <div className="flex gap-4 text-gray-300">
          <Mail size={18} className="hover:text-[#F27D26] transition-colors cursor-pointer" />
          <Twitter size={18} className="hover:text-[#F27D26] transition-colors cursor-pointer" />
          <Globe size={18} className="hover:text-[#F27D26] transition-colors cursor-pointer" />
        </div>
        <button className="text-xs font-black uppercase tracking-widest text-[#F27D26] hover:text-[#FF8B3D] transition-colors">
          View Tracker
        </button>
      </div>
    </motion.div>
  );
}
