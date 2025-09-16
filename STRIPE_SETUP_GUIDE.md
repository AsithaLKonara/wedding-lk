# Stripe Production Setup Guide

## 💳 Setting Up Stripe for WeddingLK Production

### Step 1: Create Stripe Account
1. Go to https://dashboard.stripe.com/
2. Sign up or log in to your account
3. Complete account verification (required for live mode)

### Step 2: Switch to Live Mode
1. In your Stripe dashboard, toggle from "Test mode" to "Live mode"
2. Complete any required business verification
3. Add your business information

### Step 3: Get Live API Keys
1. Go to "Developers" → "API keys"
2. Copy your **Publishable key** (starts with `pk_live_`)
3. Copy your **Secret key** (starts with `sk_live_`)
4. Keep these keys secure!

### Step 4: Set Up Webhook Endpoint
1. Go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Endpoint URL: `https://wedding-1hlk8nv0f-asithalkonaras-projects.vercel.app/api/payments/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.succeeded`
   - `charge.failed`
5. Click "Add endpoint"
6. Copy the **Webhook signing secret** (starts with `whsec_`)

### Step 5: Update Vercel Environment Variables
Go to https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables

Add these environment variables:

```bash
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 6: Configure Payment Settings
1. Go to "Settings" → "Payment methods"
2. Enable payment methods you want to accept:
   - Credit cards (Visa, Mastercard, American Express)
   - Debit cards
   - Digital wallets (Apple Pay, Google Pay)
   - Bank transfers (if needed)

### Step 7: Set Up Business Information
1. Go to "Settings" → "Business settings"
2. Add your business information:
   - Business name: "WeddingLK"
   - Business type: "Technology/Software"
   - Business address
   - Tax information

### Step 8: Configure Payouts
1. Go to "Settings" → "Payouts"
2. Set up your bank account for payouts
3. Configure payout schedule (daily, weekly, monthly)
4. Set minimum payout amount

## 🔧 Payment Flow Implementation

Your WeddingLK platform already includes:

### Frontend Components:
- `components/molecules/payment-form.tsx` - Stripe Elements integration
- Payment form with card input
- Error handling and validation
- Loading states

### Backend API Routes:
- `app/api/payments/create-intent/route.ts` - Create payment intents
- `app/api/payments/webhook/route.ts` - Handle webhook events
- Payment processing logic
- Booking confirmation

### Integration Points:
- Booking system integration
- Payment success/failure handling
- Email notifications
- Database updates

## 💰 Pricing Configuration

### Default Pricing Structure:
- **Venue Booking**: 5-15% commission
- **Vendor Services**: 3-10% commission
- **Wedding Packages**: 2-8% commission
- **Premium Features**: Fixed fees

### Stripe Fees:
- **Online payments**: 2.9% + 30¢ per transaction
- **International cards**: Additional 1.5%
- **Currency conversion**: Additional fees apply

## 🧪 Testing Payments

### Test Cards (Live Mode):
Use these test cards to verify payments:

```
Success: 4242 4242 4242 4242
Declined: 4000 0000 0000 0002
Insufficient funds: 4000 0000 0000 9995
```

### Test Process:
1. Create a test booking
2. Use test card numbers
3. Verify payment processing
4. Check webhook events
5. Confirm database updates

## 🔒 Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Use HTTPS** for all payment requests
3. **Validate webhook signatures** to prevent fraud
4. **Store payment data securely** in database
5. **Implement PCI compliance** measures
6. **Regular security audits**

## 📊 Monitoring and Analytics

### Stripe Dashboard Features:
- Real-time payment monitoring
- Revenue analytics
- Customer insights
- Dispute management
- Refund processing

### Integration with WeddingLK:
- Payment success/failure tracking
- Revenue reporting
- Customer payment history
- Automated refunds

## 🎯 Next Steps After Stripe Setup

1. ✅ Stripe configured
2. ⏳ Test payment processing
3. ⏳ Set up Google OAuth
4. ⏳ Configure Redis caching
5. ⏳ Set up email service
6. ⏳ Test complete booking flow
7. ⏳ Populate sample data

## 🔗 Useful Links

- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)
- [Vercel Environment Variables](https://vercel.com/asithalkonaras-projects/wedding-lk/settings/environment-variables)

## 📞 Support

If you encounter issues:
1. Check Stripe dashboard for errors
2. Verify webhook endpoint is accessible
3. Test with Stripe test cards
4. Check Vercel deployment logs
5. Review Stripe documentation
