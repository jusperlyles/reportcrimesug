import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaArrowLeft, FaPhone, FaBell } from "react-icons/fa";

const SECONDARY_ROUTES = [
  "/report-crime", "/get-help", "/lost-and-found", "/missing-persons",
  "/report-missing-person", "/report-missing-property", "/laws-and-rights",
  "/search-stations", "/settings", "/notifications",
];

const ROUTE_TITLES: Record<string, string> = {
  "/main": "Dashboard",
  "/report-crime": "Report Crime",
  "/get-help": "Get Help",
  "/lost-and-found": "Lost & Found",
  "/missing-persons": "Missing Persons",
  "/report-missing-person": "Report Missing Person",
  "/report-missing-property": "Report Missing Property",
  "/laws-and-rights": "Laws & Rights",
  "/search-stations": "Search Stations",
  "/settings": "Settings",
  "/notifications": "Notifications",
};

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isSecondary = SECONDARY_ROUTES.includes(path);
  const title = ROUTE_TITLES[path] || "ReportCrime Uganda";

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 backdrop-blur-xl border-b border-white/10"
      style={{ background: "var(--topbar-bg)" }}
    >
      <div className="flex items-center gap-3">
        {isSecondary ? (
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <FaArrowLeft size={14} />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all md:hidden"
          >
            <FaBars size={14} />
          </button>
        )}
        <span className="text-white font-semibold text-sm tracking-wide">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/notifications")}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all relative"
        >
          <FaBell size={14} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
        </button>
        <a
          href="tel:999"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <FaPhone size={12} />
        </a>
      </div>
    </header>
  );
}
