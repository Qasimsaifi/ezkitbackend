const Blog = require("../models/Blog");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().populate("author", "name");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug }).populate(
      "author",
      "name"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, images, tags, categories } = req.body;
  try {
    const blog = new Blog({
      title,
      content,
      images,
      author: req.user.id,
      tags,
      categories,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  const { title, content, images, tags, categories } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Post not found" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.images = images || blog.images;
    blog.tags = tags || blog.tags;
    blog.categories = categories || blog.categories;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Post not found" });
    await blog.remove();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  const { content } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Post not found" });

    blog.comments.push({ user: req.user.id, content });
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
