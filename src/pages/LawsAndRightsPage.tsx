import { FaGavel, FaBook, FaBalanceScale } from "react-icons/fa";
import { motion } from "framer-motion";

const LAWS = [
  { title: "Constitution of Uganda, 1995", desc: "Chapter 4 – Bill of Rights: Right to life, dignity, liberty, fair trial, legal representation.", icon: FaBalanceScale, color: "hsl(234 85% 65%)" },
  { title: "Penal Code Act (Cap 120)", desc: "Criminal offences and penalties including theft, assault, murder, fraud, and more.", icon: FaGavel, color: "hsl(0 84% 60%)" },
  { title: "Domestic Violence Act, 2010", desc: "Criminalises physical, sexual, emotional and economic abuse within households.", icon: FaBook, color: "hsl(330 81% 60%)" },
  { title: "Computer Misuse Act, 2011", desc: "Covers cybercrime, unauthorised access, cyber harassment, and electronic fraud.", icon: FaBook, color: "hsl(192 91% 36%)" },
  { title: "Narcotic Drugs Act", desc: "Penalties for possession (up to 10 yrs), trafficking (up to 25 yrs), and funding trafficking (life).", icon: FaGavel, color: "hsl(38 92% 50%)" },
  { title: "Land Act (Cap 227)", desc: "Protects kibanja holders, regulates land ownership and eviction procedures.", icon: FaBalanceScale, color: "hsl(142 71% 45%)" },
  { title: "Witness Protection Act, 2021", desc: "Legal protection for witnesses against intimidation and retaliation.", icon: FaBook, color: "hsl(263 70% 50%)" },
];

export function LawsAndRightsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-1">
        <FaBalanceScale className="text-primary" /> Laws & Rights
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Key Ugandan laws and your constitutional rights.</p>

      <div className="space-y-3">
        {LAWS.map((law, i) => {
          const Icon = law.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: law.color }}>
                  <Icon className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{law.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{law.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
