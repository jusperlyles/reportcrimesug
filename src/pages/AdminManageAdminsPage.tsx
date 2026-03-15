import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FaUserShield, FaUserPlus, FaTrash, FaCrown } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface AdminEntry {
  id: string;
  user_id: string;
  role: string;
  profile?: { display_name: string | null; avatar_url: string | null };
}

export function AdminManageAdminsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchAdmins = useCallback(async () => {
    if (!user) return;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) { navigate("/main"); return; }

    const { data: roles } = await supabase.from("user_roles").select("*").eq("role", "admin");
    if (!roles) { setLoading(false); return; }

    // Fetch profiles for each admin
    const enriched: AdminEntry[] = [];
    for (const r of roles) {
      const { data: prof } = await supabase.from("profiles").select("display_name, avatar_url").eq("user_id", r.user_id).single();
      enriched.push({ ...r, profile: prof || undefined });
    }
    setAdmins(enriched);
    setLoading(false);
  }, [user, navigate]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const addAdmin = async () => {
    if (!newUserId.trim()) return;
    setAdding(true);
    try {
      // Check if user exists in profiles
      const { data: prof } = await supabase.from("profiles").select("user_id").eq("user_id", newUserId.trim()).single();
      if (!prof) {
        toast({ title: "User not found", description: "Enter a valid user ID from the Manage Users page.", variant: "destructive" });
        setAdding(false);
        return;
      }
      const { error } = await supabase.from("user_roles").insert({ user_id: newUserId.trim(), role: "admin" as any });
      if (error) throw error;
      toast({ title: "Admin added!" });
      setNewUserId("");
      fetchAdmins();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setAdding(false);
  };

  const removeAdmin = async (roleId: string, userId: string) => {
    if (userId === user?.id) {
      toast({ title: "Cannot remove yourself", variant: "destructive" });
      return;
    }
    await supabase.from("user_roles").delete().eq("id", roleId);
    toast({ title: "Admin removed" });
    fetchAdmins();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaUserShield className="text-secondary" /> Manage Admins
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Add or remove administrator access.</p>

      {/* Add Admin */}
      <div className="flex gap-2 mb-6">
        <input
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          placeholder="Paste user ID to promote..."
          className="flex-1 p-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={addAdmin}
          disabled={adding}
          className="px-4 py-3 rounded-xl text-sm font-bold text-primary-foreground disabled:opacity-50"
          style={{ background: "var(--gradient-primary)" }}
        >
          <FaUserPlus size={14} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[0,1,2].map(i => <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : (
        <div className="space-y-2">
          {admins.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/10 flex items-center justify-center shrink-0">
                {a.profile?.avatar_url ? (
                  <img src={a.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FaCrown className="text-warning" size={14} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{a.profile?.display_name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{a.user_id}</p>
              </div>
              {a.user_id !== user?.id && (
                <button
                  onClick={() => removeAdmin(a.id, a.user_id)}
                  className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-all"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
