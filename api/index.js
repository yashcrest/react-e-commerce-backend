const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");
app.use(express.static("public"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

// CORS middleware wrapper
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FrontEnd_Domain);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Stripe checkout session function
const createCheckoutSession = async (req, res) => {
  try {
    const items = req.body.products;
    let lineItems = items.map((item) => ({
      price: item.id,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FrontEnd_Domain}/success`,
      cancel_url: `${process.env.FrontEnd_Domain}/failed`,
    });

    res.send(JSON.stringify({ url: session.url }));
  } catch (error) {
    console.error("Error creating stripe session: ", error);
    res.status(500).json({ error: "Error creating stripe session" });
  }
};

//Creating stripe checkout session
app.post("/checkout", allowCors(createCheckoutSession));
app.listen(port, () => console.log(`Server running port ${port}`));

module.exports = app;
