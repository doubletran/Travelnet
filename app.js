/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
PORT = 8018;

// Database
var db = require('./group18-cs340-project/database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
const { query } = require ('express');
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');  

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
        let query2 = "SELECT * from Users;";
        db.pool.query(query2, function(error, rows, fields){  
        res.render('friendships', {data: rows});
        })
    });
app.get('/posts', function (req, res)
    {
        let query1 = "SELECT * from Posts;";
      

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            let posts = rows;
            let query2 = "SELECT * from Users;";
            db.pool.query(query2, (error, rows, fields) => {
                 let users = rows;
                let userMap = {}
                users.map(user=> {
                    let id = parseInt(user.user_id, 10);
                    userMap[id] = user["user_name"];
                })
                posts = posts.map(post => {
                    return Object.assign(post, {user_id: userMap[post.user_id]})
                })
                return res.render('posts', {data: posts})
            })
                         // Render the index.hbs file, and also send the renderer
        }) 
    });
app.get('/locations', function (req, res)
    {
        res.render('locations');
    });
app.get('/posts-friendships', function (req, res)
    {
        let query = "SELECT * from Posts_has_Friendships;";
       
        db.pool.query(query, function(error, rows, fields){    // Execute the query

            res.render('posts-friendships', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })   
    });


/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
