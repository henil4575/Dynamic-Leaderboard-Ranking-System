import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../api/leaderboard";
import { motion } from "framer-motion";

const TROPHY = "\uD83C\uDFC6";
const rankColors = {
  1: "from-yellow-400 to-orange-500",
  2: "from-gray-300 to-gray-400",
  3: "from-orange-600 to-orange-700",
};

const rankBg = {
  1: "bg-yellow-500/10 border-yellow-500/30",
  2: "bg-gray-500/10 border-gray-500/30",
  3: "bg-orange-600/10 border-orange-600/30",
};

export default function Leaderboard() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    refetchInterval: 5000,
  });

  if (isLoading)
    return (
      <div className="text-center text-yellow-400 animate-pulse text-xl mt-10">
        Loading leaderboard...
      </div>
    );

  const entries = data?.data?.leaderboard || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-400">{TROPHY} Top 10</h2>
        <button
          onClick={() => refetch()}
          className="text-sm px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition"
        >
          {`\u21BB`} Refresh
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No entries yet. Add some players!
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-xl border ${
                rankBg[entry.rank] || "bg-gray-800/50 border-gray-700/30"
              }`}
            >
             
              <div className="flex items-center gap-4">
                <span
                  className={`text-2xl font-black bg-gradient-to-r ${
                    rankColors[entry.rank] || "from-gray-400 to-gray-500"
                  } bg-clip-text text-transparent w-8`}
                >
                  #{entry.rank}
                </span>
                <div>
                  <p className="font-bold text-white text-lg">
                    {entry.username}
                  </p>
                  <p className="text-xs text-gray-400">{entry.tag}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  {entry.score.toLocaleString()}
                </p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  {entry.velocity !== 0 && (
                    <span
                      className={`text-xs font-medium ${
                        entry.velocity > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {entry.velocity > 0 ? "\u25B2" : "\u25BC"}{" "}
                      {Math.abs(entry.velocity)}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Top {(100 - entry.percentileRank).toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}