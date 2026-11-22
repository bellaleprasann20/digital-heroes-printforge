
import Joi from 'joi';

const designElementSchema = Joi.object({
  id: Joi.string().max(100).required(),
  type: Joi.string().valid('text', 'image', 'shape', 'svg').required(),
  x: Joi.number().min(-10000).max(10000).required(),
  y: Joi.number().min(-10000).max(10000).required(),
  width: Joi.number().positive().max(10000).required(),
  height: Joi.number().positive().max(10000).required(),
  rotation: Joi.number().min(-3600).max(3600).default(0),
  properties: Joi.object().unknown(false).default({}),
}).unknown(false);

const designSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  productId: Joi.string().uuid().required(),
  canvas: Joi.object({
    width: Joi.number().positive().max(5000).required(),
    height: Joi.number().positive().max(5000).required(),
    unit: Joi.string().valid('mm', 'cm', 'in').default('mm'),
  }).required(),
  elements: Joi.array().items(designElementSchema).max(500).required(),
  background: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
  thumbnailUrl: Joi.string().uri().allow('', null),
}).unknown(false);

export const createDesignValidator = {
  body: designSchema,
};

export const updateDesignValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: designSchema.fork(['name', 'productId', 'canvas', 'elements'], (field) =>
    field.optional()
  ).min(1),
};

export const designIdValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

export const duplicateDesignValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
  }).unknown(false),
};
