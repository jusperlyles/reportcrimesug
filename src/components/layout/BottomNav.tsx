import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaLifeRing, FaBell, FaCog } from "react-icons/fa";
import { useLang } from "@/contexts/LanguageContext";

export function BottomNav() {
  const { t } = useLang();

  const NAV_ITEMS = [
    { to: "/main", icon: FaTachometerAlt, label: t("dashboard") },
    { to: "/get-help", icon: FaLifeRing, label: t("getHelp") },
    { to: "/notifications", icon: FaBell, label: t("notifications") },
    { to: "/settings", icon: FaCog, label: t("settings") },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-white/10 backdrop-blur-xl"
      style={{ background: "var(--topbar-bg)" }}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 min-w-0 ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-white/50 hover:text-white/80"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
