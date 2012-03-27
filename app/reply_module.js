var http = require('http');
var redis = require('redis');
var client = redis.createClient();

	
module.exports.getList = function (word, callback) {
	
	client.sadd('words', word.toLowerCase(), function (error, exists) {
		if (error) {
			console.log(error);
			callback(error, null);
		}
		var response = [];
		if (exists === 0) {
			client.zrevrangebyscore(word.toLowerCase(), '+inf', 0, 'withscores', function(error, result){
				if (error) {
					console.log(error);
					callback(error, null);
				}
				if (typeof result[0] !== 'undefined') {
					for (var j = 0 ; j < result.length ; j=j+2) {
						response.push(result[j+1] + " - " + result[j]);
					}
					callback(null, response);	
				} else {
					response.push("no results yet for " + word);
					callback(null, response);
				}
			});
		} else if (exists === 1) {
			response.push("now tracking " + word);
			callback(null, response);
		}
	});
	
};