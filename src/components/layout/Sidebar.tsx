import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt, FaCog, FaBell, FaLifeRing,
  FaSignOutAlt, FaTimes, FaShieldAlt,
} from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { to: "/main", icon: FaTachometerAlt, label: "Dashboard" },
  { to: "/get-help", icon: FaLifeRing, label: "Get Help" },
  { to: "/notifications", icon: FaBell, label: "Notifications" },
  { to: "/settings", icon: FaCog, label: "Settings" },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 ease-in-out md:sticky md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, hsl(232 47% 9%) 0%, hsl(234 40% 14%) 100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <FaShieldAlt className="text-white text-sm" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide">ReportCrime</h2>
              <p className="text-white/50 text-[10px]">Uganda</p>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-white/60 hover:text-white p-1">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-white shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { onClose(); navigate("/"); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <FaSignOutAlt size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
