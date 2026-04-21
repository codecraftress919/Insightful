"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { BarChart3, TrendingUp, PieChart as PieIcon } from "lucide-react";

const COLORS = ["#8B5CF6", "#06B6D4", "#EC4899", "#3B82F6", "#10B981"]; // Vibrant purple, cyan, pink, blue, emerald

export function ChartsArea({ data, numericKeys, categoricalKeys }) {
  // Cap data to 15 items for clear visualizations
  const chartData = useMemo(() => data ? data.slice(0, 15) : [], [data]);

  if (!data || !numericKeys?.length) {
    return (
      <div className="glass-panel p-8 rounded-3xl text-center text-text-secondary w-full">
        <p>Not enough numeric data available to generate charts.</p>
      </div>
    );
  }

  // Determine axes
  const xAxisKey = categoricalKeys?.length > 0 ? categoricalKeys[0] : numericKeys[0];
  const barDataKey = numericKeys[0];
  const lineDataKey = numericKeys.length > 1 ? numericKeys[1] : numericKeys[0];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel !bg-surface/80 p-4 !rounded-2xl shadow-2xl border-white/10 backdrop-blur-xl">
          <p className="text-text-primary font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}/>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-6">
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 rounded-3xl col-span-1 lg:col-span-2"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-primary" size={20} />
          <h3 className="text-lg font-bold text-text-primary capitalize">
            {barDataKey} by {xAxisKey}
          </h3>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
              <XAxis dataKey={xAxisKey} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
              <Bar dataKey={barDataKey} fill="url(#colorBar)" radius={[6, 6, 0, 0]} barSize={32} name={barDataKey} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-secondary" size={20} />
          <h3 className="text-lg font-bold text-text-primary capitalize">
            Trend: {lineDataKey}
          </h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
              <XAxis dataKey={xAxisKey} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
              <Line type="monotone" dataKey={lineDataKey} stroke="url(#colorLine)" strokeWidth={4} dot={{ fill: '#0A0A0A', stroke: '#06B6D4', strokeWidth: 2, r: 5 }} activeDot={{ r: 8, strokeWidth: 0, fill: '#EC4899' }} name={lineDataKey} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6 rounded-3xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <PieIcon className="text-highlight" size={20} />
          <h3 className="text-lg font-bold text-text-primary capitalize">
            Distribution: {barDataKey}
          </h3>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={chartData.slice(0, 5)} // Limit pie to 5 items to avoid crowding
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey={barDataKey}
                nameKey={xAxisKey}
                stroke="none"
              >
                {chartData.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
