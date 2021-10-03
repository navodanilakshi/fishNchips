const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');

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

app.get('/', (req, res) => {
	res.send('Welcome to Fish N Chips');
});
app.get('/products', async (req, res) => {
	const products = await Product.find({});
	res.render('index', { products });
});
app.get('/products/new', (req, res) => {
	res.render('new');
});
app.post('/products', async (req, res) => {
	const { item, price, image, description } = req.body;
	const product = new Product({ item, price, image, description });
	const savedProd = await product.save();
	res.redirect(`/products/${savedProd._id}`);
});
app.get('/products/:id', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('show', { product });
});
app.get('/products/:id/edit', async (req, res) => {
	const { id } = req.params;
	const product = await Product.findById(id);
	res.render('edit', { product });
});
app.patch('/products/:id', async (req, res) => {
	const { id } = req.params;
	const { item, price, image, description } = req.body;
	await Product.findByIdAndUpdate(id, { item, price, image, description });
	res.redirect(`/products/${id}`);
});
app.delete('/products/:id', async (req, res) => {
	const { id } = req.params;
	await Product.findByIdAndDelete(id);
	res.redirect('/products');
});
app.listen(8080, () => {
	console.log('Listening on port 8080');
});
