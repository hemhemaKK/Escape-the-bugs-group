const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getAllContacts,
} = require("../controllers/adminController"); // CommonJS style

const router = express.Router();

// Admin routes
router.get("/users", requireAuth, getAllUsers);
router.get("/contacts", requireAuth, getAllContacts);

module.exports = router;
