const Activity = require('../models/Activity');

/**
 * @desc    Get user's total emissions grouped by type (for Doughnut Chart)
 * @route   GET /api/reports/breakdown
 * @access  Private
 */
const getEmissionBreakdown = async (req, res) => {
    try {
        // Use MongoDB Aggregation to group by 'type' and sum the emissions for the logged-in user
        const breakdown = await Activity.aggregate([
            { $match: { userId: req.user._id } },
            { $group: { _id: "$type", total: { $sum: "$emission" } } }
        ]);
        
        res.status(200).json(breakdown);
    } catch (error) {
        res.status(500).json({ message: 'Error generating breakdown report', error: error.message });
    }
};

/**
 * @desc    Get user's emissions trend over time (for Line/Bar Chart)
 * @route   GET /api/reports/trend
 * @access  Private
 */
const getEmissionTrend = async (req, res) => {
    try {
        // Group activities by Date (Year-Month-Day) to show a timeline trend
        const trend = await Activity.aggregate([
            { $match: { userId: req.user._id } },
            { 
                $group: { 
                    // Format the date to YYYY-MM-DD for the chart X-axis
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                    dailyTotal: { $sum: "$emission" } 
                } 
            },
            { $sort: { _id: 1 } } // Sort by date ascending (oldest to newest)
        ]);

        res.status(200).json(trend);
    } catch (error) {
        res.status(500).json({ message: 'Error generating trend report', error: error.message });
    }
};

module.exports = { getEmissionBreakdown, getEmissionTrend };