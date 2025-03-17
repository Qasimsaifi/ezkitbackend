const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Create order from cart and generate payment link
router.post("/", authenticate, orderController.createOrderFromCart);

// Public payment callback route (used by Razorpay)
router.get("/payment-callback", orderController.paymentCallback);

// Get all orders (admin only)
router.get("/admin", authenticate, isAdmin, orderController.getAllOrders);

// Get user order history
router.get("/my-orders", authenticate, orderController.getUserOrders);

// Get single order by ID
router.get("/:id", authenticate, orderController.getOrderById);

// Update order status (admin only)
router.put(
  "/:id/status",
  authenticate,
  isAdmin,
  orderController.updateOrderStatus
);

// Delete (cancel) order
router.delete("/:id", authenticate, orderController.deleteOrder);

module.exports = router;
