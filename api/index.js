const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

//cors config testing
const options = [
  cors({
    origin: "https://ecommerce.yashshrestha.net",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
];

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(options);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
