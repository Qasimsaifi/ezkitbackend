const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // Add this dependency

module.exports = {
  authenticate: (req, res, next) => {
    let token;

    // Check Authorization header (for development/Local Storage)
    if (req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }
    // Check Cookie header (for production/HttpOnly cookies)
    else if (req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie);
      token = cookies.token; // 'token' matches the cookie name set in authController
    }

    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  },
};
