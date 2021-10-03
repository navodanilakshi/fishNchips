const mongoose = require('mongoose');
const Product = require('../models/product');

mongoose
	.connect('mongodb://localhost:27017/chipsStore', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Successfully connected to DB...');
	})
	.catch((err) => {
		console.log('Error happened while connecting to the DB');
		console.log(err);
	});

const products = [
	{
		item: 'Haddock',
		price: 20,
		description:
			"The texture isn't as flaky or tender as cod but the meat has more flavor. Haddock has a slight sweetness that pairs well with the buttery flavor of the batter.",
		image:
			'https://images.unsplash.com/photo-1580217593608-61931cefc821?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1931&q=80'
	},
	{
		item: 'Special Fish N Chips',
		price: 15,
		description:
			'Popular hot dish consisting of fried fish in crispy batter, served with chips (French fries or wedges).',
		image:
			'https://images.unsplash.com/photo-1611599538235-128e54f1250f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80'
	},
	{
		item: 'Batterd Hot Fish n Chips',
		price: 30,
		description:
			'Include mushy peas, onions, gherkins(which are baby cucumbers),baked beans and saveloys (long sausages)',
		image:
			'https://images.unsplash.com/photo-1583815950467-e7b26a5b56b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80'
	},
	{
		item: 'English Fish n Chips',
		price: 12,
		description: 'Dressed in salt and vinegar with a choice of condiment, such as tartare sauce or tomato ketchup',
		image:
			'https://images.unsplash.com/photo-1524334788144-6dc88da21500?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1740&q=80'
	}
];

const seedDb = async () => {
	await Product.deleteMany({});
	const p = await Product.insertMany(products);
};

seedDb().then(() => {
	mongoose.connection.close();
});
