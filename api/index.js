const express = require("express");
var cors = require("cors"); //this is needed for allowing any IP address to access this backend
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");

//initialize stripe
const Stripe = require("stripe");

const stripe = new Stripe(process.env.secret_key);
//middleware
app.use(express.static("public")); //this is recommended by stripe docs
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/checkout", async (req, res) => {
  try {
    const items = req.body.products;
    let lineItems = items.map((item) => ({
      price: item.id,
      quantity: item.quantity,
    }));

    const success_url =
      process.env.NODE_ENV === "production"
        ? process.env.frontend_domain + "success"
        : "http://localhost:5173/success";

    const cancel_url =
      process.env.NODE_ENV === "production"
        ? process.env.frontend_domain + "failed"
        : "http://localhost:5173/failed";

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: success_url,
      cancel_url: cancel_url,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Error creating Stripe session" });
  }
});

module.exports = app;
