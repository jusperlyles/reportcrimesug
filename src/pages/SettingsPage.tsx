import { useNavigate } from "react-router-dom";
import { FaCog, FaBell, FaGlobe, FaMoon, FaUser, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useState } from "react";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { t, lang, setLang, langNames, allLangs } = useLang();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const SETTINGS = [
    { icon: FaUser, label: t("profile"), desc: user?.email || "Update your personal information", color: "hsl(234 85% 65%)", action: () => navigate("/auth") },
    { icon: FaBell, label: t("notifications"), desc: "Manage push & email notifications", color: "hsl(38 92% 50%)", action: () => navigate("/notifications") },
    { icon: FaGlobe, label: t("language"), desc: langNames[lang], color: "hsl(142 71% 45%)", action: () => setShowLangPicker(!showLangPicker) },
    { icon: FaMoon, label: t("appearance"), desc: "Light / Dark / System theme", color: "hsl(263 70% 50%)", action: () => {} },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      {/* Profile Card */}
      {user && (
        <button
          onClick={() => navigate("/auth")}
          className="w-full mb-6 p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4 hover:shadow-md transition-all text-left"
        >
          <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-primary" size={20} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm truncate">{profile?.display_name || user.email}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <FaChevronRight className="text-muted-foreground" size={12} />
        </button>
      )}

      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaCog className="text-muted-foreground" /> {t("settings")}
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Manage your account and preferences.</p>

      <div className="space-y-3">
        {SETTINGS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i}>
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={item.action}
                className="w-full p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md hover:border-primary/20 transition-all text-left flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.color }}>
                  <Icon className="text-white" size={16} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <FaChevronRight className="text-muted-foreground" size={12} />
              </motion.button>

              {/* Language Picker */}
              {item.label === t("language") && showLangPicker && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-1 ml-14 space-y-1"
                >
                  {allLangs.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setShowLangPicker(false); }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                        lang === l
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {langNames[l]}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
