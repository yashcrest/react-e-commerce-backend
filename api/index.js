const express = require("express");
const Stripe = require("stripe");
const microCors = require("micro-cors");

const app = express();

// Configure CORS with the specific origin
const cors = microCors({ origin: "https://react-e-commerce-kappa.vercel.app" });

const stripe = new Stripe("sk_test_..."); // Use your actual Stripe secret key

// Apply CORS middleware to handle CORS
app.use(cors);

// Handle preflight requests for all routes
app.options("*", cors);

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//Creating stripe checkout session
app.post("/checkout", async (req, res) => {
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

// Test endpoint to check if the server is working
app.get("/test", async (req, res) => {
  res.json({ hello: "world" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
