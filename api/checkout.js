const cors = require("cors");

const Stripe = require("stripe");
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51NxIMbIIas9tFQMRc0T9EYd6DS8Isn1XF5BctEHFqU9eSS7DtFmm9yt2wOtGdFmyqkYuRvrRRo6zcPOVpgKA7sKG009t3rbFH1"
);

// Use cors middleware
const corsHandler = cors({
  origin: function (origin, callback) {
    let allowedOrigins = ["https://ecommerce.yashshrestha.net"];
    if (process.env.NODE_ENV !== "production") {
      allowedOrigins.push("http://localhost:5173");
    }
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

module.exports = (req, res) => {
  // Handle CORS
  corsHandler(req, res, async () => {
    try {
      const items = req.body.products;
      let lineItems = items.map((item) => ({
        price: item.id,
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: "https://localhost:5173/success",
        cancel_url: "https://localhost:5173/failed",
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      res.status(500).json({ error: "Error creating Stripe session" });
    }
  });
};
