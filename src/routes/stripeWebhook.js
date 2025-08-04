// stripeWebhook.js
import express from "express";
import Stripe from "stripe";
import Order from "../models/Order//OrderSchema.js";
import { responseClient } from "../middleware/responseClient.js";
const webhookRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// You need raw body for Stripe to verify signature
webhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      //   return res.status(400).send(`Webhook Error: ${err.message}`);
      responseClient({
        req,
        res,
        message: "Webhook Error: " + err.message,
        statusCode: 400,
      });
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      try {
        const { metadata, id } = paymentIntent;

        // Extract metadata
        const items = JSON.parse(metadata.Products);
        const orderInfoRaw = metadata.orderInfo;
        const orderInfo =
          typeof orderInfoRaw === "string"
            ? JSON.parse(orderInfoRaw)
            : orderInfoRaw;

        // Extract address fields
        const address = {
          street: orderInfo.street,
          city: orderInfo.city,
          state: orderInfo.state,
          postalCode: orderInfo.postalCode,
          country: orderInfo.country,
        };

        // Prepare order fields
        let orderData = {
          items,
          totalAmount: paymentIntent.amount / 100, // converting back from cents
          payment: {
            method: "Card",
            transactionId: id,
            status: "Paid",
          },
          shippingAddresses: address,
        };

        if (orderInfo.isGuest && orderInfo.guestId) {
          // Guest user logic
          orderData.isGuest = true;
          orderData.guestInfo = {
            guestId: orderInfo.guestId,
            email: orderInfo.email,
            firstName: orderInfo.firstName,
            lastName: orderInfo.lastName,
            phoneNumber: orderInfo.phoneNumber,
          };
        } else if (!orderInfo.isGuest && orderInfo.userId) {
          // Registered user logic
          orderData.isGuest = false;
          orderData.buyer = orderInfo.userId;
        }

        const order = new Order(orderData);
        await order.save();
        console.log("✅ Order saved:", order._id);
      } catch (error) {
        console.error("Failed to create order:", error.message);
        // return res.status(500).send("Failed to save order.");
        responseClient({
          req,
          res,
          message: "Failed to save order.",
          statusCode: 500,
        });
      }
    }

    // Return response to Stripe
    res.status(200).json({ received: true });
    // responseClient({ req, res, message: "success", statusCode: 200 });
  }
);

export default webhookRouter;
