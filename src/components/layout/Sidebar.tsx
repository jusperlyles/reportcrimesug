import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt, FaCog, FaBell, FaLifeRing,
  FaSignOutAlt, FaTimes, FaShieldAlt, FaUser, FaSignInAlt,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { t } = useLang();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const NAV_ITEMS = [
    { to: "/main", icon: FaTachometerAlt, label: t("dashboard") },
    { to: "/get-help", icon: FaLifeRing, label: t("getHelp") },
    { to: "/notifications", icon: FaBell, label: t("notifications") },
    { to: "/settings", icon: FaCog, label: t("settings") },
    ...(isAdmin ? [{ to: "/admin", icon: FaUserShield, label: "Admin" }] : []),
  ];

  return (
    <>
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
        {/* Header - tap profile to auth */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <button
            onClick={() => { onClose(); navigate(user ? "/settings" : "/auth"); }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <FaShieldAlt className="text-white text-sm" />
              )}
            </div>
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide truncate max-w-[120px]">
                {profile?.display_name || "ReportCrime"}
              </h2>
              <p className="text-white/50 text-[10px]">{user ? user.email?.split("@")[0] : "Uganda"}</p>
            </div>
          </button>
          <button onClick={onClose} className="md:hidden text-white/60 hover:text-white p-1">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
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

        {/* Sign out / Sign in */}
        <div className="p-3 border-t border-white/10">
          {user ? (
            <button
              onClick={async () => { onClose(); await signOut(); navigate("/auth"); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <FaSignOutAlt size={16} />
              <span>{t("signOut")}</span>
            </button>
          ) : (
            <button
              onClick={() => { onClose(); navigate("/auth"); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <FaSignInAlt size={16} />
              <span>{t("signIn")}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
