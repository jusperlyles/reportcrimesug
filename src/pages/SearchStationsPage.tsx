import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

const STATIONS = [
  { name: "Central Police Station", type: "Regional HQ", phone: "0414-233-295", address: "Kampala Road", color: "hsl(234 85% 65%)" },
  { name: "Kira Road Police Station", type: "Division", phone: "0414-343-088", address: "Kira Road, Kamwokya", color: "hsl(263 70% 50%)" },
  { name: "Nakawa Police Station", type: "Division", phone: "0414-220-100", address: "Nakawa Division", color: "hsl(192 91% 36%)" },
  { name: "Kawempe Police Station", type: "Division", phone: "0414-532-655", address: "Kawempe Division", color: "hsl(142 71% 45%)" },
  { name: "Makindye Police Station", type: "Division", phone: "0414-510-311", address: "Makindye Division", color: "hsl(38 92% 50%)" },
  { name: "Rubaga Police Station", type: "Division", phone: "0414-272-491", address: "Rubaga Division", color: "hsl(330 81% 60%)" },
];

export function SearchStationsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaMapMarkerAlt className="text-secondary" /> Search Stations
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Find Uganda Police Force stations near you.</p>

      <div className="space-y-3">
        {STATIONS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: s.color }}>
                {s.type}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{s.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">📍 {s.address}</p>
            <a
              href={`tel:${s.phone.replace(/-/g, "")}`}
              className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
            >
              <FaPhone size={10} /> {s.phone}
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
