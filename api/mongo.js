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
	let result = await coll.findOne({ 'name': name });
	//result = ;
	return convertData(result);
}

function currencyFormat(num) {
	return '$' + num.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

let convertData = async (arr) => {
	for (let i in arr.prices) {
		if (arr.prices[i].old_price) { //if have oldprice, adding discount
			arr.prices[i].discount = Math.trunc(arr.prices[i].new_price * 100 / arr.prices[i].old_price).toString() + "%";
		}
		arr.prices[i].old_price = currencyFormat(arr.prices[i].old_price); // Convert prices
		arr.prices[i].new_price = currencyFormat(arr.prices[i].new_price); // Convert prices
		arr.prices[i].date = new Date(arr.prices[i].date * 1000).toString(); // Convert date like "Sun Aug 02 2020 21:54:44 GMT-0500 (Eastern Standard Time)"

	}
	console.log(arr);
	return arr;
}



module.exports = {
	GetCategories,
	GetProducts,
	GetOneProduct,
	
}
