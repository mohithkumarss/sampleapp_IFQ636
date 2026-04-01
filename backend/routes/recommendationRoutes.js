const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// This route MUST be protected so we know WHICH user to analyze
router.get('/', protect, getRecommendations);

module.exports = router;