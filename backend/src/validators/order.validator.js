const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = Joi.object({
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().custom(objectId).required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
    })
  ).min(1).required(),
  totalAmount: Joi.number().min(0).required(),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').default('pending'),
});

const updateOrder = Joi.object({
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().custom(objectId).required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
    })
  ).min(1).optional(), // products can be updated, but not required
  totalAmount: Joi.number().min(0).optional(),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').optional(),
});

module.exports = {
  createOrder,
  updateOrder,
};
