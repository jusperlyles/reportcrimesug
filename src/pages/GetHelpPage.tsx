import { useState, useRef, useEffect, useCallback } from "react";
import {
  FaWhatsapp, FaSms, FaPhone, FaEnvelope, FaRobot,
  FaPaperPlane, FaTimes, FaUser, FaShieldAlt, FaGavel,
  FaUserFriends, FaSearch, FaHandsHelping, FaFacebook,
  FaTwitter, FaInstagram,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/* Knowledge Base */
const KB: Record<string, { patterns: string[]; response: string }> = {
  emergency: {
    patterns: ["emergency", "urgent", "help me", "danger", "attacked", "sos", "999", "112"],
    response: `🚨 **EMERGENCY RESPONSE**\n\nCall these numbers **right now**:\n\n• 📞 **999** – Uganda Police Force (free, 24/7)\n• 📞 **112** – General Emergency (all networks)\n• 📞 **0800-199-699** – UPF Toll-free hotline\n• 📞 **0414-343-088** – Kampala CPS\n\nIf you are in immediate danger:\n1. Get to a safe location first\n2. Call 999 immediately\n3. Stay on the line with the operator`,
  },
  report_crime: {
    patterns: ["report crime", "how to report", "submit report", "file report"],
    response: `📝 **How to Report a Crime**\n\n1. Go to **Report Crime** from the dashboard\n2. Select the crime type\n3. Provide location (use auto-detect!)\n4. Describe the incident in detail\n5. Upload evidence if available\n6. Submit – you'll receive a Case Reference Number\n\nFor emergencies, always call **999** first.`,
  },
  missing_person: {
    patterns: ["missing person", "someone missing", "find person", "lost person"],
    response: `👤 **Missing Person?**\n\nReport immediately:\n1. Go to **Missing Persons** section\n2. File a detailed report\n3. Include recent photos\n\nContact:\n• Police: **999**\n• Child Helpline: **116**\n• Red Cross: **0417-258-305**`,
  },
  rights: {
    patterns: ["rights", "my rights", "legal rights", "constitution", "law"],
    response: `⚖️ **Your Rights (Uganda Constitution)**\n\n• Right to life & dignity\n• Right to fair trial\n• Right to legal representation\n• Right to remain silent\n• Freedom from torture\n• Right to bail for bailable offences\n\nBrowse **Laws & Rights** for detailed information.`,
  },
};

type Message = { role: "user" | "bot"; text: string };

function matchKB(input: string): string | null {
  const lower = input.toLowerCase();
  for (const entry of Object.values(KB)) {
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern)) return entry.response;
    }
  }
  return null;
}

const CONTACT_METHODS = [
  { icon: FaPhone, label: "Emergency", value: "999", href: "tel:999", color: "hsl(0 84% 60%)" },
  { icon: FaWhatsapp, label: "WhatsApp", value: "Chat", href: "https://wa.me/256800199699", color: "hsl(142 71% 45%)" },
  { icon: FaSms, label: "SMS", value: "Text", href: "sms:999", color: "hsl(210 98% 65%)" },
  { icon: FaEnvelope, label: "Email", value: "Report", href: "mailto:support@reportcrime.ug", color: "hsl(270 50% 55%)" },
];

const SOCIAL_LINKS = [
  { icon: FaFacebook, label: "Facebook", href: "https://facebook.com/UgandaPoliceForce", color: "hsl(217 91% 60%)" },
  { icon: FaTwitter, label: "Twitter/X", href: "https://x.com/aboraborauganda", color: "hsl(200 90% 62%)" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/ugandapoliceforce", color: "hsl(330 81% 60%)" },
];

export function GetHelpPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "👋 Hi! I'm the ReportCrime AI assistant. How can I help you today?\n\nTry asking about:\n• Emergency contacts\n• How to report a crime\n• Missing persons\n• Your legal rights" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    setTimeout(() => {
      const kbMatch = matchKB(userMsg);
      const botResponse = kbMatch || "I'm not sure about that. Try asking about **emergency contacts**, **reporting crimes**, **missing persons**, or **your rights**. For urgent help, call **999**.";
      setMessages((prev) => [...prev, { role: "bot", text: botResponse }]);
    }, 600);
  }, [input]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaHandsHelping className="text-success" /> Get Help
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Contact support, emergency services, or chat with our AI assistant.</p>

      {/* Contact Methods */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {CONTACT_METHODS.map((method, i) => {
          const Icon = method.icon;
          return (
            <motion.a
              key={method.label}
              href={method.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: method.color }}>
                <Icon className="text-white" size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{method.label}</p>
                <p className="text-xs text-muted-foreground">{method.value}</p>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Social Media */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Follow Uganda Police Force</h2>
        <div className="flex gap-3">
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                style={{ background: link.color }}
              >
                <Icon className="text-white" size={16} />
              </a>
            );
          })}
        </div>
      </div>

      {/* AI Chat Button */}
      {!chatOpen && (
        <motion.button
          onClick={() => setChatOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-40"
          style={{ background: "var(--gradient-primary)" }}
        >
          <FaRobot className="text-white text-xl" />
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-[calc(100vw-2rem)] max-w-sm h-[28rem] bg-card rounded-2xl border border-border shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50" style={{ background: "var(--gradient-primary)" }}>
              <div className="flex items-center gap-2">
                <FaRobot className="text-white" />
                <span className="text-white font-semibold text-sm">AI Assistant</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white">
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 p-3 border-t border-border/50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 rounded-xl bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={sendMessage}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <FaPaperPlane size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
