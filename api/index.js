const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();

// Use this to allow specific origin.
app.use(
  cors({
    origin: "https://react-e-commerce-kappa.vercel.app/",
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51NxIMbIIas9tFQMRc0T9EYd6DS8Isn1XF5BctEHFqU9eSS7DtFmm9yt2wOtGdFmyqkYuRvrRRo6zcPOVpgKA7sKG009t3rbFH1"
);

app.post("/api/checkout", async (req, res) => {
  try {
    const items = req.body.products;
    let lineItems = items.map((item) => ({
      price: item.id,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "https://react-e-commerce-kappa.vercel.app/success",
      cancel_url: "https://react-e-commerce-kappa.vercel.app/failed",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating stripe session: ", error);
    res.status(500).json({ error: "Error creating stripe session" });
  }
});

// Here you can add additional endpoints if required

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
