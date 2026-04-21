"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileType, CheckCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseCSV, parseJSON } from "@/utils/parseData";

export function FileUpload({ onDataLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let parsed;
      if (file.name.endsWith(".csv")) {
        parsed = await parseCSV(file);
      } else if (file.name.endsWith(".json")) {
        parsed = await parseJSON(file);
      } else {
        throw new Error("Unsupported file format. Please upload CSV or JSON.");
      }
      
      setSuccess(true);
      setTimeout(() => {
        onDataLoaded({ ...parsed, fileName: file.name, fileSize: file.size, timestamp: Date.now() });
      }, 800); // slight delay to show success animation
    } catch (err) {
      setError(err.message || "Failed to parse file");
    } finally {
      setLoading(false);
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div 
        {...getRootProps()} 
        className={`glass-panel relative flex flex-col items-center justify-center w-full h-80 rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden group
          ${isDragActive ? "border-primary bg-primary/10 shadow-[0_0_50px_-10px_rgba(139,92,246,0.3)] scale-[1.02]" : "border-white/10 hover:border-primary/50 hover:bg-white/5"}
          ${isDragReject ? "border-highlight bg-highlight/10 shadow-[0_0_50px_-10px_rgba(244,63,94,0.3)]" : ""}
          ${success ? "border-secondary bg-secondary/10 shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]" : ""}
        `}
      >
        {/* Animated Glow on Drag */}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 transition-opacity duration-500 ${isDragActive ? 'opacity-100' : 'group-hover:opacity-50'}`} />
        
        <div className="relative z-10 flex w-full h-full justify-center items-center">
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-text-primary font-medium text-lg">Parsing Data...</p>
            </motion.div>
          ) : success ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-secondary"
            >
              <CheckCircle size={64} className="mb-4" />
              <p className="text-xl font-semibold">Upload Successful!</p>
              <p className="text-text-secondary mt-2">Generating your smart dashboard...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center text-center p-6"
            >
                <div className={`p-4 rounded-full mb-6 relative ${isDragActive ? 'text-primary scale-110' : 'text-primary/70 group-hover:text-primary group-hover:scale-105'} transition-all duration-300`}>
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                  <div className="relative glass-panel bg-white/5 p-4 rounded-full border border-white/10">
                    <UploadCloud size={48} className={isDragActive ? "animate-pulse" : ""} />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-text-primary mb-3 tracking-tight">
                  {isDragActive ? "Drop to Ignite" : "Drag & Drop to Analyze"}
                </h3>
                <p className="text-text-secondary mb-8 max-w-sm text-base leading-relaxed">
                  Upload your data to instantly generate AI insights and stunning visualizations.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-t border-white/20 text-xs font-bold text-text-primary uppercase tracking-wider shadow-lg">
                    <FileType size={16} className="text-primary" /> CSV
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-t border-white/20 text-xs font-bold text-text-primary uppercase tracking-wider shadow-lg">
                    <FileType size={16} className="text-secondary" /> JSON
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-highlight/10 border border-highlight/20 flex items-start gap-3"
        >
          <AlertCircle className="text-highlight shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="text-highlight font-medium">Upload Error</h4>
            <p className="text-sm text-text-secondary mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-text-secondary hover:text-text-primary">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
