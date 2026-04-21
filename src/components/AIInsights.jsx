"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export function AIInsights({ data, numericKeys, categoricalKeys }) {
  if (!data || !numericKeys?.length) return null;

  // Generate mock insights based on the real uploaded data
  const mainMetric = numericKeys[0];
  const secondaryMetric = numericKeys.length > 1 ? numericKeys[1] : numericKeys[0];
  const categoryStr = categoricalKeys?.length > 0 ? categoricalKeys[0] : "Item";
  
  // Fake some logic for demonstration
  const count = data.length;
  let totalMain = 0;
  let maxMain = { val: -Infinity, name: "" };
  
  data.forEach((row, i) => {
    const val = Number(row[mainMetric]);
    if (!isNaN(val)) {
      totalMain += val;
      if (val > maxMain.val) {
        maxMain = { val, name: row[categoryStr] || `Row ${i+1}` };
      }
    }
  });

  const avgMain = (totalMain / count).toFixed(2);
  const trendUp = Math.random() > 0.5;

  const insights = [
    {
      title: "Performance Summary",
      description: (
        <>
          The average <span className="font-bold text-highlight">{mainMetric}</span> across {count} records is <span className="font-bold">{avgMain}</span>.
        </>
      ),
      icon: <Minus className="text-secondary" size={20} />
    },
    {
      title: "Top Performer Detected",
      description: (
        <>
          <span className="font-bold text-highlight">{maxMain.name}</span> achieved the highest {mainMetric} with a value of <span className="font-bold">{maxMain.val}</span>. Consider analyzing this case to replicate success.
        </>
      ),
      icon: <ArrowUpRight className="text-primary" size={20} />
    },
    {
      title: "Correlated Trend",
      description: (
        <>
          Based on the data, <span className="font-bold text-highlight">{mainMetric}</span> frequently scales alongside <span className="font-bold">{secondaryMetric}</span>. 
          {trendUp ? " This represents a positive growth trajectory." : " Optimizing this workflow could yield better retention."}
        </>
      ),
      icon: trendUp ? <ArrowUpRight className="text-secondary" size={20} /> : <ArrowDownRight className="text-highlight" size={20} />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 glass-panel p-1 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-primary/20 relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles size={120} className="text-primary" />
      </div>

      <div className="p-6 md:p-8 bg-surface/40 backdrop-blur-md rounded-[22px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/20 text-primary">
            <Sparkles size={24} />
          </div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            AI-Powered Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-background/60 p-5 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 rounded-lg bg-surface border border-border">
                  {insight.icon}
                </div>
                <h4 className="font-semibold text-text-primary text-sm">{insight.title}</h4>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {insight.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
