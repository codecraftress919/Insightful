"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Database, Hash, BarChart2, CheckCircle2 } from "lucide-react";

const STAT_ICONS = [
  <Database size={24} className="text-primary group-hover:animate-pulse" key="db" />,
  <Hash size={24} className="text-secondary group-hover:animate-bounce" key="hash" />,
  <BarChart2 size={24} className="text-highlight group-hover:animate-pulse" key="bar" />,
  <CheckCircle2 size={24} className="text-primary group-hover:animate-bounce" key="check" />
];

export function DashboardStats({ dataSummary, numericKeys }) {
  if (!dataSummary) return null;

  const stats = [
    {
      title: "Total Records",
      value: dataSummary.totalRows,
      icon: STAT_ICONS[0],
      delay: 0.1
    },
    {
      title: "Total Columns",
      value: dataSummary.totalColumns,
      icon: STAT_ICONS[1],
      delay: 0.2
    },
    {
      title: "Metric Columns",
      value: numericKeys?.length || 0,
      icon: STAT_ICONS[2],
      delay: 0.3
    },
    {
      title: "Data Health",
      value: 100, // Mock healthy data metric
      suffix: "%",
      icon: STAT_ICONS[3],
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay, duration: 0.5, ease: "easeOut" }}
          className="glass-panel p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl -z-10" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-text-secondary text-sm font-medium mb-1">{stat.title}</span>
              <div className="text-3xl font-bold text-text-primary">
                <CountUp 
                  end={stat.value} 
                  duration={2.5} 
                  separator="," 
                  suffix={stat.suffix || ""} 
                />
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-surface/50 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300 backdrop-blur-md">
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
