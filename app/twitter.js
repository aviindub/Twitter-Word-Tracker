var twitter = require('ntwitter');
var redis = require('redis');
var credentials = require('./credentials.js');
var client = redis.createClient(); //using local redis server, no arguments required
var trackedWords;

var twitter = new twitter({
//use credentials from credentials.js
consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret

});

//first get list of tracked words
client.smembers('words', function (error, result) {
	if (error) {console.log(error);}
	trackedWords = result;
	//start the twitter stream
	twitter.stream(
		'statuses/sample', //returns sample of all statuses
		function(stream){
			stream.on('data', function(tweet){
				
				//loop through trackedWords to see which word(s) match tweet text
				for (var i = 0 ; i < trackedWords.length ; i++) {
					if (tweet.text.match(new RegExp(trackedWords[i]))) {
						console.log("matches " + trackedWords[i]);
						if (trackedWords[i] === "rad") { console.log(tweet.text); }
						var url = ""; 
						//extract the url from the tweet...first test for expanded URLs
						if (tweet.entities.urls.length > 0) {
							if (tweet.entities.urls[0].expanded_url != null) {
								url = tweet.entities.urls[0].expanded_url;
							}	//test for shortened URLs
							else if (tweet.entities.urls[0].url != null) {
							url = tweet.entities.urls[0].url; 
							}
						}
						
						if (url != "") { //if url successfully extracted
							console.log(trackedWords[i] +" : "+ url);
							//increment count if match found
							//also automagically starts new count if needed
							client.zincrby(trackedWords[i], 1, url);
						}
					}
				}
			});
		}
	);

	//every 5 seconds, refresh list of trackedWords
	setInterval(function () {
		client.smembers('words', function (error, result) {
			if (error) {console.log(error);}
			trackedWords = result;
			console.log("updated trackedWords");
		});
	},5000);
});