"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, FileType, Calendar, Clock, Trash2 } from "lucide-react";
import clsx from "clsx";

export default function Timeline() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("uploadHistory");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      console.error("Could not load history");
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("uploadHistory");
    setHistory([]);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto w-full min-h-full py-8 text-text-primary">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <History className="text-primary" size={28} />
            Upload Timeline
          </h1>
          <p className="text-text-secondary mt-1">View your historical data uploads without needing a database.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 border border-highlight/50 bg-highlight/10 text-highlight rounded-xl hover:bg-highlight hover:text-white transition-colors duration-300 shadow-sm"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 glass-panel rounded-3xl mt-12 border border-border text-center">
          <History className="text-text-secondary mb-4 opacity-50" size={64} />
          <h3 className="text-xl font-semibold mb-2">No Uploads Yet</h3>
          <p className="text-text-secondary max-w-sm">
            Your timeline is currently empty. Go to the dashboard and upload a CSV or JSON file to see it recorded here.
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-primary/30 pl-8 ml-4 space-y-8 mt-12 pb-10">
          {history.map((entry, index) => {
            const dateObj = new Date(entry.timestamp);
            return (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={entry.id} 
                className="relative glass-panel rounded-2xl p-6 border border-white/5 hover:border-primary/50 transition-colors duration-300 shadow-md group"
              >
                {/* Timeline Dot */}
                <span className="absolute -left-[41px] top-8 w-5 h-5 rounded-full bg-primary ring-4 ring-background shadow-[0_0_15px_#8b5cf6]" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0 mt-1">
                      <FileType size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{entry.fileName}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mt-1 tracking-wide">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {dateObj.toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {dateObj.toLocaleTimeString()}</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded text-xs border border-border">{formatBytes(entry.fileSize)}</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded text-xs border border-border">{entry.rows} rows</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
