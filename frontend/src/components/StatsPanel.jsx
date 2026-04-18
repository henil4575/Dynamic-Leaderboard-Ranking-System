import { useQuery } from "@tanstack/react-query";
import { getInfo } from "../api/leaderboard";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function StatsPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["info"],
    queryFn: getInfo,
  });

  if (isLoading)
    return <div className="text-center text-yellow-400 animate-pulse mt-10">Loading stats...</div>;

  const stats = data?.data?.stats;

  if (!stats || Object.keys(stats).length === 0)
    return <div className="text-center text-gray-500 mt-10">No data available yet.</div>;

  const statCards = [
    { label: "Total Players", value: stats.totalEntries, color: "text-yellow-400" },
    { label: "Mean Score", value: stats.mean, color: "text-blue-400" },
    { label: "Median Score", value: stats.median, color: "text-green-400" },
    { label: "Std Deviation", value: stats.stdDev, color: "text-purple-400" },
    { label: "Q1", value: stats.q1, color: "text-orange-400" },
    { label: "Q3", value: stats.q3, color: "text-pink-400" },
    { label: "IQR", value: stats.iqr, color: "text-cyan-400" },
    { label: "Min Score", value: stats.min, color: "text-red-400" },
    { label: "Max Score", value: stats.max, color: "text-emerald-400" },
  ];

  const distData = Object.entries(stats.scoreDistribution || {}).map(([range, count]) => ({
    range,
    count,
  }));

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

  return (
    <div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">{`\u{1F4CA}`} Statistics</h2>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center"
          >
            <p className="text-gray-400 text-xs mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {distData.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distData}>
              <XAxis dataKey="range" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#f9fafb" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {distData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}