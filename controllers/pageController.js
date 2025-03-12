const Page = require("../models/Page");

exports.getPage = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPage = async (req, res) => {
  const { title, content, slug } = req.body;
  try {
    const page = new Page({ title, content, slug });
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePage = async (req, res) => {
  const { title, content, slug } = req.body;
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });

    page.title = title || page.title;
    page.content = content || page.content;
    page.slug = slug || page.slug;
    await page.save();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
