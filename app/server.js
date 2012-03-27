var http = require('http');
var redis = require('redis');
var client = redis.createClient();
//trackedWords should be the same as words being tracked in twitter.js
var trackedWords = ['awesome', 'cool', 'rad', 'gnarly', 'groovy']; 



function recMGetRange (array, nextIndex, results, callback) {
	if (array.length === nextIndex) {
		callback(null, results);
	}
	else {
		client.zrevrangebyscore(array[nextIndex], '+inf', 0, 'withscores', function(error, result){
			results.push(result);
			recMGetRange(array, nextIndex+1, results, callback);
		});
	}
}

//callback gets results[] which is array of arrays parallel to trackedWords
function MGetRange (array, callback) {
	var results = [];
	recMGetRange (array, 0, results, callback);
}

http.createServer(function (request, response) {

	response.writeHead(200, {'Content-Type': 'text/html'});
	
	var responseString = "";
	MGetRange(trackedWords, function (error, results) {
		for (var i = 0 ; i < trackedWords.length ; i++) {
			responseString += "<h1>" + trackedWords[i] + "</h1>";
			result = results[i];
			for (var j = 0 ; j < result.length ; j=j+2) {
				responseString += "<li>" + result[j+1] + " - " + result[j] + "</li>";
			}
			responseString += "<br />";
		}
		response.end(responseString);
	});


}).listen(3000);

console.log('Server running on port 3000');