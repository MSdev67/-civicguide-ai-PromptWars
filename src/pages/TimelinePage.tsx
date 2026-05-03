import { motion } from "framer-motion";
import { Search, MapPin, CheckCircle2, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Skeleton } from "../components/ui/Skeleton";

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

const MOCK_EVENTS: TimelineEvent[] = [
  {
    date: "MARCH 16, 2024",
    title: "Election Schedule Announced",
    description: "The Election Commission of India (ECI) announces the full schedule for the 18th Lok Sabha Elections."
  },
  {
    date: "APRIL 19 - JUNE 1, 2024",
    title: "7 Phases of Voting",
    description: "The world's largest democratic exercise takes place across 7 phases, ensuring every corner of India can vote."
  },
  {
    date: "JUNE 4, 2024",
    title: "Counting Day",
    description: "Electronic Voting Machines are unsealed and votes are counted nationwide simultaneously."
  },
  {
    date: "DECEMBER 2025",
    title: "Upcoming Local Body Polls",
    description: "Preparation for municipal and panchayat elections starts with voters list verification."
  }
];

export default function TimelinePage() {
  const [location, setLocation] = useState({ city: "Bengaluru", state: "Karnataka" });
  const [events, setEvents] = useState<TimelineEvent[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(false);
  const [reminders, setReminders] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [location]);

  const toggleReminder = (idx: number) => {
    setReminders(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16 px-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#111827]">Election Timeline</h1>
          <p className="text-gray-500 max-w-lg">
            Stay informed about key dates and deadlines for the upcoming elections in your region.
          </p>
        </div>
        
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-gray-200 w-full md:w-auto shadow-sm">
          <MapPin size={20} className="text-[#F27D26] ml-2" />
          <input 
            type="text" 
            placeholder="City, State"
            className="bg-transparent border-none outline-none text-sm w-[200px] py-2 text-[#111827]"
            value={`${location.city}, ${location.state}`}
            onChange={(e) => {
              const val = e.target.value;
              const [city, state] = val.split(", ");
              setLocation({ city: city || "", state: state || "" });
            }}
          />
          <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors">
            <Search size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#F27D26] via-blue-200 to-transparent opacity-30" />
        
        <div className="space-y-12 md:space-y-24">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={cn("relative flex flex-col md:flex-row items-center", i % 2 === 0 ? "md:flex-row-reverse" : "")}>
                <div className="absolute left-[-2px] md:left-1/2 md:ml-[-15px] top-2 md:top-1/2 md:mt-[-15px] w-8 h-8 rounded-full bg-gray-200 z-10" />
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                   <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <Skeleton className="h-4 w-24 mb-4" />
                      <Skeleton className="h-8 w-3/4 mb-4" />
                      <Skeleton className="h-16 w-full mb-6" />
                      <Skeleton className="h-10 w-32 rounded-xl" />
                   </div>
                </div>
              </div>
            ))
          ) : (
            events.map((event, index) => (
              <TimelineItem 
                key={index} 
                event={event} 
                index={index} 
                isLeft={index % 2 === 0} 
                isReminderSet={!!reminders[index]}
                onToggleReminder={() => toggleReminder(index)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ 
  event, 
  index, 
  isLeft, 
  isReminderSet, 
  onToggleReminder 
}: { 
  event: TimelineEvent, 
  index: number, 
  isLeft: boolean,
  isReminderSet: boolean,
  onToggleReminder: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col md:flex-row items-center",
        isLeft ? "md:flex-row-reverse text-left md:text-right" : "text-left"
      )}
    >
      {/* Node */}
      <div className="absolute left-[-2px] md:left-1/2 md:ml-[-15px] top-2 md:top-1/2 md:mt-[-15px] w-8 h-8 rounded-full bg-white border-2 border-[#F27D26] flex items-center justify-center z-10 shadow-[0_4px_10px_rgba(242,125,38,0.2)]">
        <div className="w-2 h-2 rounded-full bg-[#F27D26]" />
      </div>

      <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:border-[#F27D26]/20 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3 mb-2 text-gray-400 text-sm font-mono tracking-widest uppercase">
            {event.date}
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#111827] group-hover:text-[#F27D26] transition-colors">{event.title}</h3>
          <p className="text-gray-500 leading-relaxed font-light mb-6">{event.description}</p>
          <button 
            onClick={onToggleReminder}
            className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2",
                isReminderSet ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:border-gray-300"
            )}
          >
            {isReminderSet ? <CheckCircle2 size={14} /> : <Bell size={14} />}
            {isReminderSet ? "Reminder Set" : "Remind Me"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
