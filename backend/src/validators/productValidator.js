
import Joi from 'joi';

const dimensionsSchema = Joi.object({
  width: Joi.number().positive().max(5000),
  height: Joi.number().positive().max(5000),
  unit: Joi.string().valid('mm', 'cm', 'in').default('mm'),
}).unknown(false);

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(180),
  description: Joi.string().trim().max(10000).allow(''),
  category_id: Joi.string().uuid().required(),
  division: Joi.string().valid(
    'labels_stickers',
    'race_numbers',
    'mtb_boards',
    'stamps',
    'trophies',
    'laser_cut'
  ).required(),
  base_price: Joi.number().min(0).required(),
  dimensions: dimensionsSchema,
  materials: Joi.array().items(Joi.string().trim().min(1).max(100)).max(50),
  options: Joi.object().unknown(false),
  image_url: Joi.string().uri().allow('', null),
  is_active: Joi.boolean(),
  is_featured: Joi.boolean(),
  sort_order: Joi.number().integer().min(0),
});

const productUpdateSchema = productSchema.fork(
  ['name', 'category_id', 'division', 'base_price'],
  (field) => field.optional()
).min(1);

export const createProductValidator = {
  body: productSchema,
};

export const updateProductValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: productUpdateSchema,
};

export const productIdValidator = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};

export const productQueryValidator = {
  query: Joi.object({
    category: Joi.string().trim().max(100),
    division: Joi.string().valid(
      'labels_stickers',
      'race_numbers',
      'mtb_boards',
      'stamps',
      'trophies',
      'laser_cut'
    ),
    search: Joi.string().trim().max(150),
    featured: Joi.boolean(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('name', 'price', 'created_at').default('created_at'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};
