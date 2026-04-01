const express = require("express");
const router = express.Router();
const { getFactors, upsertFactor } = require("../controllers/factorController");
const {
  getSystemStats,
  getAllUsers,
  deleteUser,
  getEmissionFactors,
  createEmissionFactor,
  updateEmissionFactor,
  getAllActivities, // NEW
  deleteAnyActivity,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// Apply BOTH protect (must be logged in) and admin (must have admin role) to all routes in this file
router.use(protect, admin);

// System Stats & Users
router.get("/stats", getSystemStats);
router.route("/users").get(getAllUsers);
router.route("/users/:id").delete(deleteUser);

// Emission Factors
router.route("/factors").get(getEmissionFactors).post(createEmissionFactor);
router.route("/factors/:id").put(updateEmissionFactor);

router.get("/factors", getFactors);
router.post("/factors", upsertFactor);
router.get("/activities", getAllActivities);
router.delete("/activities/:id", deleteAnyActivity);

module.exports = router;
