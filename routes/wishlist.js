const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, wishlistController.getWishlist);
router.post("/add", authenticate, wishlistController.addToWishlist);
router.delete(
  "/remove/:productId",
  authenticate,
  wishlistController.removeFromWishlist
);

module.exports = router;
