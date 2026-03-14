import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserFriends, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface MissingPerson {
  id: string;
  full_name: string;
  age: number | null;
  last_seen_location: string | null;
  status: string;
  created_at: string;
}

export function MissingPersonsPage() {
  const navigate = useNavigate();
  const [persons, setPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("missing_persons")
      .select("id, full_name, age, last_seen_location, status, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPersons((data as MissingPerson[]) || []);
        setLoading(false);
      });
  }, []);

  const demoPersons: MissingPerson[] = [
    { id: "1", full_name: "Sarah Nakamya", age: 14, last_seen_location: "Kampala Central", status: "missing", created_at: "2026-03-10" },
    { id: "2", full_name: "John Okello", age: 32, last_seen_location: "Jinja Road", status: "found", created_at: "2026-03-08" },
    { id: "3", full_name: "Grace Auma", age: 8, last_seen_location: "Kawempe", status: "missing", created_at: "2026-03-05" },
  ];

  const display = persons.length > 0 ? persons : demoPersons;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
            <FaUserFriends className="text-primary" /> Missing Persons
          </h1>
          <p className="text-muted-foreground text-sm">View & report missing people in Uganda.</p>
        </div>
        <button
          onClick={() => navigate("/report-missing-person")}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        >
          <FaPlus size={14} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {display.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full text-white ${p.status === "missing" ? "bg-destructive" : "bg-success"}`}>
                  {p.status}
                </span>
                <span className="text-xs text-muted-foreground">{p.created_at.split("T")[0]}</span>
              </div>
              <h3 className="font-semibold text-foreground">{p.full_name}</h3>
              <p className="text-sm text-muted-foreground">
                {p.age ? `Age: ${p.age} | ` : ""}Last seen: {p.last_seen_location || "Unknown"}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
