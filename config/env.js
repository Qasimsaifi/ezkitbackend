require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  stripeSecret: process.env.STRIPE_SECRET,
  razorpayKey: process.env.RAZORPAY_KEY,
  razorpaySecret: process.env.RAZORPAY_SECRET,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};
