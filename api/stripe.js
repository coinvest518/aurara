// Stripe backend integration for Aurora AI app
// Place this file in /api/stripe.js (Node/Express style, can be adapted for serverless)

const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Helper: get price ID from plan
const getPriceId = (plan) => {
  if (plan === 'annual') return process.env.STRIPE_PRICE_ID_ANNUAL;
  return process.env.STRIPE_PRICE_ID_MONTHLY;
};

// 1. Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  const { userId, email, plan } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: getPriceId(plan), quantity: 1 }],
      success_url: `${process.env.DOMAIN_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN_URL}/canceled`,
      metadata: { userId },
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. Stripe Webhook
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      // TODO: Save session.customer (stripe_customer_id) to user in Supabase using session.metadata.userId
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object;
      // TODO: Mark user as active/subscribed in Supabase
      break;
    }
    case 'invoice.payment_failed':
    case 'customer.subscription.deleted': {
      const invoice = event.data.object;
      // TODO: Mark user as inactive in Supabase
      break;
    }
    default:
      break;
  }
  res.json({ received: true });
});

// 3. Customer Portal Session
router.post('/create-portal-session', async (req, res) => {
  const { stripeCustomerId } = req.body;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.DOMAIN_URL}/dashboard`,
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

// To use: import and mount in your main Express app:
// const stripeRoutes = require('./api/stripe');
// app.use('/api/stripe', stripeRoutes);
