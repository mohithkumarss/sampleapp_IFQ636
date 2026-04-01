const Activity = require('../models/Activity');
const EmissionFactor = require('../models/EmissionFactor');

/**
 * @desc    Add a new user activity and calculate carbon footprint
 * @route   POST /api/activities
 * @access  Private (Requires Token)
 */
const addActivity = async (req, res) => {
    try {
        const { type, distance } = req.body;

        // 1. Fetch the predefined emission factor from the database (Requirement R013)
        // Note: Admins populate this collection. e.g., type: 'Transport', factorValue: 0.14
        const factorRecord = await EmissionFactor.findOne({ type });
        
        if (!factorRecord) {
            return res.status(400).json({ 
                message: `Emission factor for '${type}' not found. Please contact an administrator to update system configurations.` 
            });
        }

        // 2. Compute the total carbon emission (distance/value * predefined factor)
        const calculatedEmission = distance * factorRecord.factorValue;

        // 3. Create and save the new activity linked to the logged-in user
        const activity = await Activity.create({
            userId: req.user.id, // Extracted from the JWT middleware
            type,
            distance,
            emission: calculatedEmission
        });

        res.status(201).json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Error adding activity', error: error.message });
    }
};

/**
 * @desc    View all activities for the logged-in user
 * @route   GET /api/activities
 * @access  Private
 */
const getActivities = async (req, res) => {
    try {
        // Fetch activities strictly belonging to the user making the request
        // Sort by newest first
        const activities = await Activity.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving activities', error: error.message });
    }
};

/**
 * @desc    Update an existing activity and recalculate emissions
 * @route   PUT /api/activities/:id
 * @access  Private
 */
const updateActivity = async (req, res) => {
    try {
        const { type, distance } = req.body;
        const activityId = req.params.id;

        // 1. Find the activity and ensure it belongs to the user trying to edit it
        let activity = await Activity.findById(activityId);
        
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        if (activity.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this record' });
        }

        // 2. If the user changed the type or distance, we must recalculate the carbon footprint
        let newEmission = activity.emission;
        if (type || distance) {
            const updatedType = type || activity.type;
            const updatedDistance = distance || activity.distance;
            
            const factorRecord = await EmissionFactor.findOne({ type: updatedType });
            if (!factorRecord) return res.status(400).json({ message: 'Invalid activity type' });
            
            newEmission = updatedDistance * factorRecord.factorValue;
        }

        // 3. Apply updates and save
        activity.type = type || activity.type;
        activity.distance = distance || activity.distance;
        activity.emission = newEmission;

        const updatedActivity = await activity.save();
        res.status(200).json(updatedActivity);

    } catch (error) {
        res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
};

/**
 * @desc    Delete an activity
 * @route   DELETE /api/activities/:id
 * @access  Private
 */
const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Ensure the user owns the activity before deleting
        if (activity.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to delete this record' });
        }

        await activity.deleteOne();
        res.status(200).json({ message: 'Activity successfully removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting activity', error: error.message });
    }
};

module.exports = { addActivity, getActivities, updateActivity, deleteActivity };