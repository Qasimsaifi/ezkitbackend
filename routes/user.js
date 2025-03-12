const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const addressController = require("../controllers/addressController");
const { authenticate, isAdmin } = require("../middleware/auth");

// User routes
router.get("/profile", authenticate, userController.getProfile);
router.get("/", authenticate, isAdmin, userController.getAllUsers);
router.put("/profile", authenticate, userController.updateProfile);
router.delete("/:id", authenticate, userController.deleteUser);

// Address routes
router.get("/addresses", authenticate, addressController.getAllAddresses);
router.get(
  "/addresses/:addressId",
  authenticate,
  addressController.getAddressById
);
router.post("/addresses", authenticate, addressController.addAddress);
router.put(
  "/addresses/:addressId",
  authenticate,
  addressController.updateAddress
);
router.delete(
  "/addresses/:addressId",
  authenticate,
  addressController.deleteAddress
);
router.patch(
  "/addresses/:addressId/default",
  authenticate,
  addressController.setDefaultAddress
);

module.exports = router;
