const Stripe = require("stripe")(process.env.STRIPE_SECRET);
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createStripePayment = async (amount, currency) => {
  const paymentIntent = await Stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency,
    payment_method_types: ["card"],
  });
  return paymentIntent.client_secret;
};

exports.createRazorpayOrder = async (amount, currency) => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
  };
  return await razorpay.orders.create(options);
};
