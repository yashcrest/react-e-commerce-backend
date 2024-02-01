const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")('sk_test_51NxIMbIIas9tFQMRc0T9EYd6DS8Isn1XF5BctEHFqU9eSS7DtFmm9yt2wOtGdFmyqkYuRvrRRo6zcPOVpgKA7sKG009t3rbFH1');
const bodyParser = require("body-parser");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

// CORS middleware wrapper
const allowCors = (fn) => async (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://react-e-commerce-kappa.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(204).end();
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
// app.listen(port, () => console.log(`Server running port ${port}`));

module.exports = app;
