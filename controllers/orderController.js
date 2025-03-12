const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Create order from cart
exports.createOrderFromCart = async (req, res) => {
  const { shippingAddress } = req.body; // { address, city, postalCode, country }
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
      price: item.product.price, // Use current product price
    }));
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
    });
    await order.save();

    // Clear cart after order is placed
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user order history
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price")
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
      .populate("items.product", "name price");
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

    // Only allow cancellation if pending and user is owner or admin
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Can only cancel pending orders" });
    }
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await order.deleteOne();
    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
