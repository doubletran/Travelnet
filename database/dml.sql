-- group #18
-- Tongxin Sun, & Tran Tran

CREATE FUNCTION calMulCt (id1 int, id2 int)
    RETURNS int DETERMINISTIC
    RETURN (SELECT COUNT(*) FROM ((select Friendships.friend_user_id from Users 
    INNER JOIN Friendships ON Users.user_id = Friendships.user_id WHERE Friendships.user_id = id1)
    intersect (select Friendships.friend_user_id from Users 
    INNER JOIN Friendships ON Users.user_id = Friendships.user_id WHERE Friendships.user_id = id2)) as t);

-- The following 5 SELECT queries populate each table on each page with data------------------
----------------------------------------------------------------------------------------------
-- Get all data to populate the Users table
-- The table on the users.html page displays User ID, User Name, Email, and Password columns. 
SELECT user_id AS "User ID", user_name AS "User Name", email AS Email, password AS Password 
FROM Users;

-- Get all data to populate the Friendships table
-- The table on the friendships.html page displays Friendship ID, Start Date, Mutual Friends 
-- Count, User and Friend columns. 
SELECT Friendships.friendship_id AS "Friendship ID", Friendships.start_date AS "Start Date", 
calMulCt(Friendships.user_id, Friendships.friend_user_id) AS "Mutual Friends Count", Friendships.user_id AS "User ID", 
user.user_name AS "User Name", Friendships.friend_user_id AS "Friend User ID",  friend.user_name 
AS "Friend User Name" 
FROM Friendships 
INNER JOIN Users user ON Friendships.user_id = user.user_id
INNER JOIN Users friend ON Friendships.friend_user_id = friend.user_id;
 
-- Get all data to populate the Posts table
-- The table on the posts.html page displays Post ID, Content, Access and User columns.
SELECT Posts.post_id AS "Post ID", Posts.content AS "Content", access AS "Access", 
Posts.user_id AS "User ID", user.user_name AS "User Name", GROUP_CONCAT(friend.user_name SEPARATOR', ') AS "Friends Mentioned", 
Posts.location_id AS "Location ID"
FROM Posts LEFT JOIN Posts_has_Friendships ON Posts.post_id = Posts_has_Friendships.post_id
INNER JOIN Users user ON user.user_id = Posts.user_id 
LEFT JOIN Friendships ON Friendships.friendship_id = Posts_has_Friendships.friendship_id 
LEFT JOIN Users friend ON Friendships.friend_user_id = friend.user_id 
LEFT JOIN Locations ON Locations.location_id = Posts.location_id
GROUP BY Posts.post_id;

-- Get all data to populate the Locations table
-- The table on the locations.html page displays Location ID, Address Line, City, State, Zip Code, 
-- and Country columns.
SELECT Locations.location_id AS "Location ID", Locations.address AS "Address Line", Locations.city
AS "City", Locations.state AS "State", Locations.zip_code AS "Zip Code", Locations.country AS "Country"
FROM Locations;

-- Get all data to populate the Posts_has_Friendships intersection table
-- The table on the posts-friendships.html page displays Post Content, User, and Mentions columns.
SELECT posts_friendships_id AS "Posts_Friendships ID", Posts_has_Friendships.post_id AS "Post ID", 
Posts.content AS "Post Content", Posts_has_Friendships.friendship_id AS "Friendship ID", 
user.user_name AS "User", friend.user_name AS "Friend"
FROM Posts_has_Friendships
INNER JOIN Posts ON Posts_has_Friendships.post_id = Posts.post_id
INNER JOIN Users user ON Posts.user_id = user.user_id
INNER JOIN Friendships ON Posts_has_Friendships.friendship_id = Friendships.friendship_id
INNER JOIN Users friend ON Friendships.friend_user_id = friend.user_id;
----------------------------------------------------------------------------------------------


-- The following INSERT queries get the corresponding data for dropdown lists --------------
----------------------------------------------------------------------------------------------
-- Get all User IDs and User Names to populate the User Name dropdown. 
SELECT user_id, user_name FROM Users;

-- Get all User IDs and User Names to populate the Friend User Name dropdown based on a given User.
SELECT user_id, user_name FROM Users
WHERE user_id != :user_id_selected_from_user_name_dropdown_list;

-- Get all Post IDs and Post Contents to populate the Post dropdown. 
SELECT post_id, content FROM Posts;

-- Get all Post IDs and Post Contents to populate the Posts_has_Friendships dropdown. 
SELECT CONCAT(user.user_name, " - ", Friends.user_name)
FROM Posts
INNER JOIN Friendships ON Friendships.user_id = Posts.user_id
INNER JOIN Users user ON Posts.user_id = user.user_id
INNER JOIN Users friend ON Friendships.friend_user_id = Friends.user_id
WHERE Posts.post_id = :post_id_selected_from_the_post_dropdown;

-- Get all Location IDs and Location Address to populate the Locations dropdown.
SELECT CONCAT(Locations.address, ' ', Locations.city, ' ', 
Locations.state, ' ', Locations.zip_code, ' ', Locations.country) AS 'Locations'
FROM Locations;


-- The following 5 INSERT queries get a single row for each update form ----------------------
----------------------------------------------------------------------------------------------
-- Add new row to the Users table
INSERT INTO Users (user_name, email, password) VALUES (:user_name_input, :email_input, :password_input);

