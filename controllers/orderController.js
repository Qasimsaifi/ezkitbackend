const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order and generate Razorpay payment link
exports.createOrderFromCart = async (req, res) => {
  const { shippingAddress } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount and prepare order items
    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Apply delivery charge logic
    // ₹40 delivery charge for orders below ₹999, free above that
    const deliveryCharge = subtotal < 999 ? 40 : 0;
    const totalAmount = subtotal + deliveryCharge;

    // Create order in our database first
    const order = new Order({
      user: req.user.id,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      shippingAddress,
      paymentStatus: "pending",
    });

    // Save the order to get the _id
    const savedOrder = await order.save();

    // Get user info for the payment
    const user = req.user;

    // Create Razorpay payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(totalAmount * 100), // in paise
      currency: "INR",
      accept_partial: false,
      description: `Order #${savedOrder._id}`,
      customer: {
        name: user.name || "Customer",
        email: user.email,
        contact: user.phone || "+910000000000",
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        orderId: savedOrder._id.toString(),
        userId: req.user.id,
      },
      callback_url: `${process.env.BACKEND_URL}/api/orders/payment-callback?orderId=${savedOrder._id}`,
      callback_method: "get",
    });

    // Update order with payment link ID
    savedOrder.razorpayOrderId = paymentLink.id;
    await savedOrder.save();

    // Log the payment link for debugging
    console.log("Payment link created:", paymentLink);
    console.log("Payment short URL:", paymentLink.short_url);

    // Return the payment link to redirect the user
    return res.status(201).json({
      message: "Order created successfully",
      order: {
        _id: savedOrder._id,
        totalAmount,
        subtotal,
        deliveryCharge,
      },
      paymentLink: paymentLink.short_url, // User will be redirected to this URL
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message });
  }
};
// Payment callback handler
exports.paymentCallback = async (req, res) => {
  try {
    const { orderId } = req.query;
    const {
      razorpay_payment_id,
      razorpay_payment_link_id,
      razorpay_payment_link_reference_id,
      razorpay_payment_link_status,
      razorpay_signature,
    } = req.query;

    // Verify the payment was successful
    if (razorpay_payment_link_status === "paid") {
      // Find the order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/payment-failed?error=Order not found`
        );
      }

      // Update order status
      order.paymentStatus = "completed";
      order.paymentId = razorpay_payment_id;
      order.status = "processing";
      await order.save();

      // Clear the user's cart
      await Cart.findOneAndUpdate({ user: order.user }, { items: [] });

      // Redirect to success page
      return res.redirect(
        `${process.env.FRONTEND_URL}/order-confirmation/${orderId}`
      );
    } else {
      // Payment failed or was cancelled
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed?status=${razorpay_payment_link_status}`
      );
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-failed?error=Server error`
    );
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user order history
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 }); // Newest first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is owner or admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete (cancel) order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow cancellation if pending/processing and user is owner or admin
    if (!["pending", "processing"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Can only cancel pending or processing orders" });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If payment was completed, initiate refund
    if (order.paymentStatus === "completed" && order.paymentId) {
      try {
        // Create refund
        const refund = await razorpay.payments.refund(order.paymentId, {
          amount: order.totalAmount * 100, // in paise
          notes: {
            orderId: order._id.toString(),
            reason: "Order cancelled",
          },
        });
        order.refundId = refund.id;
        order.refundStatus = "processing";
      } catch (refundError) {
        console.error("Refund failed:", refundError);
        // Continue with cancellation but log the error
      }
    }

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
