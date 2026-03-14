import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen relative">
      {/* Decorative radial background */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, hsl(234 85% 65% / 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(270 50% 55% / 0.06) 0%, transparent 50%)",
        }}
      />

      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-h-screen">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 px-4 py-6 pb-24 md:pb-6 overflow-y-auto">
          <Outlet />
        </main>

        <BottomNav />

        {/* Footer - desktop only */}
        <footer className="hidden md:block text-center py-3 text-xs text-muted-foreground border-t border-border/50">
          © 2026 ReportCrime Uganda • Your Safety Companion
        </footer>
      </div>
    </div>
  );
}
