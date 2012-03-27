/*
 * GET home page.
 */

 
var ejs = require('ejs');
var reply = require('../reply_module');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.user = function(req, res) { 
	res.send('Welcome to the profile of ' + req.params.user + '!'); 
};

exports.word = function(req, res) { 
	var word = req.params.word;
	reply.getList(word, function (error, replyString) {
		var data = {word: word, reply: replyString};
		res.render('word',data);
	});
};

