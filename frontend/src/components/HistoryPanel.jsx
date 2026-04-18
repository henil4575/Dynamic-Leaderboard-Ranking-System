import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../api/leaderboard";
import { motion } from "framer-motion";

export default function HistoryPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
    refetchInterval: 10000,
  });

  if (isLoading)
    return <div className="text-center text-yellow-400 animate-pulse mt-10">Loading history...</div>;

  const history = data?.data?.history || [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">{`\u{1F4DC}`} History</h2>

      {history.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No history yet.</div>
      ) : (
        <div className="space-y-3">
          {history.map((entry, i) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-white">{entry.username}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(entry.lastSubmittedAt).toLocaleString()}
                  
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-yellow-400">
                  {entry.score.toLocaleString()}
                </p>
                <p className={`text-xs ${entry.velocity > 0 ? "text-green-400" : entry.velocity < 0 ? "text-red-400" : "text-gray-500"}`}>
                  {entry.velocity > 0 ? "\u25B2" : entry.velocity < 0 ? "\u25BC" : "\u2014"} {Math.abs(entry.velocity)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}