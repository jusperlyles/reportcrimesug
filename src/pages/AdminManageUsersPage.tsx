import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FaUsers, FaSearch, FaArrowLeft, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export function AdminManageUsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const checkAndFetch = useCallback(async () => {
    if (!user) return;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) { navigate("/main"); return; }

    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  }, [user, navigate]);

  useEffect(() => { checkAndFetch(); }, [checkAndFetch]);

  const filtered = profiles.filter((p) =>
    !search || (p.display_name || "").toLowerCase().includes(search.toLowerCase()) || p.user_id.includes(search)
  );

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaUsers className="text-primary" /> Manage Users
      </h1>
      <p className="text-muted-foreground text-sm mb-4">View all registered users ({profiles.length} total)</p>

      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[0,1,2].map(i => <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-primary" size={14} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{p.display_name || "Unnamed"}</p>
                <p className="text-xs text-muted-foreground truncate">{p.phone || "No phone"} • Joined {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No users found.</p>}
        </div>
      )}
    </motion.div>
  );
}
