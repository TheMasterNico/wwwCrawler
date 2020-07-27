const url = 'mongodb://localhost:27017/';
const mongoDB = 'Alkosto';
const collectionDB = 'main_Categories';
const productsColl = 'Items';


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


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
	return convertData(result);
}

function currencyFormat(num) {
	return '$' + num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

let convertData = (arr) => {
	for (let i in arr.prices) {
		arr.prices[i].new_price = currencyFormat(arr.prices[i].new_price);
	}
	return arr;
}



module.exports = {
	GetCategories,
	GetProducts,
	GetOneProduct,
	
}
