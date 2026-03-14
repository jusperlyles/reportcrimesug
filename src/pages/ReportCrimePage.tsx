import { useState, useRef } from "react";
import {
  FaGavel, FaMapMarkerAlt, FaCalendarAlt, FaCamera,
  FaFileAlt, FaExclamationTriangle, FaCrosshairs,
  FaMicrophone, FaStop, FaPlay, FaTrash,
} from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";

const CRIME_TYPES = [
  "Theft / Robbery", "Assault", "Fraud / Cybercrime", "Domestic Violence",
  "Drug Crime", "Traffic Accident", "Land Dispute", "Corruption / Bribery",
  "Missing Person", "Other",
];

export function ReportCrimePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [crimeType, setCrimeType] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [detecting, setDetecting] = useState(false);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setLatitude(lat);
        setLongitude(lon);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          setLocation(data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          toast({ title: t("location") + " detected", description: data.display_name || "" });
        } catch {
          setLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        }
        setDetecting(false);
      },
      () => {
        toast({ title: "Error", description: "Failed to detect location", variant: "destructive" });
        setDetecting(false);
      }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: t("voiceRecording"), description: "Recording started..." });
    } catch {
      toast({ title: "Error", description: "Microphone access denied", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const removeRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crimeType || !description) {
      toast({ title: "Missing fields", description: "Please fill in crime type and description", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Not signed in", description: "Please sign in to submit a report", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      let uploadedAudioUrl: string | null = null;

      if (audioBlob) {
        const fileName = `audio/${user.id}/${Date.now()}.webm`;
        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(fileName, audioBlob, { contentType: "audio/webm" });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(fileName);
          uploadedAudioUrl = urlData.publicUrl;
        }
      }

      const { error } = await supabase.from("crime_reports").insert({
        user_id: user.id,
        crime_type: crimeType,
        description,
        location,
        latitude,
        longitude,
        date_time: date ? new Date(date).toISOString() : null,
        audio_url: uploadedAudioUrl,
        reference_number: "TEMP", // will be replaced by trigger
      });

      if (error) throw error;

      toast({ title: t("reportSubmitted"), description: "Your crime report has been submitted. You'll receive a Case Reference Number." });
      setCrimeType(""); setLocation(""); setDate(""); setDescription("");
      setAudioBlob(null); setAudioUrl(null); setLatitude(null); setLongitude(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to submit", variant: "destructive" });
    }
    setSubmitting(false);
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
          <FaGavel className="text-destructive" /> {t("reportCrime")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a crime or complaint report to Uganda Police Force.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Crime Type */}
        <div>
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
            <FaExclamationTriangle className="text-warning" size={12} /> {t("crimeType")} *
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
            <FaMapMarkerAlt className="text-primary" size={12} /> {t("location")}
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
              {detecting ? "..." : t("detect")}
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
            <FaFileAlt className="text-secondary" size={12} /> {t("description")} *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened in detail..."
            rows={4}
            className="w-full p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Voice Recording */}
        <div>
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
            <FaMicrophone className="text-destructive" size={12} /> {t("voiceRecording")} (optional)
          </label>
          <div className="p-4 rounded-xl border-2 border-primary/20 bg-card">
            {!audioUrl ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all ${
                    isRecording
                      ? "bg-destructive animate-pulse"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isRecording ? <FaStop size={16} /> : <FaMicrophone size={16} />}
                </button>
                <span className="text-sm text-muted-foreground">
                  {isRecording ? "Recording... Tap to stop" : t("startRecording")}
                </span>
                {isRecording && (
                  <motion.div
                    className="flex gap-0.5"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-destructive rounded-full"
                        animate={{ height: [8, 20, 8] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <audio src={audioUrl} controls className="flex-1 h-10" />
                <button
                  type="button"
                  onClick={removeRecording}
                  className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-all"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            )}
          </div>
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
          {submitting ? t("submitting") : t("submitReport")}
        </button>
      </form>
    </motion.div>
  );
}
