import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaUsers, FaUserShield, FaClipboardList, FaExclamationTriangle,
  FaCheckCircle, FaChartBar, FaBell, FaCog, FaTachometerAlt,
  FaUserPlus, FaShieldAlt, FaCrown, FaSync, FaMapMarkerAlt,
  FaFileAlt, FaToggleOn, FaToggleOff, FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface Stats {
  totalUsers: number;
  pendingRequests: number;
  resolvedRequests: number;
  totalAdmins: number;
  totalReports: number;
  missingPersons: number;
}

function StatCard({ icon: Icon, label, value, gradient, onClick }: {
  icon: any; label: string; value: number; gradient: string; onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-2xl p-4 text-left text-white shadow-lg"
      style={{ background: gradient }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-white/70">{label}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
      </div>
    </motion.button>
  );
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, pendingRequests: 0, resolvedRequests: 0, totalAdmins: 0, totalReports: 0, missingPersons: 0 });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    setIsAdmin(!!data);
    if (!data) navigate("/main");
  }, [user, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const [reports, pending, resolved, admins, profiles, missing] = await Promise.all([
        supabase.from("crime_reports").select("*", { count: "exact", head: true }),
        supabase.from("crime_reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("crime_reports").select("*", { count: "exact", head: true }).eq("status", "resolved"),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("missing_persons").select("*", { count: "exact", head: true }).eq("status", "missing"),
      ]);

      setStats({
        totalReports: reports.count || 0,
        pendingRequests: pending.count || 0,
        resolvedRequests: resolved.count || 0,
        totalAdmins: admins.count || 0,
        totalUsers: profiles.count || 0,
        missingPersons: missing.count || 0,
      });

      const { data: recent } = await supabase
        .from("crime_reports")
        .select("id, crime_type, location, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentReports(recent || []);
    } catch (e) {
      console.error("Admin fetch error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { checkAdmin(); }, [checkAdmin]);
  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin, fetchData]);

  // Realtime
  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "crime_reports" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, fetchData]);

  const handleApprove = async (id: string) => {
    await supabase.from("crime_reports").update({ status: "resolved" }).eq("id", id);
    toast({ title: "Report approved" });
    fetchData();
  };

  const handleBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
    const { data: allProfiles } = await supabase.from("profiles").select("user_id");
    if (!allProfiles?.length) { toast({ title: "No users", variant: "destructive" }); return; }
    
    const rows = [
      // Global notification
      { title: broadcastTitle, message: broadcastMsg, is_global: true, user_id: user!.id },
    ];
    await supabase.from("notifications").insert(rows);
    toast({ title: "Broadcast sent!" });
    setShowBroadcast(false);
    setBroadcastTitle("");
    setBroadcastMsg("");
  };

  const resolveRate = stats.totalReports > 0 ? Math.round((stats.resolvedRequests / stats.totalReports) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FaTachometerAlt className="text-primary" /> Admin Dashboard
            <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning font-semibold">
              <FaCrown size={10} className="inline mr-1" />Super Admin
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Full control over users, reports, and system operations.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setRefreshing(true); fetchData(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
          >
            <FaSync size={12} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
          <button
            onClick={() => setShowBroadcast(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, hsl(330 81% 60%), hsl(0 84% 60%))" }}
          >
            <FaBell size={12} /> Broadcast
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard icon={FaUsers} label="Total Users" value={stats.totalUsers} gradient="linear-gradient(135deg, hsl(217 91% 60%), hsl(234 85% 65%))" onClick={() => navigate("/admin/manage-users")} />
        <StatCard icon={FaClipboardList} label="Total Reports" value={stats.totalReports} gradient="linear-gradient(135deg, hsl(38 92% 50%), hsl(25 95% 53%))" onClick={() => navigate("/admin/pending-requests")} />
        <StatCard icon={FaExclamationTriangle} label="Pending" value={stats.pendingRequests} gradient="linear-gradient(135deg, hsl(0 84% 60%), hsl(330 81% 60%))" onClick={() => navigate("/admin/pending-requests")} />
        <StatCard icon={FaCheckCircle} label="Resolved" value={stats.resolvedRequests} gradient="linear-gradient(135deg, hsl(142 71% 45%), hsl(174 100% 50%))" />
        <StatCard icon={FaUserShield} label="Admins" value={stats.totalAdmins} gradient="linear-gradient(135deg, hsl(263 70% 50%), hsl(270 50% 55%))" onClick={() => navigate("/admin/manage-admins")} />
        <StatCard icon={FaUsers} label="Missing Persons" value={stats.missingPersons} gradient="linear-gradient(135deg, hsl(192 91% 36%), hsl(200 90% 62%))" />
      </div>

      {/* Resolution Rate */}
      <div className="mb-6 p-4 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground flex items-center gap-2"><FaChartBar className="text-primary" /> Resolution Rate</span>
          <span className="text-lg font-bold text-primary">{resolveRate}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${resolveRate}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Pending: {stats.pendingRequests}</span>
          <span>Resolved: {stats.resolvedRequests}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: FaUsers, label: "Manage Users", desc: "View & manage users", color: "hsl(217 91% 60%)", onClick: () => navigate("/admin/manage-users") },
            { icon: FaUserShield, label: "Manage Admins", desc: "Add or remove admins", color: "hsl(263 70% 50%)", onClick: () => navigate("/admin/manage-admins") },
            { icon: FaClipboardList, label: "Pending Reports", desc: "Review crime reports", color: "hsl(0 84% 60%)", onClick: () => navigate("/admin/pending-requests") },
            { icon: FaMapMarkerAlt, label: "Stations Map", desc: "View police stations", color: "hsl(142 71% 45%)", onClick: () => navigate("/search-stations") },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              onClick={action.onClick}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-card border border-border/50 text-left hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: action.color }}>
                <action.icon className="text-white" size={14} />
              </div>
              <p className="text-sm font-semibold text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="p-4 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FaFileAlt className="text-warning" /> Recent Reports
          </h2>
          <button onClick={() => navigate("/admin/pending-requests")} className="text-xs text-primary font-semibold hover:underline">
            View all →
          </button>
        </div>
        {recentReports.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No reports yet.</p>
        ) : (
          <div className="space-y-2">
            {recentReports.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.crime_type}</p>
                  <p className="text-xs text-muted-foreground">📍 {r.location || "N/A"} • {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    r.status === "pending" ? "bg-warning/20 text-warning" :
                    r.status === "resolved" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                  }`}>{r.status}</span>
                  {r.status === "pending" && (
                    <button onClick={() => handleApprove(r.id)} className="text-[10px] px-2 py-0.5 rounded-full bg-success/20 text-success font-semibold hover:bg-success/30">
                      ✓ Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {showBroadcast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowBroadcast(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                <FaBell className="text-primary" /> Broadcast Notification
              </h3>
              <input
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Notification title"
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm mb-3 focus:outline-none focus:border-primary"
              />
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Message to all users..."
                rows={3}
                className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm mb-4 focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleBroadcast} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  Send to All Users
                </button>
                <button onClick={() => setShowBroadcast(false)} className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground bg-muted hover:bg-muted/80">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
