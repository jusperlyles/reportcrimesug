import { useState } from "react";
import { FaBox } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ReportMissingPropertyPage() {
  const [itemName, setItemName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !description) {
      toast({ title: "Missing fields", description: "Please fill in item name and description", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: "Report Filed", description: "Missing property report has been filed successfully." });
      setItemName(""); setLocation(""); setDescription("");
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaBox className="text-orange-500" /> Report Missing Property
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Report lost or stolen property.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Item Name *</label>
          <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="What was lost or stolen?" className="w-full p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where did you lose it?" className="w-full p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Description *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item in detail..." rows={4} className="w-full p-3 rounded-xl border-2 border-primary/20 bg-card text-foreground text-sm focus:outline-none focus:border-primary transition-all resize-none" />
        </div>
        <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-xl text-sm font-bold text-primary-foreground transition-all disabled:opacity-50" style={{ background: "var(--gradient-primary)" }}>
          {submitting ? "Filing Report..." : "File Report"}
        </button>
      </form>
    </motion.div>
  );
}
