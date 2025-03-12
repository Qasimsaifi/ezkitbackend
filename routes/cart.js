const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, cartController.getCart);
router.post("/add", authenticate, cartController.addToCart);
router.put("/update", authenticate, cartController.updateCart);
router.delete(
  "/remove/:productId",
  authenticate,
  cartController.removeFromCart
);
router.post("/increase", authenticate, cartController.increaseQuantity);
router.post("/decrease", authenticate, cartController.decreaseQuantity);

module.exports = router;
