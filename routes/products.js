const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticate, isAdmin } = require("../middleware/auth");

// Get all products (public)
router.get("/", productController.getAllProducts);

// Get a single product by ID (public)
router.get("/:id", productController.getProductById);

// Create a product (admin only)
router.post("/", authenticate, isAdmin, productController.createProduct);

// Update a product (admin only)
router.put("/:id", authenticate, isAdmin, productController.updateProduct);

// Delete a product (admin only)
router.delete("/:id", authenticate, isAdmin, productController.deleteProduct);

// Add a review to a product (authenticated users)
router.post("/:id/reviews", authenticate, productController.addReview);

module.exports = router;
