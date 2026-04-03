const Activity = require("../models/Activity");
const User = require("../models/User"); // <-- We pull in the User model
const mongoose = require("mongoose");

/**
 * @desc    Get user's total emissions grouped by type
 * @route   GET /api/reports/breakdown
 * @access  Private
 */
const getEmissionBreakdown = async (req, res) => {
  try {
    // 1. Get the absolute truth from the database, not just the token
    const userId = req.user.id || req.user._id;
    const currentUser = await User.findById(userId);
    const isAdmin = currentUser && currentUser.role === "admin";

    // 2. Admin matches all {}, User matches their specific ID
    const matchStage = isAdmin
      ? {}
      : { userId: new mongoose.Types.ObjectId(userId) };

    const breakdown = await Activity.aggregate([
      { $match: matchStage },
      { $group: { _id: "$type", total: { $sum: "$emission" } } },
    ]);

    res.status(200).json(breakdown);
  } catch (error) {
    res.status(500).json({
      message: "Error generating breakdown report",
      error: error.message,
    });
  }
};

/**
 * @desc    Get emissions trend over time (Daily, Weekly, Monthly, Annual)
 * @route   GET /api/reports/trend?timeframe=monthly
 * @access  Private (Admin sees all, User sees own)
 */
const getEmissionTrend = async (req, res) => {
  try {
    const { timeframe = "monthly" } = req.query;

    // 1. Get the absolute truth from the database
    const userId = req.user.id || req.user._id;
    const currentUser = await User.findById(userId);

    // Make it case-insensitive just in case the DB has "Admin" instead of "admin"
    const isAdmin = currentUser && currentUser.role?.toLowerCase() === "admin";

    // --- 🚨 THE TRUTH SERUM: CHECK YOUR NODE TERMINAL FOR THIS 🚨 ---
    console.log("====================================");
    console.log("1. User ID from Token:", userId);
    console.log("2. Did we find user in DB?:", currentUser ? "YES" : "NO");
    console.log("3. User Role in DB:", currentUser?.role);
    console.log("4. Is Admin Evaluated To:", isAdmin);
    console.log("====================================");

    // 2. Admin matches all {}, User matches their specific ID
    const matchStage = isAdmin
      ? {}
      : { userId: new mongoose.Types.ObjectId(userId) };

    // 3. Dynamic grouping based on timeframe
    let groupStage = {};

    if (timeframe === "daily") {
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalEmission: { $sum: "$emission" },
      };
    } else if (timeframe === "weekly") {
      groupStage = {
        _id: { $isoWeek: "$createdAt" },
        totalEmission: { $sum: "$emission" },
      };
    } else if (timeframe === "monthly") {
      groupStage = {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalEmission: { $sum: "$emission" },
      };
    } else if (timeframe === "annual") {
      groupStage = {
        _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
        totalEmission: { $sum: "$emission" },
      };
    } else {
      return res.status(400).json({ message: "Invalid timeframe provided." });
    }

    const trend = await Activity.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = trend.map((item) => ({
      period: item._id,
      value: item.totalEmission,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Backend Crash:", error);
    res
      .status(500)
      .json({ message: "Error generating trend report", error: error.message });
  }
};

/**
 * @desc    Get user-wise emission leaderboard (Admin only)
 * @route   GET /api/reports/leaderboard
 * @access  Private (Admin)
 */
const getUserLeaderboard = async (req, res) => {
  try {
    // 1. Verify Admin Status
    const userId = req.user.id || req.user._id;
    const currentUser = await User.findById(userId);
    const isAdmin = currentUser && currentUser.role?.toLowerCase() === "admin";

    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    // 2. Aggregate all activities, group by user, and fetch their names
    const leaderboard = await Activity.aggregate([
      {
        $group: {
          _id: "$userId",
          totalEmission: { $sum: "$emission" },
        },
      },
      { $sort: { totalEmission: -1 } }, // Highest emitters at the top
      { $limit: 10 }, // Top 10 users
      {
        $lookup: {
          from: "users", // Matches the 'User' collection in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          name: "$userDetails.name",
          email: "$userDetails.email",
          totalEmission: 1,
        },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating leaderboard", error: error.message });
  }
};
module.exports = { getEmissionBreakdown, getEmissionTrend, getUserLeaderboard };