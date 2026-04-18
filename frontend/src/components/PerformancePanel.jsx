import { useQuery } from "@tanstack/react-query";
import { getPerformance } from "../api/leaderboard";
import { motion } from "framer-motion";

export default function PerformancePanel() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["performance"],
    queryFn: getPerformance,
    refetchInterval: 10000,
  });

  if (isLoading)
    return <div className="text-center text-yellow-400 animate-pulse mt-10">Loading performance...</div>;

  const perf = data?.data?.performance || {};
  const entries = Object.entries(perf);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">{`\u26A1`} Performance</h2>
        <button
          onClick={() => refetch()}
          className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition"
        >
          {`\u21BB`} Refresh
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No performance data yet. Hit some endpoints!</div>
      ) : (
        <div className="space-y-3">
          {entries.map(([route, stats], i) => (
            <motion.div
              key={route}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-white font-mono">{route}</p>
                <p className="text-gray-500 text-xs">{stats.totalRequests} requests</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${
                  stats.avgResponseTimeMs < 100 ? "text-green-400" :
                  stats.avgResponseTimeMs < 300 ? "text-yellow-400" : "text-red-400"
                }`}>
                  {stats.avgResponseTimeMs} ms
                </p>
                <p className="text-xs text-gray-500">avg response</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}


