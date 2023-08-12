-- group #18
-- Tongxin Sun, & Tran Tran

SELECT Friendships.friendship_id AS "Friendship ID", Friendships.start_date AS "Start Date", 
calMulCt(user.user_id, friend.user_id) AS "Mutual Friends Count", user.user_name AS "User 1 Name", 
friend.user_name AS "User 2 Name" 
FROM Friendships 
INNER JOIN Users user ON Friendships.user_id = user.user_id
INNER JOIN Users friend ON Friendships.friend_user_id = friend.user_id;

---------------------------------- Users Page ------------------------------------------------
----------------------------------------------------------------------------------------------
-- Get all data to populate the Users table
-- The table on the users.html page displays User ID, User Name, Email, and Password columns. 
SELECT user_id AS "User ID", user_name AS "User Name", email AS Email, password AS Password 
FROM Users;

-- Add new row to the Users table
INSERT INTO Users (user_name, email, password) VALUES (:user_name_input, :email_input, :password_input);


---------------------------------- Friendships Page ------------------------------------------------
----------------------------------------------------------------------------------------------
-- Get all data to populate the Friendships table
-- The table on the friendships.html page displays Friendship ID, Start Date, Mutual Friends 
-- Count, User and Friend columns. 
SELECT Friendships.friendship_id AS "Friendship ID", Friendships.start_date AS "Start Date", 
Friendships.mutual_friend_ct AS "Mutual Friends Count", user.user_name AS "User 1 Name", 
friend.user_name AS "User 2 Name" 
FROM Friendships 
INNER JOIN Users user ON Friendships.user_id = user.user_id
INNER JOIN Users friend ON Friendships.friend_user_id = friend.user_id;

-- Add new row to the Friendships table
INSERT INTO Friendships (start_date, mutual_friend_ct, user_id, friend_user_id) VALUES (:start_date_input, 
calMulCt(:user_id_selected_from_dropdown, :friend_user_id_from_dropdown), :user_id_selected_from_dropdown, :friend_user_id_from_dropdown);


---------------------------------- Posts Page ------------------------------------------------------
----------------------------------------------------------------------------------------------------
-- Get all data to populate the Posts table
-- The table on the posts.html page displays Post ID, Content, Access and User columns.
SELECT Posts.post_id AS "Post ID", Posts.content AS "Content", access AS "Access", 
Posts.user_id AS "User ID", user.user_name AS "User Name", GROUP_CONCAT(friend.user_name SEPARATOR', ') AS "Friends Mentioned", 
CONCAT(Locations.address, ' ', Locations.city, ' ', 
Locations.state, ' ', Locations.zip_code, ' ', Locations.country) AS 'Locations Pinned'
FROM Posts 
LEFT JOIN Posts_has_Friendships ON Posts.post_id = Posts_has_Friendships.post_id
INNER JOIN Users user ON user.user_id = Posts.user_id 
LEFT JOIN Friendships ON Friendships.friendship_id = Posts_has_Friendships.friendship_id 
LEFT JOIN Users friend ON Friendships.friend_user_id = friend.user_id 
LEFT JOIN Locations ON Locations.location_id = Posts.location_id
GROUP BY Posts.post_id;

-- Get a single post's data for the Update Post form
SELECT Posts.post_id AS "Post ID", Posts.content AS "Content", access AS "Access", 
Posts.user_id AS "User ID", user.user_name AS "User Name", GROUP_CONCAT(friend.user_name SEPARATOR', ') AS "Friends Mentioned", 
CONCAT(Locations.address, ' ', Locations.city, ' ', 
Locations.state, ' ', Locations.zip_code, ' ', Locations.country) AS 'Locations Pinned', Locations.location_id
FROM Posts
LEFT JOIN Users user ON user.user_id = Posts.user_id
LEFT JOIN Posts_has_Friendships ON Posts_has_Friendships.post_id = Posts.post_id
LEFT JOIN Friendships ON Friendships.friendship_id = Posts_has_Friendships.friendship_id
LEFT JOIN Users friend ON (CASE WHEN Posts.user_id = Friendships.user_id THEN Friendships.friend_user_id ELSE Friendships.user_id END) = friend.user_id
LEFT JOIN Locations ON Locations.location_id = Posts.location_id
GROUP BY Posts.post_id

-- Add new row to the Posts table
INSERT INTO Posts (content, access, user_id, location_id) VALUES (:content_input, :access_input, :user_id_input, :location_id_input);

-- Get all user_names to populate a dropdown list of user_names for creating a new Post 
SELECT user_id, user_name FROM Users

-- Get data for rendering a friend dropdown list of a given user for creating a new Post
SELECT * FROM ((SELECT Users.user_id AS "UserID", Users.user_name AS "User", 
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
ORDER BY t.UserID

-- Update a post's data based on submission of the Update Post form 
UPDATE Posts SET content = :content_input, access = :access_selected, user_id = :user_id_selected,
location_id = :location_id_from_drop_down_input
WHERE post_id = :post_id_from_the_update_form;

-- delete a post
DELETE FROM Posts WHERE post_id = :post_id_selected_from_browse_post_page;

---------------------------------- Posts_has_Friendships Page --------------------------------------
----------------------------------------------------------------------------------------------------
SELECT posts_friendships_id AS "Posts_Friendships ID", Posts.content AS "Post Content", user.user_name AS "User", friend.user_name AS "Friend Mentioned"
FROM Posts_has_Friendships
INNER JOIN Posts ON Posts_has_Friendships.post_id = Posts.post_id
INNER JOIN Friendships ON Posts_has_Friendships.friendship_id = Friendships.friendship_id
INNER JOIN Users user ON Posts.user_id = user.user_id
INNER JOIN Users friend ON (CASE WHEN Posts.user_id = Friendships.user_id THEN Friendships.friend_user_id ELSE Friendships.user_id END) = friend.user_id
ORDER BY Posts_has_Friendships.posts_friendships_id

-- Add new row to the Posts_has_Friendships table
INSERT INTO Posts_has_Friendships (post_id, friendship_id) VALUES ((SELECT post_id FROM Posts WHERE 
content = :content_input AND access = :access_from_dropdown AND user_id = :user_id_input), (SELECT 
friendship_id FROM Friendships WHERE user_id = :user_id_input AND friend_user_id = :friend_user_id_input));

-- dis-associate a Post from a Friendship (M-to-M relationship deletion)
DELETE FROM Posts_has_Friendships WHERE post_id = :Post_ID_selected_from_Posts_has_Friendships_list


---------------------------------- Locations Page --------------------------------------------------
----------------------------------------------------------------------------------------------------
-- Get all data to populate the Locations table
-- The table on the locations.html page displays Location ID, Address Line, City, State, Zip Code, 
-- and Country columns.
SELECT Locations.location_id AS "Location ID", Locations.address AS "Address Line", Locations.city
AS "City", Locations.state AS "State", Locations.zip_code AS "Zip Code", Locations.country AS "Country"
FROM Locations;

-- Add new row to the Locations table
INSERT INTO Locations (address, city, state, zip_code, country) VALUES (:address_input, :city_input, 
:state_input, :zip_code_input, :country_input);