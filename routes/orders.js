const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Public routes (protected by auth)
router.post("/", authenticate, orderController.createOrderFromCart); // Create order from cart
router.get("/my-orders", authenticate, orderController.getUserOrders); // User order history
router.get("/:id", authenticate, orderController.getOrderById); // Get single order
router.delete("/:id", authenticate, orderController.deleteOrder); // Cancel order

// Admin-only routes
router.get("/", authenticate, isAdmin, orderController.getAllOrders); // All orders
router.put(
  "/:id/status",
  authenticate,
  isAdmin,
  orderController.updateOrderStatus
); // Update status

module.exports = router;
