const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
	item: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true,
		min: 0
	},
	description: {
		type: String
	},
	image: {
		type: String
	}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
