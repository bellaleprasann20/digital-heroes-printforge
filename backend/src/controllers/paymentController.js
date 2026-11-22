
import crypto from 'node:crypto';

import {
  getRazorpay,
  isRazorpayConfigured,
} from '../config/razorpay.js';

import supabase from '../config/supabase.js';
import { env } from '../config/env.js';

// --------------------------------------------------
// CREATE RAZORPAY PAYMENT ORDER
// --------------------------------------------------

export const createPaymentOrder = async (req, res) => {
  try {
    if (!isRazorpayConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway is not configured.',
      });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required.',
      });
    }

    // Fetch the customer's PrintForge order.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        'id, customer_id, total_amount, currency, payment_status, status'
      )
      .eq('id', orderId)
      .eq('customer_id', req.user.id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.payment_status === 'paid') {
      return res.status(409).json({
        success: false,
        message: 'This order has already been paid.',
      });
    }

    if (order.status === 'cancelled') {
      return res.status(409).json({
        success: false,
        message: 'Cancelled orders cannot be paid.',
      });
    }

    const currency = String(order.currency || 'INR').toUpperCase();

    if (currency !== 'INR') {
      return res.status(400).json({
        success: false,
        message: 'Only INR payments are currently supported.',
      });
    }

    const totalAmount = Number(order.total_amount);
    const amount = Math.round(totalAmount * 100);

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0 ||
      !Number.isSafeInteger(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order amount.',
      });
    }

    // Create Razorpay order.
    const payment = await getRazorpay().orders.create({
      amount,
      currency,
      receipt: `pf_${String(order.id)
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(-20)}`,
      notes: {
        printforge_order_id: order.id,
        customer_id: order.customer_id,
      },
    });

    if (!payment?.id) {
      throw new Error('Razorpay did not return a payment order ID.');
    }

    // Save the Razorpay order ID against the PrintForge order.
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay_order_id: payment.id,
      })
      .eq('id', order.id)
      .eq('customer_id', req.user.id)
      .neq('payment_status', 'paid')
      .select('id')
      .single();

    if (updateError || !updatedOrder) {
      console.error(
        'Saving Razorpay order reference failed:',
        updateError
      );

      throw new Error(
        'Unable to link the payment to your order.'
      );
    }

    return res.status(201).json({
      success: true,
      message: 'Payment order created successfully.',
      paymentOrder: payment,
      keyId: env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create payment order error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Unable to create payment order.',
    });
  }
};

// --------------------------------------------------
// VERIFY RAZORPAY PAYMENT
// --------------------------------------------------

export const verifyPayment = async (req, res) => {
  try {
    if (!isRazorpayConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway is not configured.',
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification details are incomplete.',
      });
    }

    if (
      typeof razorpay_signature !== 'string' ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature.',
      });
    }

    // Fetch the customer's order and its saved Razorpay reference.
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(
        'id, customer_id, total_amount, currency, payment_status, status, razorpay_order_id, razorpay_payment_id'
      )
      .eq('id', orderId)
      .eq('customer_id', req.user.id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    // Idempotent response for an already verified payment.
    if (order.payment_status === 'paid') {
      if (order.razorpay_payment_id === razorpay_payment_id) {
        return res.json({
          success: true,
          message: 'Payment was already verified.',
          orderId: order.id,
        });
      }

      return res.status(409).json({
        success: false,
        message: 'This order has already been paid.',
      });
    }

    if (order.status === 'cancelled') {
      return res.status(409).json({
        success: false,
        message: 'Cancelled orders cannot be paid.',
      });
    }

    // Ensure this Razorpay order belongs to this PrintForge order.
    if (
      !order.razorpay_order_id ||
      order.razorpay_order_id !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment order does not match this PrintForge order.',
      });
    }

    // Verify Razorpay HMAC signature.
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const supplied = Buffer.from(razorpay_signature, 'hex');
    const expected = Buffer.from(expectedSignature, 'hex');

    if (
      supplied.length !== expected.length ||
      !crypto.timingSafeEqual(supplied, expected)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed.',
      });
    }

    // Fetch payment directly from Razorpay.
    const paymentDetails = await getRazorpay().payments.fetch(
      razorpay_payment_id
    );

    const expectedAmount = Math.round(
      Number(order.total_amount) * 100
    );

    const expectedCurrency = String(
      order.currency || 'INR'
    ).toUpperCase();

    // Check payment status, order reference, amount and currency.
    if (
      paymentDetails.order_id !== razorpay_order_id ||
      paymentDetails.status !== 'captured' ||
      Number(paymentDetails.amount) !== expectedAmount ||
      paymentDetails.currency !== expectedCurrency
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Payment details do not match the order or payment has not been captured.',
      });
    }

    // Update only valid database fields.
    // Keep the order status as "order".
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        razorpay_payment_id: razorpay_payment_id,
      })
      .eq('id', orderId)
      .eq('customer_id', req.user.id)
      .eq('razorpay_order_id', razorpay_order_id)
      .neq('payment_status', 'paid')
      .select('id, order_number, status, payment_status, total_amount')
      .single();

    if (updateError || !updatedOrder) {
      console.error('Payment database update failed:', updateError);

      throw new Error(
        'Payment was captured, but the order update failed. Please contact support with your payment ID.'
      );
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully.',
      order: updatedOrder,
      orderId: updatedOrder.id,
    });
  } catch (error) {
    console.error('Verify payment error:', error);

    return res.status(500).json({
      success: false,
      message:
        error.message || 'Unable to verify payment.',
    });
  }
};
