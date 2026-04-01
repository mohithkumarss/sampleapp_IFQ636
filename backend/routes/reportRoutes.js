const express = require('express');
const router = express.Router();
const { getEmissionBreakdown, getEmissionTrend } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// All reports are private to the logged-in user
router.use(protect);

router.get('/breakdown', getEmissionBreakdown);
router.get('/trend', getEmissionTrend);

module.exports = router;