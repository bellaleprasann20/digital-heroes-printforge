
import Joi from 'joi';

const orderItemSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).max(10000).required(),
  configuration: Joi.object().unknown(false).default({}),
  designId: Joi.string().uuid().allow(null),
  artworkPath: Joi.string().trim().max(500).allow(null, ''),
}).unknown(false);

const addressSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().pattern(/^[+]?[0-9\s()-]{7,20}$/).required(),
  email: Joi.string().email().max(254).allow('', null),
  addressLine1: Joi.string().trim().min(3).max(200).required(),
  addressLine2: Joi.string().trim().max(200).allow('', null),
  city: Joi.string().trim().min(2).max(100).required(),
  state: Joi.string().trim().min(2).max(100).required(),
  postalCode: Joi.string().trim().min(3).max(15).required(),
  country: Joi.string().trim().min(2).max(100).default('India'),
}).unknown(false);

export const createOrderValidator = {
  body: Joi.object({
    items: Joi.array().items(orderItemSchema).min(1).max(100).required(),
    quoteId: Joi.string().uuid().required(),
    shippingAddress: addressSchema.required(),
    billingAddress: addressSchema,
    notes: Joi.string().trim().max(2000).allow(''),
    saveAddress: Joi.boolean().default(false),
  }).unknown(false),
};

export const orderIdValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

export const cancelOrderValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    reason: Joi.string().trim().min(3).max(1000).required(),
  }).unknown(false),
};

export const reorderValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

export const orderQueryValidator = {
  query: Joi.object({
    status: Joi.string().valid(
      'quote',
      'order',
      'artwork',
      'proof',
      'production',
      'completed',
      'cancelled'
    ),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(150),
    from: Joi.date().iso(),
    to: Joi.date().iso().min(Joi.ref('from')),
  }),
};
