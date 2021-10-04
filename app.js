const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');
const { productSchema } = require('./schema');

const app = express();

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const validateProduct = (req, res, next) => {
	const { item, price, image, description } = req.body;
	const { error } = productSchema.validate({ item, price, image, description });
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new AppError(msg, 400);
	}
	next();
};

app.get('/', (req, res) => {
	res.send('Welcome to Fish N Chips');
});
app.get(
	'/products',
	wrapAsync(async (req, res, next) => {
		const products = await Product.find({});
		res.render('index', { products });
	})
);

app.get('/products/new', (req, res) => {
	res.render('new');
});
app.post(
	'/products',
	validateProduct,
	wrapAsync(async (req, res, next) => {
		const product = new Product({ item, price, image, description });
		const savedProd = await product.save();
		res.redirect(`/products/${savedProd._id}`);
	})
);

app.get(
	'/products/:id',
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			throw new AppError('Product not found', 404);
		}
		res.render('show', { product });
	})
);
app.get(
	'/products/:id/edit',
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			throw new AppError('Product not found', 404);
		}
		res.render('edit', { product });
	})
);
app.patch(
	'/products/:id',
	validateProduct,
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const { item, price, image, description } = req.body;
		await Product.findByIdAndUpdate(id, { item, price, image, description }, { runValidators: true });
		res.redirect(`/products/${id}`);
	})
);
app.delete(
	'/products/:id',
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			throw new AppError('Product not found', 404);
		}
		res.redirect('/products');
	})
);

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) {
		err.message = 'something went wrong';
	}

	res.status(status).render('error', { err });
});
app.listen(8080, () => {
	console.log('Listening on port 8080');
});
