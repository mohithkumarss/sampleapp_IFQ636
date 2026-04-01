const User = require('../models/User');
const Activity = require('../models/Activity');
const EmissionFactor = require('../models/EmissionFactor');

/**
 * @desc    Get high-level system statistics for the Admin Dashboard
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getSystemStats = async (req, res) => {
    try {
        // 1. Count total users on the platform
        const totalUsers = await User.countDocuments({ role: 'user' });

        // 2. Count total activities logged
        const totalActivities = await Activity.countDocuments();

        // 3. Calculate total carbon emissions across the entire platform using MongoDB Aggregation
        const emissionAggregation = await Activity.aggregate([
            { $group: { _id: null, totalEmissions: { $sum: "$emission" } } }
        ]);
        
        const totalEmissions = emissionAggregation.length > 0 ? emissionAggregation[0].totalEmissions : 0;

        res.status(200).json({
            totalUsers,
            totalActivities,
            totalEmissions
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving system stats', error: error.message });
    }
};

/**
 * @desc    Get all users (for the Admin user management table)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users but exclude their passwords from the payload
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

/**
 * @desc    Delete a user and all their associated activities
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the user's activity logs first to maintain database hygiene
        await Activity.deleteMany({ userId: user._id });
        
        // Remove the user
        await user.deleteOne();
        
        res.status(200).json({ message: 'User and associated data completely removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// ==========================================
// EMISSION FACTOR MANAGEMENT (Requirement R022)
// ==========================================

/**
 * @desc    Get all emission factors
 * @route   GET /api/admin/factors
 * @access  Private/Admin
 */
const getEmissionFactors = async (req, res) => {
    try {
        const factors = await EmissionFactor.find({});
        res.status(200).json(factors);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving factors', error: error.message });
    }
};

/**
 * @desc    Create a new emission factor multiplier
 * @route   POST /api/admin/factors
 * @access  Private/Admin
 */
const createEmissionFactor = async (req, res) => {
    try {
        const { type, factorValue } = req.body;
        
        const factorExists = await EmissionFactor.findOne({ type });
        if (factorExists) {
            return res.status(400).json({ message: `Factor for ${type} already exists. Update it instead.` });
        }

        const factor = await EmissionFactor.create({ type, factorValue });
        res.status(201).json(factor);
    } catch (error) {
        res.status(500).json({ message: 'Error creating factor', error: error.message });
    }
};

/**
 * @desc    Update an existing emission factor
 * @route   PUT /api/admin/factors/:id
 * @access  Private/Admin
 */
const updateEmissionFactor = async (req, res) => {
    try {
        const { factorValue } = req.body;
        const factor = await EmissionFactor.findById(req.params.id);

        if (!factor) {
            return res.status(404).json({ message: 'Emission factor not found' });
        }

        factor.factorValue = factorValue;
        const updatedFactor = await factor.save();

        res.status(200).json(updatedFactor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating factor', error: error.message });
    }
};

module.exports = { 
    getSystemStats, 
    getAllUsers, 
    deleteUser, 
    getEmissionFactors, 
    createEmissionFactor, 
    updateEmissionFactor 
};