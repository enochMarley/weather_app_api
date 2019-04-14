var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express()
var mongoose = require('mongoose');
var PORT = 3000 | process.env.PORT;

const cities = require('cities.json');

var mongoDbUrl = "mongodb://weather:weather1@ds139896.mlab.com:39896/weather";

// connect to the database
mongoose.connect(mongoDbUrl, function(error){
	if (error) {
		console.log(error)
	}else{
		console.log('mongodb connected')
	}
});

// create the city schema
var countrySchema = mongoose.Schema({
	name: String,
	capital: String,
	code: String,
	lat: Number,
	lon: Number,
});

var country = mongoose.model('country', countrySchema);

// getting the index of the api
app.get('/', function (req, res) {
  	res.send('Hello World')
})

app.get('/insert-cities', function(req, res) {
	var filePath = path.join(__dirname, "countries.json");
	const fileContent = fs.readFileSync(filePath);
	const cityJSON = JSON.parse(fileContent);
	var cities = [];

	for (var i = 0; i < cityJSON.length; i++) {
		var obj = {
			name: cityJSON[i].name,
			capital: cityJSON[i].capital,
			code: cityJSON[i].country_code,
			lat: cityJSON[i].latlng[0],
			lon: cityJSON[i].latlng[1],
		}

		cities.push(obj)
	}

	console.log("there are " + cities.length + " cities");

	country.collection.insertMany(cities, (err, docs) => {
		if (err) {
			console.log('error inserting data', err)
		} else {
			console.log('inserted ' + cities.length + ' cities');
		}
	})
})

// url to get the cities
app.get('/get-cities', function(req, res) {
	country.find({}, (err, docs) => {
		if (err) {
			console.log('error getting data')
			res.send([])
		} else {
			console.log('getting data')
			res.json(docs)
		}
	})
})
 
app.listen(PORT, () => console.log('server listening on port ' + PORT));