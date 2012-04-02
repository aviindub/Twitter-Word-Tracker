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
		var responseScores = [];
		var responseUrls = [];
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
						responseUrls.push(result[j]);
						responseScores.push(result[j+1]);
					}
					var response = {responseUrls: responseUrls, responseScores: responseScores};
					callback(null, response);	
				} else { //else if no results returned
					var response = {altResponse: "no results yet for " + word};
					callback(null, response);
				}
			});
		} else if (exists === 1) { //else if word was not already in the trackedWords set
			var response = {altResponse: "now tracking " + word};
			callback(null, response);
		}
	});
	
};