var express = require('express');
var app = express();
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var hbs  = require('express-handlebars');
//Mongo setup
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://localhost/bpndb', { useNewUrlParser: true,useCreateIndex: true });  //it will remove deprecation messages


var routes = require('./routes/auth.js');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
	secret:'bhanddaribpn1996',
	resave:true,
	saveUninitialized:false,
	store: new MongoStore({ url: 'mongodb://localhost/bpndb'}),
	 cookie: {
        expires: 365 * 24 * 60 * 60 * 1000   // for 1 year (days*hour*min*sec*10000 millisecond)
    }

}));

//use to pass data to the template ==> available to views while rendering
app.use(function(req,res,next){
	res.locals.currentUser = req.session.userId;
	next();
});

// always use routes at the button
app.use('/',routes);







app.listen(3000,function(){
	console.log("Listening on port 3000");
});