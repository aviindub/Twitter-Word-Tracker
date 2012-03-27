var http = require('http');
var redis = require('redis');
var client = redis.createClient();

	
module.exports.getList = function (word, callback) {
	
	client.sadd('words', word.toLowerCase(), function (error, exists) {
		if (error) {
			console.log(error);
			callback(error, null);
		}
		if (exists === 0) {
			client.zrevrangebyscore(word.toLowerCase(), '+inf', 0, 'withscores', function(error, result){
				if (error) {console.log(error);}
				if (result) {
					var responseString = "";
					responseString += "<h1>" + word + "</h1><ul>";
					for (var j = 0 ; j < result.length ; j=j+2) {
						responseString += "<li>" + result[j+1] + " - " + result[j] + "</li>";
					}
					responseString += "</ul>";
					callback(null, responseString);	
				} else {
					callback(null, "<h1>no results yet for" + word + "</h1>");
				}
			});
		} else if (exists === 1) {
			callback(null, "<h1>now tracking" + word + "</h1>");
		}
	});
	
};