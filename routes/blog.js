const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { authenticate, isAdmin } = require("../middleware/auth");

router.get("/", blogController.getAllPosts);
router.get("/:slug", blogController.getPostBySlug);
router.post("/", authenticate, isAdmin, blogController.createPost);
router.put("/:id", authenticate, isAdmin, blogController.updatePost);
router.delete("/:id", authenticate, isAdmin, blogController.deletePost);
router.post("/:id/comment", authenticate, blogController.addComment);

module.exports = router;