-- Add new row to the Friendships table
INSERT INTO Friendships (start_date, mutual_friend_ct, user_id, friend_user_id) VALUES (:start_date_input, 
(
    SELECT COUNT(*) FROM ((select Friendships.friend_user_id from Users 
    INNER JOIN Friendships ON Users.user_id = Friendships.user_id WHERE Friendships.user_id = :user_id_selected_from_drop_down)
    intersect (select Friendships.friend_user_id from Users 
    INNER JOIN Friendships ON Users.user_id = Friendships.user_id WHERE Friendships.user_id = :friend_user_id_selected_from_dropdown)) as t
), :user_id_selected_from_dropdown, :friend_user_id_from_dropdown);

-- Add new row to the Posts table
INSERT INTO Posts (content, access, user_id) VALUES (:content_input, :access_input, :user_id_input);

-- Add new row to the Locations table
INSERT INTO Locations (address, city, state, zip_code, country) VALUES (:address_input, :city_input, 
:state_input, :zip_code_input, :country_input);

-- Add new row to the Posts_has_Friendships table
INSERT INTO Posts_has_Friendships (post_id, friendship_id) VALUES (:post_id_input, (SELECT friendship_id 
FROM Friendships WHERE user_id = :user_id_input AND friend_user_id = :friend_user_id_input));

----------------------------------------------------------------------------------------------



-- The following SELECT queries get a given row to show on the Update form--------------------
----------------------------------------------------------------------------------------------
-- Get a single user's data for the Update User form
SELECT user_id, user_name, email, password FROM Users WHERE user_id = :user_id_selected_from_browse_user_page;

-- Get a single friendship's data for the Update Friendship form
SELECT friendship_id, start_date, mutual_friend_ct, user_id, friend_user_id 
FROM Friendships
WHERE friendship_id = :friendship_id_selected_from_browse_friendship_page;

-- Get a single post's data for the Update Post form
SELECT post_id, content, access, user_id 
FROM Posts WHERE post_id = post_id_selected_from_browse_post_page;

-- Get a single location's data for the Update Location form
SELECT location_id, address, city, state, zip_code, country
FROM Locations WHERE location_id = location_id_selected_from_browse_location_page

-- Get a single Posts_has_Friendships's data for the Update Posts_has_Locations form
SELECT posts_friendships_id, post_id, friendship_id
FROM Posts_has_Friendships WHERE posts_friendships_id = posts_friendships_id_selected_from_browse_page






-- The following UPDATE queries update a selected row of a given table ---------------------
----------------------------------------------------------------------------------------------
-- Update a user's data based on submission of the Update User form
UPDATE Users SET user_name = :user_name_input, email = :email_input, password = :password_input
WHERE user_id = :user_id_from_the_update_form;

-- Update a friendship's data based on submission of the Update Friendship form 
UPDATE Friendships SET start_date = :start_date_input, mutual_friend_ct = :mutual_friend_ct_input
user_id = :user_id_from_drop_down_input, friend_user_id = :friend_user_id_from_drop_down_input 
WHERE friendship_id = :friendship_id_from_the_update_form;

-- Update a post's data based on submission of the Update Post form 
UPDATE Posts SET content = :content_input, access = :access_selected, user_id = :user_id_selected,
location_id = :location_id_from_drop_down_input
WHERE post_id = :post_id_from_the_update_form;

-- Update a location's data based on submission of the Update Location form 
UPDATE Locations SET address = :address_input, city = :city_input, state = :state_input,
zip_code = :zip_code_input, country = :country_input
WHERE location_id = :location_id_from_the_update_form;

-- Update a posts_has_friendships' data based on submission of the Update Posts_has_Friendships form 
UPDATE Posts_has_Friendships SET post_id = :post_id_selected, friendship_id = :friendship_id_selected 
WHERE posts_friendships_id = :posts_friendships_id_from_the_update_form;
----------------------------------------------------------------------------------------------



-- The following DELETE queries delete a selected row of a given table ---------------------
----------------------------------------------------------------------------------------------
-- delete a user
DELETE FROM Users WHERE user_id = :user_id_selected_from_browse_user_page

-- delete a friendship
DELETE FROM Friendships WHERE friendship_id = :friendship_id_selected_from_browse_friendship_page;

-- delete a post
DELETE FROM Posts WHERE post_id = :post_id_selected_from_browse_post_page;

-- delete a location
DELETE FROM Locations WHERE location_id = :location_id_selected_from_browse_post_page;

-- dis-associate a Post from a Friendship (M-to-M relationship deletion)
DELETE FROM Posts_has_Friendships WHERE post_id = :Post_ID_selected_from_Posts_has_Friendships_list 
AND friendship_id = :Friendship_ID_selected_from-Posts_has_Friendships_list
----------------------------------------------------------------------------------------------



-- Get all user_names to populate a dropdown list of user_names in the Update User Form.
SELECT user_name FROM Users;

-- get all User user_ids and user_names to populate the user name and friend's user name dropdown lists
SELECT user_id, user_name FROM Users

-- get all friend user name of a specific user to populate the friend's user name dropdown list
SELECT Friends.user_name AS friend_name
FROM Users user 
INNER JOIN Friendships ON user.user_id = Friendships.user_id
INNER JOIN Users friend ON Friends.user_id = Friendships.friend_user_id
WHERE user.user_id = :user_idInput;



DELETE FROM Friendships WHERE user_id = :user_id_selected_from_user_id_dropdown_list 
AND friend_user_id = :friend_user_id_selected_from_friend_user_name_dropdown_list;

-- Delete a given user based on a user_id
DELETE FROM Users WHERE user_id = :user_id_input;

SELECT Users WHERE user_id = user_id;
