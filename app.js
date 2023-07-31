/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
PORT = 8018;

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
//app.engine('.hbs', engine({partialsDir: 'views/partials', extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates

app.engine('hbs', exphbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    extname: '.hbs',
    partialsDir: 'views/partials',
    //new configuration parameter
    defaultLayout: 'main',
    }));

app.set('view engine', '.hbs');
app.set("views", "./views");

exphbs.registerPartial('navbar');

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));

/*
    ROUTES
*/
app.get('/', function(req, res)
    {  
        res.render('index');                                                     // an object where 'data' is equal to the 'rows' we
    });  
app.get('/users', function (req, res)
    {
        res.render('users');
    });
app.get('/friendships', function (req, res)
    {
        res.render('friendships');
    });
app.get('/posts', function (req, res)
    {
        res.render('posts');
    });
app.get('/locations', function (req, res)
    {
        res.render('locations');
    });
app.get('/posts-friendships', function (req, res)
    {
        res.render('posts-friendships');
    });
app.get('/posts-locations', function (req, res)
    {
        res.render('posts-locations');
    });
app.get('/users-locations', function (req, res)
    {
        res.render('users-locations');
    });

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
