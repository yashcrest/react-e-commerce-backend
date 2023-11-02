const express = require("express");
var cors = require("cors"); //this is needed for allowing any IP address to access this backend
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");

//initialize stripe
const Stripe = require("stripe");

const stripe = new Stripe(
  "sk_test_51NxIMbIIas9tFQMRc0T9EYd6DS8Isn1XF5BctEHFqU9eSS7DtFmm9yt2wOtGdFmyqkYuRvrRRo6zcPOVpgKA7sKG009t3rbFH1"
);
//middleware
app.use(express.static("public")); //this is recommended by stripe docs
app.use(cors());
app.use(
  cors({
    origin: "https://ecommerce.yashshrestha.net/cart",
  })
);
// ensumre that server handles "options" requets correctly.
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
      success_url: "https://ecommerce.yashshrestha.net/success",
      cancel_url: "https://ecommerce.yashshrestha.net/failed",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Error creating Stripe session" });
  }
});
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on ${port}`));
