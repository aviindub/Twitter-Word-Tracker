/*
 * GET home page.
 * render a partial .ejs file from /views
 * partials are automatically rendered inside layout.ejs
 * 
 * res.render('word',data)
 * renders the partial word.ejs using object data, all inside layout.ejs 
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
	//reply.getList calls function in reply_module.js to generate URL/scores list
	reply.getList(word, function (error, replyString) {
		var data = {word: word, reply: replyString};
		res.render('word',data);
	});
};

