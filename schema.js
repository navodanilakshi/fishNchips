const Joi = require('joi');

module.exports.productSchema = Joi.object({
	item: Joi.string().required(),
	price: Joi.number().min(0).required(),
	description: Joi.string().required(),
	image: Joi.string().required()
});
