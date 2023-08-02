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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
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
        let query1 = `SELECT Posts.post_id AS "Post ID", Posts.content AS "Content", access AS "Access", 
        user.user_name AS "User Name", GROUP_CONCAT(friend.user_name SEPARATOR', ') AS "Friends Mentioned", 
        CONCAT(Locations.address, ' ', Locations.city, ' ', 
        Locations.state, ' ', Locations.zip_code, ' ', Locations.country) AS 'Locations Pinned'
        FROM Posts 
        LEFT JOIN Posts_has_Friendships ON Posts.post_id = Posts_has_Friendships.post_id
        INNER JOIN Users user ON user.user_id = Posts.user_id 
        LEFT JOIN Friendships ON Friendships.friendship_id = Posts_has_Friendships.friendship_id 
        LEFT JOIN Users friend ON Friendships.friend_user_id = friend.user_id 
        LEFT JOIN Locations ON Locations.location_id = Posts.location_id
        GROUP BY Posts.post_id`;

        let query2 = `SELECT user_id, user_name FROM Users`;

        let query3 = `SELECT * FROM ((SELECT Users.user_id AS "UserID", Users.user_name AS "User", 
        Friendships.friend_user_id AS "FriendID", friends.user_name AS "Friend"
        FROM Users 
        INNER JOIN Friendships ON Friendships.user_id = Users.user_id 
        INNER JOIN Users friends ON friends.user_id = Friendships.friend_user_id) 
        UNION 
        (SELECT Users.user_id AS "UserID", Users.user_name AS "User", 
        Friendships.user_id AS "FriendID", friends.user_name AS "Friend"
        FROM Users 
        INNER JOIN Friendships ON Friendships.friend_user_id = Users.user_id 
        INNER JOIN Users friends ON friends.user_id = Friendships.user_id)) AS t
        ORDER BY t.UserID`;

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            
            let posts = rows;

            db.pool.query(query2, function(error, rows, fields){

                let users = rows;

                db.pool.query(query3, function(error, rows, fields){

                    res.render('posts', {posts: posts, users: users, friendships: rows});  
                })
                
            })
        })/*
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
        }) */
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
