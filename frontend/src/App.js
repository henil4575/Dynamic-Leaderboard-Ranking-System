

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LeaderboardPage from "./pages/LeaderboardPage";
import AddPage from "./pages/AddPage";
import RemovePage from "./pages/RemovePage";
import StatsPage from "./pages/StatsPage";
import PerformancePage from "./pages/PerformancePage";
import HistoryPage from "./pages/HistoryPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-950 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/add" element={<AddPage />} />
            <Route path="/remove" element={<RemovePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}