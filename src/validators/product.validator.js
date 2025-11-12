const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Le nom du produit est obligatoire",
    "string.min": "Le nom doit contenir au moins 3 caractères",
  }),
  sku: Joi.string().alphanum().min(3).max(20).required(),
  price: Joi.number().positive().precision(2).required().messages({
    "number.positive": "Le prix doit être un nombre positif",
  }),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).default(0),
  inStock: Joi.boolean().default(true),
});
module.exports = { productSchema };
