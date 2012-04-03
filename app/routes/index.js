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

exports.word = function(req, res) { 
	var word = req.params.word;
	//reply.getList calls function in reply_module.js to generate URL/scores list
	reply.getList(word, function (error, reply) {
		var data = {word: word, reply: reply};
		res.render('word',data);
	});
};

