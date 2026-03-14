import { FaCog, FaBell, FaGlobe, FaMoon, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const SETTINGS = [
  { icon: FaUser, label: "Profile", desc: "Update your personal information", color: "hsl(234 85% 65%)" },
  { icon: FaBell, label: "Notifications", desc: "Manage push & email notifications", color: "hsl(38 92% 50%)" },
  { icon: FaGlobe, label: "Language", desc: "English, Luganda, Swahili", color: "hsl(142 71% 45%)" },
  { icon: FaMoon, label: "Appearance", desc: "Light / Dark / System theme", color: "hsl(263 70% 50%)" },
];

export function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaCog className="text-muted-foreground" /> Settings
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Manage your account and preferences.</p>

      <div className="space-y-3">
        {SETTINGS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="w-full p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md hover:border-primary/20 transition-all text-left flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color }}>
                <Icon className="text-white" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
