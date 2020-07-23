let express = require('express');
let router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const mongoDB = 'Alkosto';
const collectionDB = 'main_Categories';
const productsColl = 'Items';

/*
const filter = {
	'category': /.*\\Radios$/
};

MongoClient.connect(
	'mongodb://localhost:27017/',
	{ useNewUrlParser: true, useUnifiedTopology: true },
	function (connectErr, client) {
		assert.equal(null, connectErr);
		const coll = client.db('Alkosto').collection('Items');
		coll.find(filter, (cmdErr, result) => {
			assert.equal(null, cmdErr);
			result.toArray().then((r) => {
				console.log(r);

				client.close();
			});
		});
	});
*/

let GetCategories = async (parentCat) => {
	let db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
	let coll = db.db(mongoDB).collection(collectionDB);
	let result = coll.find({ 'parent': parentCat }).project({ name: 1, _id: 0 }).toArray()
	return result;
};

let GetProducts = async (Cat) => {
	let db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
	let coll = db.db(mongoDB).collection(productsColl);
	let result = coll.find({ 'category': new RegExp('.*' + Cat + '$') }).toArray();
	return result;
}
let GetOneProduct = async (name) => {
	let db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
	let coll = db.db(mongoDB).collection(productsColl);
	let result = coll.findOne({ 'name': name });
	return result;
}

router.get('/', (req, res, next) => {
	GetCategories(req.params.category).then((result) => {
		res.render('categories', { categories: result, title: 'Comparando precios' });
	});
});

router.get('/cat/:category(*)', (req, res) => {
	console.log(req.params.category);
	GetCategories(req.params.category).then((result) => {
		if (result.length) { // have categories
			//console.log(result);
			res.render('categories', { categories: result, title: 'Comparando precios' });
		}
		else {
			GetProducts(req.params.category).then((result_prod) => {
				//console.log(result_prod);
				res.render('products', { prod: result_prod, title: req.params.category });
			});
		}
	});
})

router.get('/product/:name(*)', (req, res) => {
	GetOneProduct(req.params.name).then((result) => {
		if (result) { // have categories
			res.json(result)
		}
		else {
			res.json({status: false})
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