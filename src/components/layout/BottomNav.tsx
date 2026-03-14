import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaLifeRing, FaBell, FaCog } from "react-icons/fa";

const NAV_ITEMS = [
  { to: "/main", icon: FaTachometerAlt, label: "Dashboard" },
  { to: "/get-help", icon: FaLifeRing, label: "Help" },
  { to: "/notifications", icon: FaBell, label: "Alerts" },
  { to: "/settings", icon: FaCog, label: "Settings" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-white/10 backdrop-blur-xl"
      style={{ background: "var(--topbar-bg)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-white/50 hover:text-white/80"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
