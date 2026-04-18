const performanceStore = {};
// This is part of Performance where response time is calculated 
const trackPerformance = (req, res, next) => {
  const start = process.hrtime.bigint();
  const route = req.path;

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1000000;

    if (!performanceStore[route]) {
      performanceStore[route] = { totalTime: 0, count: 0 };
    }

    performanceStore[route].totalTime += durationMs;
    performanceStore[route].count += 1;
  });

  next();
};

// This averages the total response time
const getPerformanceStats = () => {
  const stats = {};
  for (const [route, data] of Object.entries(performanceStore)) {
    stats[route] = {
      avgResponseTimeMs: parseFloat((data.totalTime / data.count).toFixed(3)),
      totalRequests: data.count,
    };
  }
  return stats;
};

module.exports = { trackPerformance, getPerformanceStats };