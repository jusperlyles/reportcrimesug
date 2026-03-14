import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export function SplashPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      navigate("/main");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(234 85% 65%) 0%, hsl(270 50% 55%) 25%, hsl(300 90% 78%) 50%, hsl(210 98% 65%) 75%, hsl(174 100% 50%) 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient-shift 8s ease infinite",
      }}
    >
      {/* Rotating background circle */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background: "conic-gradient(from 0deg, hsl(234 85% 65%), hsl(270 50% 55%), hsl(200 90% 62%), hsl(234 85% 65%))",
          animation: "spin-slow 20s linear infinite",
        }}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Shield Icon */}
        <motion.div
          className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <FaShieldAlt className="text-white text-5xl drop-shadow-lg" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
            ReportCrime
          </h1>
          <p className="text-lg text-white/80 mt-1 font-medium">Uganda</p>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-white/70 text-sm text-center max-w-xs"
        >
          Your safety companion. Report crimes, find help, know your rights.
        </motion.p>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white/60"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
