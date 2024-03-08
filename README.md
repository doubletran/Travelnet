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


<h2>Executive Summary</h2>
The project is built upon an idea of the useful database management system with the aim of managing the complexity of social media applications. There are four entities: Users, Friendships, Locations, and Posts. In summary, these are the important changes we made for the project. 
<h3>Normalization</h3>
We initially implemented an M:M relationship between Users and Friends. However, there are multiple feedbacks surrounding the vagueness of that relationship, since Friends can be Users. We replaced the Friends entity with the Friendships entity to represent the relationship better based on feedback from step 1. We also replaced that relationship with two 1: M relationships between Users and Friendships since a Friendship represent a tie between two Users.
<h3>Clarity</h3>
The most significant change we made was to remove some redundant M: M relationships. Based on feedback from step 2 and 3, three M: M relationships – an M:M relationship between Users and Friends, an M:M relationship between Posts and Locations, and an M:M relationship between Locations and Users – were removed and replaced with 1: M relationships. The only M:M relationship we kept was between Posts and Friendships. These efforts significantly clarify our schema, so that it contains the most essential data we want to keep track of. 
<h3>Dynamic</h3>
The reviewer reminded us that we needed to dynamically show mutural_friend_ct attribute of Friendships from step 3. To achieve that, we implemented a function to calculate it automatically so data shown in the Friendships table are up-to-date whenever a new friendship is added. 
<h3>User-friendly design</h3>
We replaced any foreign key ID values with actual text such as location’s address, users’ username, friends’ username to incorporate user-friendly functionality for the website based on TA’s feedback. We also capitalize the attribute’s headers in every table.
<h2>Overview</h2>
Travelnet is a social media application that connects more than a hundred million users worldwide through their travelling experience. Anyone can register to become a user by providing their email and setting their password. On Travelnet, a user can add other users as friends to get updated about each other’s latest activities. A Friends table records their relationship timeline, messages, interactions, etc. A user can also post unlimited number of posts about a travelling experience in a text box. For each post, a user can optionally choose to pin one or more associated locations, and can optionally mention one or more of his/her friends. Besides their friends’ and their own activities, a user can explore millions of public posts on their interested locations. Travelnet needs a database driven backend that will manage and record Users’ profiles, their Posts, their Friends and Locations pinned in Posts to facilitate the aforementioned features.


<h2>Entity-relationship Diagram</h2>

<img width="324" alt="image" src="https://github.com/doubletran/Travelnet/assets/87690366/878ec24e-319e-4047-92dc-2935224db8d5">



//Citation Scope: Node.js and database connection set up on flip and each CRUD operation. 
//Date: 08/12/2023
//Originality: Adapted
//Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/ 

##Demo



https://github.com/Tongxin-Sun/group18-cs340-project/assets/37636358/1c51f861-ddbc-4a09-ac0c-d3aa53ae9292




