const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");
const { authenticate, isAdmin } = require("../middleware/auth");

router.post("/contact", supportController.submitContactForm);
router.post("/ticket", authenticate, supportController.createTicket);
router.get("/ticket/:id", authenticate, supportController.getTicket);
router.put(
  "/ticket/:id",
  authenticate,
  isAdmin,
  supportController.updateTicket
);

module.exports = router;
