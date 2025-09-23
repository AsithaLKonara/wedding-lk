var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil',
    typescript: true,
});
export const createPaymentIntent = (amount_1, ...args_1) => __awaiter(void 0, [amount_1, ...args_1], void 0, function* (amount, currency = 'lkr') {
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return paymentIntent;
    }
    catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
});
export const createCustomer = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield stripe.customers.create({
            email,
            name,
        });
        return customer;
    }
    catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
});
export const createSubscription = (customerId, priceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscription = yield stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });
        return subscription;
    }
    catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
});
