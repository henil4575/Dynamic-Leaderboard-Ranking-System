import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

export const addEntry = (data) => API.post("/add", data);
export const removeEntry = (data) => API.delete("/remove", { data });
export const getLeaderboard = () => API.get("/leaderboard");
export const getInfo = () => API.get("/info");
export const getPerformance = () => API.get("/performance");
export const getHistory = () => API.get("/history");