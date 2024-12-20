const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const stripe = require("stripe")(
  "sk_test_51NxIMbIIas9tFQMRc0T9EYd6DS8Isn1XF5BctEHFqU9eSS7DtFmm9yt2wOtGdFmyqkYuRvrRRo6zcPOVpgKA7sKG009t3rbFH1"
);

//Middleware
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Stripe checkout session function
const createCheckoutSession = async (req, res) => {
  try {
    // Log the entire request body
    console.log("Request Body:", req.body);


    // Extract and log the products key from the req body
    const items = req.body.products;
    console.log("Products Received: ", items);
    let lineItems = items.map((item) => ({
      price: item.id,
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: "https://ecommerce.yashshrestha.net/success",
      cancel_url: "https://ecommerce.yashshrestha.net/failed",
    });

    res.send(JSON.stringify({ url: session.url }));
  } catch (error) {
    console.error("Error creating stripe session: ", error);
    res.status(500).json({ error: "Error creating stripe session" });
  }
};

//Creating stripe checkout session
app.post("/checkout", createCheckoutSession);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
