import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/leaderboard", label: "\u{1F3C6} Leaderboard" },
  { path: "/add", label: "\u2795  Add" },
  { path: "/remove", label: "\u{1F5D1}\uFE0F Remove" },
  { path: "/stats", label: "\u{1F4CA} Stats" },
  { path: "/performance", label: "\u26A1 Performance" },
  { path: "/history", label: "\u{1F4DC} History" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link to="/" className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {`\u{1F3C6}`}  LeaderBoard
        </Link>

        
        <div className="flex gap-1 flex-wrap">
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-yellow-500 text-gray-900"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}