let express = require('express');
let router = express.Router();

let funcMongo = require('../api/mongo');

router.get('/', async (req, res, next) => {
	const result = await funcMongo.GetCategories(null);
	res.render('categories', { categories: result, title: 'Comparando precios' });
});

router.get('/cat/:category(*)', async (req, res) => {
	const result = await funcMongo.GetCategories(req.params.category);
	if (result.length) { // have more categories
		res.render('categories', { categories: result, title: 'Comparando precios' });
	}
	else {
		const result_prod = await funcMongo.GetProducts(req.params.category);
		res.render('products', { prod: result_prod, title: req.params.category });
	}
})

router.get('/product/:name(*)', async (req, res) => {
	let name = req.params.name.replace(/\/$/, "") // Delete the last '/' from the param.name
	const result = await funcMongo.GetOneProduct(name);
	if (result) {
		res.render('product', { prod: result, title: result.name });
	}
	else { //not exist
		res.json({ status: false })
	}
})


module.exports = router;
/*
cd C:\Users\Makot\wwwCrawler
pm2 start ./bin/www
pm2 stop 0
pm2 start 0 --watch --max-restarts=1 --update-env
*/