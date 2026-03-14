import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const ITEMS = [
  { title: "Blue Backpack", location: "Owino Market", date: "2026-03-12", status: "Lost", color: "hsl(217 91% 60%)" },
  { title: "Samsung Phone", location: "Wandegeya", date: "2026-03-10", status: "Found", color: "hsl(142 71% 45%)" },
  { title: "National ID", location: "Nakasero", date: "2026-03-08", status: "Lost", color: "hsl(0 84% 60%)" },
  { title: "Laptop Bag", location: "Makerere University", date: "2026-03-06", status: "Found", color: "hsl(38 92% 50%)" },
];

export function LostAndFoundPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaSearch className="text-warning" /> Lost & Found
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Report or search for lost items.</p>

      <div className="space-y-3">
        {ITEMS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: item.color }}>
                {item.status}
              </span>
              <span className="text-xs text-muted-foreground">{item.date}</span>
            </div>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">📍 {item.location}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
