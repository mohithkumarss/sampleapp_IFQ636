const Activity = require("../models/Activity");

// @desc    Get personalized carbon reduction recommendations
// @route   GET /api/recommendations
const getRecommendations = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user.id });

    // If no data, give a generic welcome message
    if (activities.length === 0) {
      return res.json({
        suggestion:
          "Log your first activity to start receiving personalized insights!",
      });
    }

    // 1. Group emissions by category
    const categoryTotals = activities.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.emission;
      return acc;
    }, {});

    // 2. Find the category with the highest emissions
    const highestCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b,
    );

    // 3. Generate a targeted suggestion based on their worst category
    let suggestion = "";
    switch (highestCategory.toLowerCase()) {
      case "transport":
        suggestion =
          "Your highest footprint comes from Transport. Consider carpooling, using public transit, or biking for short trips to see a massive reduction.";
        break;
      case "electricity":
      case "energy":
        suggestion =
          "Electricity usage is your largest contributor. Try switching to LED bulbs, unplugging idle devices, or lowering your thermostat by 1 degree.";
        break;
      case "food":
      case "diet":
        suggestion =
          "Diet contributes most to your footprint right now. Replacing beef with chicken or plant-based meals twice a week can drastically lower your impact.";
        break;
      default:
        suggestion = `Look into reducing your ${highestCategory} usage. Small daily habit changes can make a huge difference over a year!`;
    }

    res.json({ highestCategory, suggestion });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating recommendations",
        error: error.message,
      });
  }
};

module.exports = { getRecommendations };
