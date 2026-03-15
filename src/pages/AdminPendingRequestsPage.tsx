import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface Report {
  id: string;
  crime_type: string;
  description: string;
  location: string | null;
  status: string;
  created_at: string;
  audio_url: string | null;
}

export function AdminPendingRequestsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved" | "rejected">("all");

  const fetchReports = useCallback(async () => {
    if (!user) return;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) { navigate("/main"); return; }

    let query = supabase.from("crime_reports").select("id, crime_type, description, location, status, created_at, audio_url").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setReports(data || []);
    setLoading(false);
  }, [user, navigate, filter]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("crime_reports").update({ status }).eq("id", id);
    toast({ title: `Report ${status}` });
    fetchReports();
  };

  const filters = ["all", "pending", "resolved", "rejected"] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaClipboardList className="text-destructive" /> Crime Reports
      </h1>
      <p className="text-muted-foreground text-sm mb-4">Review, approve, or reject submitted reports.</p>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[0,1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : reports.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-12">No reports found.</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      r.status === "pending" ? "bg-warning/20 text-warning" :
                      r.status === "resolved" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    }`}>{r.status}</span>
                    <h3 className="text-sm font-semibold text-foreground truncate">{r.crime_type}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{r.description}</p>
                  <p className="text-[10px] text-muted-foreground">📍 {r.location || "N/A"} • {new Date(r.created_at).toLocaleString()}</p>
                  {r.audio_url && (
                    <audio src={r.audio_url} controls className="mt-2 h-8 w-full max-w-xs" />
                  )}
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => updateStatus(r.id, "resolved")}
                      className="w-8 h-8 rounded-lg bg-success/10 text-success flex items-center justify-center hover:bg-success/20 transition-all"
                      title="Approve"
                    >
                      <FaCheckCircle size={14} />
                    </button>
                    <button
                      onClick={() => updateStatus(r.id, "rejected")}
                      className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-all"
                      title="Reject"
                    >
                      <FaTimesCircle size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
