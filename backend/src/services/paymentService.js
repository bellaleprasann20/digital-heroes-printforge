
import crypto from 'node:crypto';
import { getRazorpay, isRazorpayConfigured } from '../config/razorpay.js';
import supabase from '../config/supabase.js';

export const createGatewayOrder = async ({
  orderId,
  customerId
}) => {
  if (!isRazorpayConfigured) {
    throw new Error('Razorpay is not configured.');
  }

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, customer_id, total_amount, currency, payment_status')
    .eq('id', orderId)
    .eq('customer_id', customerId)
    .single();

  if (error || !order) {
    throw new Error('Order not found.');
  }

  if (order.payment_status === 'paid') {
    throw new Error('This order has already been paid.');
  }

  const amount = Math.round(Number(order.total_amount) * 100);
  const currency = order.currency || 'INR';

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new Error('Invalid payment amount.');
  }

  if (currency !== 'INR') {
    throw new Error('Unsupported payment currency.');
  }

  const gatewayOrder = await getRazorpay().orders.create({
    amount,
    currency,
    receipt: `pf_${String(order.id).replace(/[^a-zA-Z0-9]/g, '').slice(-20)}`
  });

  const { error: recordError } = await supabase
    .from('payment_attempts')
    .insert({
      order_id: order.id,
      customer_id: customerId,
      gateway_order_id: gatewayOrder.id,
      amount,
      currency,
      status: 'created'
    });

  if (recordError) throw recordError;

  return gatewayOrder;
};

export const verifyGatewayPayment = async ({
  orderId,
  customerId,
  gatewayOrderId,
  paymentId,
  signature
}) => {
  if (!isRazorpayConfigured) {
    throw new Error('Razorpay is not configured.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${gatewayOrderId}|${paymentId}`)
    .digest('hex');

  const supplied = Buffer.from(signature || '', 'hex');
  const expected = Buffer.from(expectedSignature, 'hex');

  if (
    supplied.length !== expected.length ||
    supplied.length === 0 ||
    !crypto.timingSafeEqual(supplied, expected)
  ) {
    throw new Error('Payment signature verification failed.');
  }

  const { data: attempt, error: attemptError } = await supabase
    .from('payment_attempts')
    .select('*')
    .eq('order_id', orderId)
    .eq('customer_id', customerId)
    .eq('gateway_order_id', gatewayOrderId)
    .single();

  if (attemptError || !attempt) {
    throw new Error('Payment attempt not found.');
  }

  if (attempt.status === 'verified') {
    if (attempt.payment_id === paymentId) {
      return { success: true, alreadyVerified: true };
    }

    throw new Error('A different payment has already been verified.');
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, customer_id, total_amount, currency, payment_status')
    .eq('id', orderId)
    .eq('customer_id', customerId)
    .single();

  if (orderError || !order) {
    throw new Error('Order not found.');
  }

  const expectedAmount = Math.round(Number(order.total_amount) * 100);

  if (
    expectedAmount !== Number(attempt.amount) ||
    order.currency !== attempt.currency
  ) {
    throw new Error('Payment amount does not match the order.');
  }

  const payment = await getRazorpay().payments.fetch(paymentId);

  if (
    payment.order_id !== gatewayOrderId ||
    payment.amount !== expectedAmount ||
    payment.currency !== order.currency ||
    payment.status !== 'captured'
  ) {
    throw new Error('Payment is not captured for the expected order amount.');
  }

  const { error: updateOrderError } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      payment_id: paymentId,
      status: 'confirmed'
    })
    .eq('id', orderId)
    .eq('customer_id', customerId)
    .neq('payment_status', 'paid');

  if (updateOrderError) throw updateOrderError;

  const { error: updateAttemptError } = await supabase
    .from('payment_attempts')
    .update({
      payment_id: paymentId,
      status: 'verified',
      verified_at: new Date().toISOString()
    })
    .eq('id', attempt.id);

  if (updateAttemptError) throw updateAttemptError;

  return { success: true, paymentId };
};

export default {
  createGatewayOrder,
  verifyGatewayPayment
};
