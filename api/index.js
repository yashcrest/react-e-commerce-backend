const express = require("express");
const Stripe = require("stripe");
const microCors = require("micro-cors");
// const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
// const cors = microCors();

const stripe = new Stripe(
  "sk_test_51NxIMbIIas9tFQMRc0T9EYd6DS8Isn1XF5BctEHFqU9eSS7DtFmm9yt2wOtGdFmyqkYuRvrRRo6zcPOVpgKA7sKG009t3rbFH1"
);

//micro-cors middleware
app.use((req, res, next) => {
  cors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).send("ok");
  }

  next();
});


// CORS middleware setup
// Configure CORS to allow requests from your front-end domain
// const corsOptions = {
//   origin: "https://react-e-commerce-kappa.vercel.app"
// , // Your front-end origin
//   credentials: true,
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   allowedHeaders: [
//     "X-CSRF-Token",
//     "X-Requested-With",
//     "Accept",
//     "Accept-Version",
//     "Content-Length",
//     "Content-MD5",
//     "Content-Type",
//     "Date",
//     "X-Api-Version"
//   ],
// };


//using cors
// app.use(cors(corsOptions));

//Creating stripe checkout session
app.post("/checkout", async (req, res) => {
  // try {
  //   const items = req.body.products;
  //   let lineItems = items.map((item) => ({
  //     price: item.id,
  //     quantity: item.quantity,
  //   }));

  //   const session = await stripe.checkout.sessions.create({
  //     line_items: lineItems,
  //     mode: "payment",
  //     success_url: "https://react-e-commerce-kappa.vercel.app/success",
  //     cancel_url: "https://react-e-commerce-kappa.vercel.app/failed",
  //   });

  //   res.json({ url: session.url });
  // } catch (error) {
  //   console.error("Error creating stripe session: ", error);
  //   res.status(500).json({ error: "Error creating stripe session" });
  // }  

  res.status(200).send("Checkout endpoint hit");
});


//test endpoint
app.get("/test", async (req, res) => {
  res.json({
    hello: "world",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
