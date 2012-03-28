var http = require('http');
var redis = require('redis');
var client = redis.createClient();

	
module.exports.getList = function (word, callback) {
	
	//first add the word to the trackedWords set
	client.sadd('words', word.toLowerCase(), function (error, exists) {
		if (error) {
			console.log(error);
			callback(error, null);
		}
		var response = [];
		if (exists === 0) { //if word was already in the set
			//get list of urls and scores for word
			client.zrevrangebyscore(word.toLowerCase(), '+inf', 0, 'withscores', function(error, result){
				if (error) {
					console.log(error);
					callback(error, null);
				}
				//if at least one result returned
				if (typeof result[0] !== 'undefined') {
					for (var j = 0 ; j < result.length ; j=j+2) {
						response.push(result[j+1] + " - " + result[j]);
					}
					callback(null, response);	
				} else { //else if no results returned
					response.push("no results yet for " + word);
					callback(null, response);
				}
			});
		} else if (exists === 1) { //else if word was not already in the trackedWords set
			response.push("now tracking " + word);
			callback(null, response);
		}
	});
	
};