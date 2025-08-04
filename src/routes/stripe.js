import express from "express";
import Stripe from "stripe";
import "dotenv/config";
import { responseClient } from "../middleware/responseClient.js";

const stripeRouter = express.Router();

//stripe SDK
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//stripe checkout route
stripeRouter.post("/create-payment-intent", async (req, res) => {
  try {
    const { totalAmount, orderedProduct, orderInfo } = req.body;
    // console.log("req.body", req.body);

    const metadata = {
      orderInfo,
      Products: JSON.stringify(orderedProduct),
    };
    console.log("metadata", metadata);

    // Ensure totalAmount is a valid number
    if (!totalAmount) {
      return responseClient({
        req,
        res,
        message: "Invalid amount",
        statusCode: 400,
      });
    }
    //create payment intent with stripe SDK
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "aud",
      metadata: metadata,
    });

    responseClient({
      req,
      res,
      message: "Payment intent created",
      payload: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    console.error("Stripe error:", error);
    responseClient({
      req,
      res,
      message: error.message || "Something went wrong in stripe",
      statusCode: 500,
    });
  }
});

export default stripeRouter;
