import { useState } from "react";
import { removeEntry } from "../api/leaderboard";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function RemoveEntry() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRemove = async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await removeEntry({ username });
      setStatus({ type: "success", msg: res.data.message });
      queryClient.invalidateQueries(["leaderboard"]);
      setUsername("");
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Error" });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
    >
      <h2 className="text-2xl font-bold text-red-400 mb-6">{`\u{1F5D1}\uFE0F`} Remove Entry</h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. ironman"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <button
          onClick={handleRemove}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Removing..." : "Remove from Leaderboard"}
        </button>

        {status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center text-sm py-2 rounded-lg ${
              status.type === "success"
                ? "text-green-400 bg-green-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            {status.msg}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}