import { useState } from "react";
import {
  FaGavel, FaMapMarkerAlt, FaCalendarAlt, FaCamera,
  FaFileAlt, FaExclamationTriangle, FaCrosshairs,
} from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const CRIME_TYPES = [
  "Theft / Robbery", "Assault", "Fraud / Cybercrime", "Domestic Violence",
  "Drug Crime", "Traffic Accident", "Land Dispute", "Corruption / Bribery",
  "Missing Person", "Other",
];

export function ReportCrimePage() {
  const [crimeType, setCrimeType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation is not supported by your browser", variant: "destructive" });
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const addr = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(addr);
          toast({ title: "Location detected", description: addr });
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setDetecting(false);
      },
      () => {
        toast({ title: "Error", description: "Failed to detect location. Please enable location access.", variant: "destructive" });
        setDetecting(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crimeType || !description) {
      toast({ title: "Missing fields", description: "Please fill in crime type and description", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Report Submitted", description: "Your crime report has been submitted successfully. You will receive a Case Reference Number." });
      setCrimeType(""); setLocation(""); setDate(""); setDescription("");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FaGavel className="text-destructive" /> Report Crime
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a crime or complaint report to Uganda Police Force.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Crime Type */}
        <div>
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
            <FaExclamationTriangle className="text-warning" size={12} /> Crime Type *
          </label>
          <select
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="">Select crime type...</option>
            {CRIME_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
            <FaMapMarkerAlt className="text-primary" size={12} /> Location
          </label>
          <div className="flex gap-2">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where did this happen?"
              className="flex-1 p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detecting}
              className="px-3 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <FaCrosshairs size={12} className={detecting ? "animate-spin" : ""} />
              {detecting ? "..." : "Detect"}
            </button>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
            <FaCalendarAlt className="text-accent" size={12} /> Date & Time
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
            <FaFileAlt className="text-secondary" size={12} /> Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened in detail..."
            rows={4}
            className="w-full p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Evidence Upload Placeholder */}
        <div>
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
            <FaCamera className="text-success" size={12} /> Evidence (optional)
          </label>
          <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center hover:border-primary/40 transition-all cursor-pointer">
            <FaCamera className="mx-auto text-muted-foreground mb-2" size={24} />
            <p className="text-sm text-muted-foreground">Tap to upload photos or videos</p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-primary-foreground transition-all duration-300 disabled:opacity-50 hover:shadow-lg"
          style={{ background: "var(--gradient-primary)" }}
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </motion.div>
  );
}
