const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("reviews.user", "name profilePicture") // Populate user details for reviews
      .populate("relatedProducts.product", "name images price"); // Populate product details for related products
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate("reviews.user", "name profilePicture")
      .populate("relatedProducts.product", "name images price");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const {
    name,
    shortDescription,
    price,
    discount,
    badge,
    images,
    specifications,
    features,
    inTheBox,
    difficulty,
    completionTime,
    reviews, // Array of { user, rating, date, comment, verified }
    relatedProducts, // Array of { product, difficulty }
  } = req.body;

  try {
    const product = new Product({
      name,
      shortDescription,
      price,
      discount,
      badge,
      images,
      specifications,
      features,
      inTheBox,
      difficulty,
      completionTime,
      reviews,
      relatedProducts,
    });
    await product.save();
    const populatedProduct = await Product.findById(product._id)
      .populate("reviews.user", "name profilePicture")
      .populate("relatedProducts.product", "name images price");
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    shortDescription,
    price,
    discount,
    badge,
    images,
    specifications,
    features,
    inTheBox,
    difficulty,
    completionTime,
    reviews,
    relatedProducts,
  } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (name) product.name = name;
    if (shortDescription) product.shortDescription = shortDescription;
    if (price !== undefined) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (badge) product.badge = badge;
    if (images) product.images = images;
    if (specifications) product.specifications = specifications;
    if (features) product.features = features;
    if (inTheBox) product.inTheBox = inTheBox;
    if (difficulty) product.difficulty = difficulty;
    if (completionTime) product.completionTime = completionTime;
    if (reviews) product.reviews = reviews;
    if (relatedProducts) product.relatedProducts = relatedProducts;

    await product.save();
    const populatedProduct = await Product.findById(id)
      .populate("reviews.user", "name profilePicture")
      .populate("relatedProducts.product", "name images price");
    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, date, comment, verified } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Use authenticated user's ID from req.user
    product.reviews.push({
      user: req.user.id,
      rating,
      date,
      comment,
      verified: verified || false,
    });
    await product.save();
    const populatedProduct = await Product.findById(id)
      .populate("reviews.user", "name profilePicture")
      .populate("relatedProducts.product", "name images price");
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
