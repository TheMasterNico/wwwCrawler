let express = require('express');
let router = express.Router();

let funcMongo = require('../api/mongo');

router.get(['/', '/cat/:category(*)'], async (req, res) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	let the_cat = null;
	if (req.params.category) {
		the_cat = req.params.category.replace(/\/$/, "") // Delete the last '/' from the param.category
	}
	const result = await funcMongo.GetCategories(the_cat);
	if (result.length) { // have more categories
		res.json({result, prefix_url: 'cat'});
		//res.render('categories', { categories: result, title: 'Comparando precios' });
	}
	else {
		const result_prod = await funcMongo.GetProducts(the_cat);
		res.json({ result: result_prod, prefix_url: 'product'});
		//res.render('products', { prod: result_prod, title: req.params.category });
	}
})

router.get('/product/:name(*)', async (req, res) => {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	let name = req.params.name.replace(/\/$/, "") // Delete the last '/' from the param.name
	const result = await funcMongo.GetOneProduct(name);
	if (result) {
		res.json({ result, prefix_url: false });
		//res.render('product', { prod: result, title: result.name });
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