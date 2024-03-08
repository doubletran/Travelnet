# group18-cs340-project
Getting a stable version of node to run without the weird errors:
```bash
nvm install v16.15.0

nvm use v16.15.0
```
CS340 Project Step 5 Portfolio Project


TravelNet 
Traveling Social Media 
Database Management System
Team Members: 
Tongxin Sun        Tran Tran
URL: http://flip3.engr.oregonstate.edu:8018/ 


Executive Summary
The project is built upon an idea of the useful database management system with the aim of managing the complexity of social media applications. There are four entities: Users, Friendships, Locations, and Posts. In summary, these are the important changes we made for the project. 
Normalization
We initially implemented an M:M relationship between Users and Friends. However, there are multiple feedbacks surrounding the vagueness of that relationship, since Friends can be Users. We replaced the Friends entity with the Friendships entity to represent the relationship better based on feedback from step 1. We also replaced that relationship with two 1: M relationships between Users and Friendships since a Friendship represent a tie between two Users.
Clarity
The most significant change we made was to remove some redundant M: M relationships. Based on feedback from step 2 and 3, three M: M relationships – an M:M relationship between Users and Friends, an M:M relationship between Posts and Locations, and an M:M relationship between Locations and Users – were removed and replaced with 1: M relationships. The only M:M relationship we kept was between Posts and Friendships. These efforts significantly clarify our schema, so that it contains the most essential data we want to keep track of. 
Dynamic
The reviewer reminded us that we needed to dynamically show mutural_friend_ct attribute of Friendships from step 3. To achieve that, we implemented a function to calculate it automatically so data shown in the Friendships table are up-to-date whenever a new friendship is added. 
User-friendly design
We replaced any foreign key ID values with actual text such as location’s address, users’ username, friends’ username to incorporate user-friendly functionality for the website based on TA’s feedback. We also capitalize the attribute’s headers in every table.
Overview
Travelnet is a social media application that connects more than a hundred million users worldwide through their travelling experience. Anyone can register to become a user by providing their email and setting their password. On Travelnet, a user can add other users as friends to get updated about each other’s latest activities. A Friends table records their relationship timeline, messages, interactions, etc. A user can also post unlimited number of posts about a travelling experience in a text box. For each post, a user can optionally choose to pin one or more associated locations, and can optionally mention one or more of his/her friends. Besides their friends’ and their own activities, a user can explore millions of public posts on their interested locations. Travelnet needs a database driven backend that will manage and record Users’ profiles, their Posts, their Friends and Locations pinned in Posts to facilitate the aforementioned features.
Database Outline:
Users: records the details of Users of the app
user_id: int, auto_increment, unique, not NULL, PK
email: varchar(255), unique, not NULL  
user_name: varchar(45), unique, not NULL
password: varchar(45), not NULL         
Relationship: 
An 1: M relationship with Friendships is implemented with user_id as an FK in Friendships.
An 1: M relationship with Friendships is implemented with friend_user_id as an FK in Friendships.
A 1: M relationship with Posts is implemented with user_id as a FK inside of Posts.
Locations: records the details of a Location
location_id: int, auto_increment, unique, not NULL, PK
address: varchar(255), not NULL
city: varchar(255), not NULL
state: varchar(255), not NULL         
zip_code: varchar(45), not NULL  
country: varchar(255), not NULL
Relationship: 
An 1: M relationship with Posts is implemented with location_id as a FK inside of Posts.
Posts: records the details of a Post made by a User
post_id: int, auto_increment, unique, not NULL, PK
content: mediumtext, not NULL 
access: enum ('Public', 'Public to friends', 'Private'), not NULL    
user_id: int, not NULL, FK   
location_id: int, FK    
Relationship: 
An M:1 relationship with Users is implemented with user_id as a FK inside of Posts. 
An 1: M relationship between Posts and Locations is implemented where location_id is FK inside of Posts.
An M:M relationship with Friends is implemented with post_id and friend_id as FKs in the intersection table Posts_has_Friends.
Friendships: records the friendship between two Users
friendship_id: int, auto_increment, unique, not NULL, PK
start_date: date, not NULL
mutual_friend_ct: int, not NULL
user_id: int, not NULL, FK
friend_user_id: int, not NULL, FK
Relationship: 
An M:1 relationship between Friendships and Users is implemented with user_id as a FK in Friendships.   
An M:1 relationship between Friendships and Users is implemented with friend_user_id as a FK in Friendships.  
An M:M relationship with Posts is implemented with post_id and friendship_id as FKs in the intersection table Posts_has_Friendship.            
Posts_has_Friendships: records each time a User is mentioned by another User in a Post
Posts_friendships_id: int, auto_increment, unique, not NULL, PK
post_id: int, not NULL, FK
friendship_id: int, not NULL, FK


Entity-relationship Diagram










Schema














Sample Data
Users:

Posts:

Friendships:

Locations:

Posts_has_Friendships:


UI Screen Shots
Home Page: Provides links and descriptions to each of the entity.







Users: Contains information about each active user with User ID, User Name, Email and Password.
DISPLAY all current users 
INSERT a new user by filling all the required fields

Friendships: Contains data about all active friendships between users with their usernames, the starting date, a dynamic number of mutual friends they have with each other.
DISPLAY Friendships entity with all the aforementioned details.
INSERT a new Friendship between any two current users - dynamic dropdown functionality for Username is implemented in this step to show the username of all active users from Users entity. For example, after the user selects from User 1 Name dropdown, User 2 Name dropdown will render. If User 1 Name: mary563 and User 2 Name: toub8294 has already been added, one can not add User 1 Name: toub8294 and User 2 Name: mary563. They are regarded as duplicates. 





Locations: Contains information about popular locations including ID, Address Line, City, State, Zip Code, Country.
DISPLAY stored locations with relevant information
INSERT a new location by filling all the required fields



Posts: Contains information about all posts created by users including ID, post’s content, access (Public, Public to Friends, Private), the poster’s username, their friends mentioned in that post along with the location if any.
DISPLAY all posts with relevant information
INSERT new post made by an existing user. Two dynamic drop down lists for Users and Friendships are implemented here to incorporate user-friendly functionalities for our website. Once a user is selected, all their friends’ usernames are rendered to be selected. This new post can have no location pinned (NULLable). If any friends are selected from the Friends Mentioned dropdown, the Posts_has_Friendships table will also add the corresponding rows. 
UPDATE an existing post also update the M:N relationship between Posts and Friendships if there are any changes to friends mentioned in the posts. Relationships between Posts and Friendships and between Posts and Locations are nullable meaning a user can opt for removing the linked location as well as friends mentioned in the post.
DELETE an existing post also delete an M:N relationship between Posts and Friendships tied to the deleted post. 

Clicking the “Edit” button from any row will render the update form as shown below. Post ID and User Name are not editable. If you don’t make any change, the data will not be changed. 

Posts_has_Friendships (intersection table): Contains information tied to an M:N relationship between Posts and Friendships including post content, username of the one who posts it and one friend mentioned in that post. Therefore, any times a friend is mentioned in the post contribute to one record of this table. 



//Citation Scope: Node.js and database connection set up on flip and each CRUD operation. 
//Date: 08/12/2023
//Originality: Adapted
//Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/ 

##Demo



https://github.com/Tongxin-Sun/group18-cs340-project/assets/37636358/1c51f861-ddbc-4a09-ac0c-d3aa53ae9292




