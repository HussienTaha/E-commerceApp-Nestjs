import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  constructor() {}

  async createCheckoutSession({
    line_items,
    metadata,
    customer_email,
    discounts,
  }: {
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
    metadata?: Record<string, string>;
    customer_email: string;
    discounts?: Stripe.Checkout.SessionCreateParams.Discount[];
  }): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email,
      metadata,
      line_items,
      discounts,
      success_url: 'http://localhost:3000/order/success',
      cancel_url: 'http://localhost:3000/order/cancel',
    });

    return session;
  }


   createCoupon= async ({
    percent_off
  }: { percent_off: number }) => {
 
    const coupon = await this.stripe.coupons.create({
      percent_off,
      duration: 'once', // الكوبون ده ينفع مرة واحدة
    });

    return coupon;
  }
}
