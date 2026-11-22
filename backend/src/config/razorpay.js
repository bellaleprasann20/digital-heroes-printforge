
import Razorpay from 'razorpay';
import { env } from './env.js';

export const isRazorpayConfigured = Boolean(
  env.RAZORPAY_KEY_ID &&
  env.RAZORPAY_KEY_SECRET
);

export const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET
    })
  : null;

export function getRazorpay() {
  if (!razorpay) {
    throw new Error(
      'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the backend environment.'
    );
  }

  return razorpay;
}

export default razorpay;
