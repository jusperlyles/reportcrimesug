import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function SplashPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      navigate("/auth");
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(234 85% 65%) 0%, hsl(270 50% 55%) 25%, hsl(300 90% 78%) 50%, hsl(210 98% 65%) 75%, hsl(174 100% 50%) 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient-shift 8s ease infinite",
      }}
    >
      {/* Running shield character */}
      <motion.div
        className="relative"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.2 }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Character body */}
          <div className="relative w-24 h-24">
            {/* Shield body */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <svg viewBox="0 0 100 120" className="w-24 h-28 drop-shadow-2xl">
                {/* Shield */}
                <path
                  d="M50 10 L85 25 L85 60 Q85 95 50 110 Q15 95 15 60 L15 25 Z"
                  fill="rgba(255,255,255,0.2)"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                />
                <path
                  d="M50 20 L75 32 L75 58 Q75 85 50 100 Q25 85 25 58 L25 32 Z"
                  fill="rgba(255,255,255,0.15)"
                />
                {/* Face */}
                <circle cx="40" cy="48" r="3" fill="white" />
                <circle cx="60" cy="48" r="3" fill="white" />
                <path d="M42 60 Q50 68 58 60" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Star badge */}
                <polygon
                  points="50,70 52,76 58,76 53,80 55,86 50,82 45,86 47,80 42,76 48,76"
                  fill="hsl(38 92% 50%)"
                />
              </svg>
            </motion.div>

            {/* Running legs */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              animate={{ scaleX: [1, -1, 1] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-6 bg-white/40 rounded-full origin-top"
                  animate={{ rotate: [30, -30, 30] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-6 bg-white/40 rounded-full origin-top"
                  animate={{ rotate: [-30, 30, -30] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* Speed lines */}
            <motion.div
              className="absolute top-1/2 -left-8 -translate-y-1/2 space-y-1"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-0.5 bg-white/40 rounded"
                  style={{ width: `${12 + i * 4}px` }}
                  animate={{ x: [-4, 4, -4], opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-center mt-8"
      >
        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
          ReportCrime
        </h1>
        <p className="text-lg text-white/80 mt-1 font-medium">Uganda</p>
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-white/70 text-sm text-center max-w-xs mt-3"
      >
        Your safety companion. Report crimes, find help, know your rights.
      </motion.p>

      {/* Progress bar */}
      <motion.div className="w-48 h-1 bg-white/20 rounded-full mt-8 overflow-hidden">
        <motion.div
          className="h-full bg-white/70 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
