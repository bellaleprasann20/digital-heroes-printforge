
import Joi from 'joi';

export const createPaymentOrderValidator = {
  body: Joi.object({
    orderId: Joi.string().uuid().required(),
  }).unknown(false),
};

export const verifyPaymentValidator = {
  body: Joi.object({
    razorpay_order_id: Joi.string().trim().min(5).max(100).required(),
    razorpay_payment_id: Joi.string().trim().min(5).max(100).required(),
    razorpay_signature: Joi.string().trim().length(64).hex().required(),
  }).unknown(false),
};

export const paymentStatusValidator = {
  params: Joi.object({
    orderId: Joi.string().uuid().required(),
  }),
};

export const refundPaymentValidator = {
  params: Joi.object({
    paymentId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    amount: Joi.number().positive(),
    reason: Joi.string().trim().min(3).max(500).required(),
  }).unknown(false),
};
