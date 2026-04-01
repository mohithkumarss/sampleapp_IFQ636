const express = require('express');
const router = express.Router();
const { addActivity, getActivities, updateActivity, deleteActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

// All activity routes require the user to be logged in (protected)
router.route('/')
    .post(protect, addActivity)
    .get(protect, getActivities);

router.route('/:id')
    .put(protect, updateActivity)
    .delete(protect, deleteActivity);

module.exports = router;