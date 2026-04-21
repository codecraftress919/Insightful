"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { DashboardStats } from "@/components/DashboardStats";
import { ChartsArea } from "@/components/ChartsArea";
import { AIInsights } from "@/components/AIInsights";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw } from "lucide-react";

export default function Home() {
  const [dataPayload, setDataPayload] = useState(null);

  const resetDashboard = () => setDataPayload(null);

  const handleDataLoaded = (payload) => {
    setDataPayload(payload);
    try {
      const history = JSON.parse(localStorage.getItem("uploadHistory") || "[]");
      const newEntry = {
        id: Date.now(),
        fileName: payload.fileName || 'Data Upload',
        fileSize: payload.fileSize || 0,
        rows: payload.data ? payload.data.length : 0,
        timestamp: payload.timestamp || Date.now(),
      };
      // Keep last 50
      history.unshift(newEntry);
      localStorage.setItem("uploadHistory", JSON.stringify(history.slice(0, 50)));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto w-full min-h-full flex flex-col">
      {/* Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="mesh-bg-blob bg-primary/30 w-[50vw] h-[50vw] top-[-10%] left-[-10%]" />
        <div className="mesh-bg-blob bg-secondary/20 w-[40vw] h-[40vw] bottom-[-5%] right-[-5%]" style={{ animationDelay: '2s', animationDuration: '12s' }} />
        <div className="mesh-bg-blob bg-highlight/20 w-[30vw] h-[30vw] top-[40%] left-[60%]" style={{ animationDelay: '4s', animationDuration: '15s' }} />
      </div>

      <AnimatePresence mode="wait">
        {!dataPayload ? (
          <motion.div 
            key="upload-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center p-4 py-12"
          >
            <div className="text-center mb-10 relative z-10">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-text-primary">
                Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">SmartUI</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                Instantly transform your raw CSV or JSON data into beautiful, insightful dashboards powered by modern aesthetics.
              </p>
            </div>
            
            <FileUpload onDataLoaded={handleDataLoaded} />
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-8 pb-10"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Dashboard Overview</h1>
                <p className="text-text-secondary">Analyzing your structured data</p>
              </div>
              <button 
                onClick={resetDashboard}
                className="group flex items-center gap-2 px-5 py-2.5 glass-panel hover:bg-surface/80 rounded-full text-text-primary transition-all duration-300 focus:ring-2 focus:ring-primary focus:outline-none hover:shadow-lg hover:shadow-primary/20"
              >
                <RefreshCcw size={16} className="group-hover:-rotate-180 transition-transform duration-500" /> 
                <span className="font-medium">Upload New Data</span>
              </button>
            </div>

            <DashboardStats 
              dataSummary={dataPayload.summary} 
              numericKeys={dataPayload.numericKeys} 
            />

            <ChartsArea 
              data={dataPayload.data}
              categoricalKeys={dataPayload.categoricalKeys}
              numericKeys={dataPayload.numericKeys}
            />

            <AIInsights 
              data={dataPayload.data}
              numericKeys={dataPayload.numericKeys}
              categoricalKeys={dataPayload.categoricalKeys}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
