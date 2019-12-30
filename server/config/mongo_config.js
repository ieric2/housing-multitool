var MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

var _db;

async function connectToMongo() {
	return await MongoClient.connect(process.env.MONGO_URI, function(err, client) {
		if (err) {
			console.log(err);
		}
		else {
			console.log("Connected to Mongo.");
			_db = client.db('test');
		}
	})
}

async function get_db() {
	if (!_db) {
		await connectToMongo();
	}
	return _db;
}

connectToMongo();

module.exports = {
	get_db: get_db
}