const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper function to populate product details in cart items
const populateCartItems = async (cart) => {
  return await cart.populate("items.product"); // No need for .execPopulate()
};

// Get cart with full product details
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        items: [],
        user: req.user.id,
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to cart with full product details
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await populateCartItems(cart); // Populate product details
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart with full product details
exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      if (quantity <= 0) cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    await populateCartItems(cart); // Populate product details
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart with full product details
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    await populateCartItems(cart); // Populate product details

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
      error: error.message,
    });
  }
};

// Increase quantity with full product details
exports.increaseQuantity = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    await populateCartItems(cart); // Populate product details
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decrease quantity with full product details
exports.decreaseQuantity = async (req, res) => {
  const { productId } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cart.save();
    await populateCartItems(cart); // Populate product details
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
