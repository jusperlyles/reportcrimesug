import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

const notifications = [
  { title: "Report #RC-2026-0342 Updated", desc: "Your crime report has been assigned to an officer.", time: "2 hours ago", read: false },
  { title: "Missing Person Alert", desc: "Sarah Nakamya (14) reported missing in Kampala Central.", time: "5 hours ago", read: false },
  { title: "Report Submitted", desc: "Your report #RC-2026-0341 was successfully submitted.", time: "1 day ago", read: true },
  { title: "System Update", desc: "New features added: Laws & Rights section, improved search.", time: "3 days ago", read: true },
];

export function NotificationsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaBell className="text-warning" /> Notifications
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Stay updated on your reports and alerts.</p>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`p-4 rounded-2xl border transition-all ${
              n.read
                ? "bg-card border-border/50"
                : "bg-primary/5 border-primary/20 shadow-sm"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  <h3 className="font-semibold text-sm text-foreground">{n.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{n.desc}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
