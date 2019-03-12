const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bootstrap = require('bootstrap');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', function(){
	console.log('Connected to MongoDB')
});

//Check for db errors
db.on('error', function(err){
	console.log(err);
});
//Init App
const app = express();

//Bring in Modules
let Article = require('./models/article');


// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//BodyParser Middleware parse application 
app.use(bodyParser.urlencoded({ extended: false}));
//pasrse application/json
app.use(bodyParser.json());
//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));


// Home Route
app.get('/', function(req, res){
	Article.find({}, function(err, articles){
		if(err){
			console.log(err);
		}else{
			res.render('index', {
	title: 'Articles',
	articles: articles
});
		}
		
	});

});

//Add Route
app.get('/articles/add', function(req, res){
	res.render('add_article',{
		title:'Add Article'
	});
});

// Add Submit POST Route
app.post('/articles/add', function(req, res){
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err){
		if(err){
			console.log(err);
			return;
		}else{
			res.redirect('/');
		}
	});
});

// Start Server
app.listen(3000, function(){
console.log('Server started on port 3000...');
});