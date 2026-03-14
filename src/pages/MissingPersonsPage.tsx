import { FaUserFriends } from "react-icons/fa";
import { motion } from "framer-motion";

const PERSONS = [
  { name: "Sarah Nakamya", age: 14, lastSeen: "Kampala Central", date: "2026-03-10", status: "Missing" },
  { name: "John Okello", age: 32, lastSeen: "Jinja Road", date: "2026-03-08", status: "Found" },
  { name: "Grace Auma", age: 8, lastSeen: "Kawempe", date: "2026-03-05", status: "Missing" },
];

export function MissingPersonsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaUserFriends className="text-primary" /> Missing Persons
      </h1>
      <p className="text-muted-foreground text-sm mb-6">View & report missing people in Uganda.</p>

      <div className="space-y-3">
        {PERSONS.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${p.status === "Missing" ? "bg-destructive" : "bg-success"}`}>
                {p.status}
              </span>
              <span className="text-xs text-muted-foreground">{p.date}</span>
            </div>
            <h3 className="font-semibold text-foreground">{p.name}</h3>
            <p className="text-sm text-muted-foreground">Age: {p.age} | Last seen: {p.lastSeen}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
