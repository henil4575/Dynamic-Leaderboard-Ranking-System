const express = require("express");
const asyncHandler = require("express-async-handler");
const Entry = require("../models/Entry.model");
const { getPerformanceStats } = require("../middleware/performance.middleware");

const router = express.Router();

//Here we recalculate the ranks and percentiles for each entries
const recalculateRanks = async () => {
  const entries = await Entry.find().sort({ score: -1 });
  const total = entries.length;

  const bulkOps = entries.map((entry, index) => {
    const rank = index + 1;
    const percentileRank = parseFloat(
      (((total - rank) / total) * 100).toFixed(2)
    );
    const tag =
      rank === 1 ? "Legend" :
      rank <= 3 ? "Elite" :
      rank <= 10 ? "Top 10" : "Player";

    return {
      updateOne: {
        filter: { _id: entry._id },
        update: { $set: { rank, percentileRank, tag } },
      },
    };
  });

  if (bulkOps.length > 0) await Entry.bulkWrite(bulkOps);
};

//Here we have assigned the badge tag based on the rank
const assignTag = (rank) => {
  if (rank === 1) return "Legend";
  if (rank <= 3) return "Elite";
  if (rank <= 10) return "Top 10";
  return "Player";
};

// below is the swagger annotation
/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add or update a leaderboard entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Entry added/updated
 */
router.post(
  "/add",
  asyncHandler(async (req, res) => {
  const { username, score } = req.body;
  const parsedScore = Number(score);

  if (!username || score === undefined || score === null) {
    res.status(400);
    throw new Error("Username and score are required.");
  }
  if (isNaN(parsedScore)) {
    res.status(400);
    throw new Error("Score must be a valid number!");
  }
  if (parsedScore < 0 || Object.is(parsedScore, -0)) {
    res.status(400);
    throw new Error("Score cannot be negative!");
  }
  if (!isFinite(parsedScore)) {
    res.status(400);
    throw new Error("Score must be a finite number!");
  }

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
  let entry = await Entry.findOne({ username });

  if (entry) {
    const oldScore = entry.score;
    entry.scoreHistory.push(oldScore);
    entry.velocity = parsedScore - oldScore;
    entry.score = parsedScore;
    entry.submissionCount += 1;
    entry.ipAddress = ip;
    entry.lastSubmittedAt = new Date();
    await entry.save();
  } else {
    entry = await Entry.create({
      username,
      score: parsedScore,
      scoreHistory: [],
      velocity: 0,
      ipAddress: ip,
      lastSubmittedAt: new Date(),
    });
  }

  await recalculateRanks();

  const fresh = await Entry.findOne({ username });
  res.status(201).json({
    success: true,
    message: "Entry saved successfully.",
    data: fresh,
  });
})
);

/**
 * @swagger
 * /remove:
 *   delete:
 *     summary: Remove a leaderboard entry by username
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entry removed
 */
router.delete(
  "/remove",
  asyncHandler(async (req, res) => {
    const { username } = req.body;

    if (!username) {
      res.status(400);
      throw new Error("Username is required.");
    }

    const entry = await Entry.findOneAndDelete({ username });

    if (!entry) {
      res.status(404);
      throw new Error(`No entry found for username: ${username}`);
    }

    await recalculateRanks();

    res.status(200).json({
      success: true,
      message: `Entry for "${username}" removed.`,
    });
  })
);

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get top 10 leaderboard entries
 *     responses:
 *       200:
 *         description: Top 10 entries
 */
router.get(
  "/leaderboard",
  asyncHandler(async (req, res) => {
    const top10 = await Entry.find()
      .sort({ score: -1 })
      .limit(10)
      .select("username score rank percentileRank velocity tag createdAt");

    res.status(200).json({
      success: true,
      count: top10.length,
      leaderboard: top10,
    });
  })
);


/**
 * @swagger
 * /info:
 *   get:
 *     summary: Returns quantitative statistics for all entries
 *     responses:
 *       200:
 *         description: Stats object
 */
router.get(
  "/info",
  asyncHandler(async (req, res) => {
    const entries = await Entry.find().sort({ score: 1 });
    const scores = entries.map((e) => e.score);
    const n = scores.length;

    if (n === 0) {
      return res.status(200).json({ success: true, message: "No entries yet.", stats: {} });
    }

    const mean = scores.reduce((a, b) => a + b, 0) / n;
    const median =
      n % 2 === 0
        ? (scores[n / 2 - 1] + scores[n / 2]) / 2
        : scores[Math.floor(n / 2)];

    const q1 = scores[Math.floor(n * 0.25)];
    const q3 = scores[Math.floor(n * 0.75)];

    const variance = scores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / n;
    const stdDev = parseFloat(Math.sqrt(variance).toFixed(2));

    const min = scores[0];
    const max = scores[n - 1];

    // Here we have Score distribution below 
    const bucketSize = Math.ceil((max - min + 1) / 5);
    const distribution = {};
    for (let i = 0; i < 5; i++) {
      const low = min + i * bucketSize;
      const high = low + bucketSize - 1;
      const label = `${low}-${high}`;
      distribution[label] = scores.filter((s) => s >= low && s <= high).length;
    }

    res.status(200).json({
      success: true,
      stats: {
        totalEntries: n,
        mean: parseFloat(mean.toFixed(2)),
        median,
        q1,
        q3,
        stdDev,
        min,
        max,
        iqr: q3 - q1,
        scoreDistribution: distribution,
      },
    });
  })
);


/**
 * @swagger
 * /performance:
 *   get:
 *     summary: Returns average response time per endpoint
 *     responses:
 *       200:
 *         description: Performance stats
 */
router.get(
  "/performance",
  asyncHandler(async (req, res) => {
    const stats = getPerformanceStats();
    res.status(200).json({
      success: true,
      performance: stats,
    });
  })
);


/**
 * @swagger
 * /history:
 *   get:
 *     summary: Returns submission history with optional filters
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered history
 */
router.get(
  "/history",
  asyncHandler(async (req, res) => {
    const { username, from, to } = req.query;
    const filter = {};

    if (username) filter.username = username;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const history = await Entry.find(filter)
      .sort({ lastSubmittedAt: -1 })
      .select("username score velocity submissionCount lastSubmittedAt createdAt");

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  })
);

module.exports = router;