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
        let select_all = `SELECT user_id AS "User ID", user_name AS "User Name", email AS Email, password AS Password 
        FROM Users;`;
       
        db.pool.query(select_all, function(error, rows, fields){    // Execute the query

            res.render('users', {data: rows});                  // Render the index.hbs file, and also send the renderer
        }) 
    });
app.get('/friendships', function (req, res)
    {
        let query1 = `SELECT Friendships.friendship_id AS "Friendship ID", Friendships.start_date AS "Start Date", 
        Friendships.mutual_friend_ct AS "Mutual Friends Count", user.user_name AS "User 1 Name", 
        friend.user_name AS "User 2 Name" 
        FROM Friendships 
        INNER JOIN Users user ON Friendships.user_id = user.user_id
        INNER JOIN Users friend ON Friendships.friend_user_id = friend.user_id;`;
       
        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('friendships', {data: rows});              
            console.log(rows);   
        })   
    });
app.get('/posts', function (req, res)
    {
        //let query1 = "SELECT * from Posts;";
        let query1 = `SELECT Posts.post_id AS "Post ID", Posts.content AS "Content", access AS "Access", 
        Posts.user_id AS "User ID", user.user_name AS "User Name", GROUP_CONCAT(friend.user_name SEPARATOR', ') AS "Friends Mentioned", 
        CONCAT(Locations.address, ' ', Locations.city, ' ', 
        Locations.state, ' ', Locations.zip_code, ' ', Locations.country) AS 'Locations Pinned'
        FROM Posts 
        LEFT JOIN Posts_has_Friendships ON Posts.post_id = Posts_has_Friendships.post_id
        INNER JOIN Users user ON user.user_id = Posts.user_id 
        LEFT JOIN Friendships ON Friendships.friendship_id = Posts_has_Friendships.friendship_id 
        LEFT JOIN Users friend ON Friendships.friend_user_id = friend.user_id 
        LEFT JOIN Locations ON Locations.location_id = Posts.location_id
        GROUP BY Posts.post_id;`;
        db.pool.query(query1, function(error, rows1, fields){    // Execute the query
        
            let userQuery = `SELECT * from Users;`
            db.pool.query(userQuery, (error, row2, fields) => { 
            
                return res.render('posts', {data: rows1, users: row2});

            })
            //res.render('posts', {data: posts});
            
        }) 
    });
app.get('/locations', function (req, res)
    {
        let select_all = `SELECT Locations.location_id AS "Location ID", Locations.address AS "Address Line", Locations.city
        AS "City", Locations.state AS "State", Locations.zip_code AS "Zip Code", Locations.country AS "Country"
        FROM Locations;`;
       
        db.pool.query(select_all, function(error, rows, fields){    // Execute the query

            res.render('locations', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })   
    });
app.get('/posts-friendships', function (req, res)
    {
        let select_all = `SELECT posts_friendships_id AS "Posts_Friendships ID", Posts.content AS "Post Content",
        user.user_name AS "User", friend.user_name AS "Friend Mentioned"
        FROM Posts_has_Friendships
        INNER JOIN Posts ON Posts_has_Friendships.post_id = Posts.post_id
        INNER JOIN Users user ON Posts.user_id = user.user_id
        INNER JOIN Friendships ON Posts_has_Friendships.friendship_id = Friendships.friendship_id
        INNER JOIN Users friend ON Friendships.friend_user_id = friend.user_id;`;
       
        db.pool.query(select_all, function(error, rows, fields){    // Execute the query

            res.render('posts-friendships', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })   
    });
    app.put('/put-post-ajax', function(req,res,next){
        let data = req.body;
      
        let friend= parseInt(data.friend);
        let post = parseInt(data.post);
        let user = parseInt(data.user);
       // let select_friendship = `SELECT friendship_id FROM Friendships 
       // WHERE user_id = ? AND friend_user_id = ?`;

    
      
        let update_post = `UPDATE Posts_has_Friendships SET friendship_id = (SELECT friendship_id FROM Friendships 
            WHERE user_id = ? AND friend_user_id = ?) WHERE post_id = ?;`;
        let select_friend = `SELECT Users.user_name from Friendships 
        JOIN Users ON Users.user_id = Friendships.friend_user_id WHERE friendship_id = (SELECT friendship_id FROM Friendships 
                WHERE user_id = ? AND friend_user_id = ?);`;

    

        //console.log (friend, user, select_friendship, update_post);
      
              // Run the 1st query
              
              db.pool.query(update_post ,[user,friend,post], function(error, row_friendship, fields){
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  // If there was no error, we run our second query and return that data so we can use it to update the people's
                  // table on the front-end
                  else
                  {
                   // console.log(row_friendship);

                      // Run the second query
                      db.pool.query(select_friend, [user, friend], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                            //console.log(rows);
                            

                              res.send(rows);
                          }
                      })
                
                  }
      })});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
