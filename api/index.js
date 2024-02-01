const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")('sk_test_51NxIMbIIas9tFQMRc0T9EYd6DS8Isn1XF5BctEHFqU9eSS7DtFmm9yt2wOtGdFmyqkYuRvrRRo6zcPOVpgKA7sKG009t3rbFH1');
const bodyParser = require("body-parser");


//using cors package
const cors = require('cors');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

// CORS middleware wrapper
const corsOptions = {
  origin: 'https://ecommerce.yashshrestha.net',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
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
      success_url: 'https://ecommerce.yashshrestha.net/success',
      cancel_url: 'https://ecommerce.yashshrestha.net/failed',
    });

    res.send(JSON.stringify({ url: session.url }));
  } catch (error) {
    console.error("Error creating stripe session: ", error);
    res.status(500).json({ error: "Error creating stripe session" });
  }
};

//Creating stripe checkout session
app.post("/checkout", allowCors(createCheckoutSession));

//enabling CORS for routes
app.use(cors(corsOptions));

module.exports = app;
