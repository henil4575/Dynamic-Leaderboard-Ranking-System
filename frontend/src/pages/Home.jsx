import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard, getInfo } from "../api/leaderboard";

export default function Home() {
  const navigate = useNavigate();
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [topScore, setTopScore] = useState("-");
  const [topPlayer, setTopPlayer] = useState("-");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const lb = await getLeaderboard();
        const info = await getInfo();
        const entries = lb.data.leaderboard;
        if (entries.length > 0) {
          setTopScore(entries[0].score.toLocaleString());
          setTopPlayer(entries[0].username);
        }
        setTotalPlayers(info.data.stats.totalEntries || 0);
      } catch (e) {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1.5 text-yellow-400 text-xs font-medium mb-8">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping inline-block" />
          LIVE LEADERBOARD SYSTEM
        </div>

       
        <h1 className="text-6xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
            Dynamic
          </span>
          <br />
          <span className="text-white">Leaderboard System</span>
        </h1>

        <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
          Real-time rankings • Score velocity tracking • Live statistics • Performance monitoring
        </p>

        
        <div className="flex justify-center gap-4 flex-wrap mb-12">
          <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl px-8 py-5 min-w-[160px]">
            <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Total Players</p>
            <p className="text-4xl font-black text-yellow-400">{totalPlayers}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl px-8 py-5 min-w-[160px]">
            <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Top Score</p>
            <p className="text-4xl font-black text-orange-400">{topScore}</p>
          </div>
          <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl px-8 py-5 min-w-[160px]">
            <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">{`\uD83D\uDC51`} Legend</p>
            <p className="text-4xl font-black text-red-400 truncate max-w-[140px]">{topPlayer}</p>
          </div>
        </div>

        
        <div className="flex justify-center gap-4 flex-wrap mb-16">
          <button
            onClick={() => navigate("/leaderboard")}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold rounded-xl hover:opacity-90 transition text-base"
          >
            {`\u{1F3C6}`} View Leaderboard
          </button>
          <button
            onClick={() => navigate("/add")}
            className="px-8 py-4 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-700 transition text-base"
          >
            {`\u2795`} Add Player
          </button>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
          {[
            { icon: "\u{1F3C6}", title: "Top 10 Rankings", desc: "Live sorted leaderboard with auto-refresh every 5 seconds" },
            { icon: "\u{1F680}", title: "Score Velocity", desc: "Track how fast players are climbing or falling in ranks" },
            { icon: "\u{1F4CA}", title: "Live Statistics", desc: "Mean, median, std deviation, quartiles & score distribution" },
            { icon: "\u{1F4DC}", title: "History Log", desc: "Full submission history with timestamp tracking" },
            { icon: "\u26A1", title: "Performance", desc: "Real-time API response time monitoring per endpoint" },
            { icon: "\uD83D\uDC51", title: "Badge System", desc: "Auto badges — Legend, Elite, Top 10 based on rank" },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 hover:border-yellow-500/30 transition"
            >
              <p className="text-2xl mb-2">{card.icon}</p>
              <p className="font-bold text-white text-sm mb-1">{card.title}</p>
              <p className="text-gray-500 text-xs">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}