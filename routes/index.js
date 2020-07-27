let express = require('express');
let router = express.Router();

let funcMongo = require('../api/mongo');

router.get('/', (req, res, next) => {
	funcMongo.GetCategories(req.params.category).then((result) => {
		res.render('categories', { categories: result, title: 'Comparando precios' });
	});
});

router.get('/cat/:category(*)', (req, res) => {
	funcMongo.GetCategories(req.params.category).then((result) => {
		if (result.length) { // have categories
			//console.log(result);
			res.render('categories', { categories: result, title: 'Comparando precios' });
		}
		else {
			funcMongo.GetProducts(req.params.category).then((result_prod) => {
				//console.log(result_prod);
				res.render('products', { prod: result_prod, title: req.params.category });
			});
		}
	});
})

router.get('/product/:name(*)', (req, res) => {
	let name = req.params.name.replace(/\/$/, "") // Delete the last '/' from the param.name
	funcMongo.GetOneProduct(name).then((result) => {
		if (result) { // have categories
			//let data = convertData(result);
			res.render('product', { prod: result, title: result.name });
		}
		else {
			res.json({ status: false })
		}
	});
})


module.exports = router;
/*
cd C:\Users\Makot\wwwCrawler
pm2 start ./bin/www
pm2 stop 0
pm2 start 0 --watch --max-restarts=1 --update-env
*/