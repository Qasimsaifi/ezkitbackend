const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");
const { authenticate, isAdmin } = require("../middleware/auth");

router.get("/:slug", pageController.getPage);
router.post("/", authenticate, isAdmin, pageController.createPage);
router.put("/:id", authenticate, isAdmin, pageController.updatePage);

module.exports = router;
