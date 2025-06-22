# Stripe Payment Integration Setup Guide

## Overview

This guide explains how to set up and use Stripe payment links with Aurora AI. The integration includes:

- Stripe payment links for subscriptions
- Success/cancel redirect handling
- Database tracking of subscriptions
- Usage limits and feature restrictions

## Setup Instructions

### 1. Database Setup

Run the subscription schema SQL in your Supabase database:

```sql
-- Execute the contents of SUPABASE_SUBSCRIPTION_SCHEMA.sql
```

This creates:
- `user_subscriptions` table for tracking subscription status
- `user_usage` table for monthly usage limits
- Proper RLS policies for security

### 2. Stripe Payment Links

You need to create payment links in your Stripe dashboard for each plan:

#### Current Payment Links:
- **Essentials Monthly**: `https://buy.stripe.com/5kQ28r7E64YGcdlazSew80eso`
- **Essentials Yearly**: _Need to create_
- **Pro Monthly**: _Need to create_ 
- **Pro Yearly**: _Need to create_

#### Creating Payment Links:

1. Go to [Stripe Dashboard > Payment Links](https://dashboard.stripe.com/payment-links)
2. Click "Create payment link"
3. Configure the product and pricing
4. Set up success/cancel URLs:
   - **Success URL**: `https://aurarora.life/success?plan={PLAN_NAME}&billing={BILLING_CYCLE}`
   - **Cancel URL**: `https://aurarora.life/pricing?canceled=true`

#### URL Parameters Added Automatically:

The component automatically adds these parameters to payment links:

- `success_url`: Redirect after successful payment
- `cancel_url`: Redirect after canceled payment  
- `client_reference_id`: User ID for tracking
- `prefilled_email`: User's email address

### 3. Update Payment Links in Code

Update the payment links in `src/components/PricingTabs.tsx`:

```typescript
const plans = [
  // ... Free plan (no payment link needed)
  {
    name: "Essentials",
    // ... other properties
    stripePaymentLink: {
      monthly: "https://buy.stripe.com/5kQ28r7E64YGcdlazSew80eso",
      yearly: "https://buy.stripe.com/YOUR_YEARLY_LINK_HERE"
    },
  },
  {
    name: "Pro", 
    // ... other properties
    stripePaymentLink: {
      monthly: "https://buy.stripe.com/YOUR_PRO_MONTHLY_LINK",
      yearly: "https://buy.stripe.com/YOUR_PRO_YEARLY_LINK"
    },
  },
]
```

## How It Works

### 1. User Clicks Upgrade Button

- Component generates payment link with proper parameters
- User is redirected to Stripe checkout
- Parameters include user ID, email, success/cancel URLs

### 2. After Payment

**Success Flow:**
- User redirected to `/success?plan=essentials&billing=monthly&session_id=...`
- `PaymentSuccess` component updates database with subscription
- User sees confirmation and can navigate to dashboard

**Cancel Flow:**
- User redirected to `/pricing?canceled=true` 
- `PaymentCancel` component shows helpful message
- User can try again or continue with free plan

### 3. Subscription Tracking

The `SubscriptionService` provides methods to:
- Track active subscriptions
- Check usage limits
- Enforce feature restrictions
- Handle subscription changes

### 4. Usage Throughout App

Use the `useSubscription` hook in components:

```typescript
import { useSubscription } from '../hooks/useSubscription'

function MyComponent() {
  const { 
    subscription, 
    hasActiveSubscription, 
    planLimits, 
    canUseFeature 
  } = useSubscription()

  // Check if user can start a video session
  if (canUseFeature('video_session')) {
    // Allow video session
  } else {
    // Show upgrade prompt
  }
}
```

## Plan Limits

### Free Plan
- 5 text/video sessions per month
- Basic mood tracker
- Limited chat support

### Essentials Plan  
- Unlimited text chats
- 10 video sessions per month
- Mood & journal analytics
- Email support

### Pro Plan
- Unlimited text + video sessions
- Real-time distress detection
- Advanced analytics
- Priority support

## Testing

1. Use Stripe test mode payment links
2. Test success/cancel flows
3. Verify database updates after payment
4. Test usage limit enforcement

## Environment Variables

Make sure these are set:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Security Notes

- All database operations use RLS policies
- User can only access their own subscription data
- Payment links include user identification for tracking
- Success URLs validate user ownership before updating database

## Troubleshooting

### Payment Link Not Working
- Check that the Stripe payment link is active
- Verify success/cancel URLs are correct
- Ensure user is authenticated before payment

### Database Errors
- Verify RLS policies are set up correctly
- Check that user has proper permissions
- Ensure subscription schema is applied

### Redirect Issues
- Verify domain is correctly set to `https://aurarora.life`
- Check that success/cancel routes are properly configured
- Ensure URL parameters are being parsed correctly
