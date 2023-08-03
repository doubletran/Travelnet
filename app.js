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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname +'/public'));
 

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

        let query4 = `SELECT CONCAT(Locations.address, ' ', Locations.city, ' ', 
        Locations.state, ' ', Locations.zip_code, ' ', Locations.country) AS 'Locations', location_id
        FROM Locations`;

        db.pool.query(query1, function(error, rows, fields){ 
            
            let posts = rows;

            db.pool.query(query2, function(error, rows, fields){

                let users = rows;

                db.pool.query(query3, function(error, rows, fields){

                    let friendships = rows;
                    
                    db.pool.query(query4, function(error, rows, fields){

                        res.render('posts', {posts: posts, users: users, friendships: friendships, locations: rows});
                    })
                })
                
            })
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

// app.js - ROUTES section

app.post('/posts-ajax', function(req, res) 
{
    let data = req.body;

    // Capture NULL values
    let location = parseInt(data.location);
    if (isNaN(location))
    {
        location = 'NULL'
    }

    // First, insert into Posts
    query1 = `INSERT INTO Posts (content, access, user_id, location_id) VALUES 
    ('${data.content}', '${data.access}', '${data.userID}', '${data.location}')`;
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
    })

    // Next, for every friend mentioned, insert into the Posts_has_Friendships intersection table.
    for (let i = 0; i < data.friendList.length; i++) {
        query2 = `INSERT INTO Posts_has_Friendships (post_id, friendship_id) 
        VALUES (
            (SELECT post_id FROM Posts WHERE content = '${data.content}' AND access = '${data.access}' AND user_id = '${data.userID}' AND location_id = '${data.location}'), 
            (SELECT friendship_id FROM Friendships WHERE (user_id = '${data.userID}' AND friend_user_id = '${data.friendList[i]}') OR (user_id = '${data.friendList[i]}' AND friend_user_id = '${data.userID}'))
            )`;
        db.pool.query(query2, function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
        })
    }

    // Finally, send back the data to be used for appending a row to the Posts table in ajax. 
    query3 = `SELECT Posts.post_id, Posts.content AS "Content", access AS "Access", 
           user.user_name, GROUP_CONCAT(friend.user_name SEPARATOR', ') AS "FriendsMentioned", 
           CONCAT(Locations.address, ' ', Locations.city, ' ', 
           Locations.state, ' ', Locations.zip_code, ' ', Locations.country) AS 'LocationsPinned'
           FROM Posts 
           LEFT JOIN Posts_has_Friendships ON Posts.post_id = Posts_has_Friendships.post_id
           INNER JOIN Users user ON user.user_id = Posts.user_id 
           LEFT JOIN Friendships ON Friendships.friendship_id = Posts_has_Friendships.friendship_id 
           LEFT JOIN Users friend ON Friendships.friend_user_id = friend.user_id 
           LEFT JOIN Locations ON Locations.location_id = Posts.location_id
           GROUP BY Posts.post_id`;
    db.pool.query(query3, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else{
            res.send(rows);
        }
    })
});

app.put('/put-post-ajax', function(req,res,next){
    let data = req.body;
    console.log
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
