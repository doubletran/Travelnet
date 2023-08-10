//Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/ 
let updatePostForm = document.getElementById('update-post-form-ajax');

// Modify the objects we need
updatePostForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();
    
    // Get form fields we need to get data from
    let inputPostID = document.getElementById("post-id");
    let inputUserID = document.getElementById("input-user");
    let inputLocation = document.getElementById("input-location");
    let inputContent = document.getElementById("input-content");
    let inputFriends = document.getElementById("input-friends");
    let inputAccess = document.getElementById("showAccess");
    
    // Get the values from the form fields
    let post_id = inputPostID.value;
    let user_id = inputUserID.value;
    let location_id = inputLocation.value;
    let content = inputContent.value;
    let access = inputAccess.value;
    
    var selected = [];
    for (var option of inputFriends.options)
    {
        if (option.selected) {
            selected.push(option.value);
        }
    }

    let friend_user_ids = selected;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for location

    // if (isNaN(friend_user_ids)) 
    // {   
    //     console.log("What?")
    //     return;
    // }
    // if (isNaN(location_id)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        post_id: post_id,
        user_id: user_id,
        location_id: location_id,
        content: content,
        access: access,
        friend_user_ids: friend_user_ids
    
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-post-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

// Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
         if (xhttp.readyState == 4 && xhttp.status == 200) {

             // Add the new data to the table
             updateRow(xhttp.response, post_id);


         }
         else if (xhttp.readyState == 4 && xhttp.status != 200) {
             console.log(error);
             console.log("There was an error with the input.")
         }
     }

     // Send the request and wait for the response
     xhttp.send(JSON.stringify(data));

 })


 function updateRow(data, post_id){
     let parsedData = JSON.parse(data);
     
     let table = document.getElementById("post-table");

     for (let i = 1, row; row = table.rows[i]; i++) {
        
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (row.getAttribute("data-value") == post_id) {
             
             // Get the location of the row where we found the matching post ID
             let updateRowIndex = table.getElementsByTagName("tr")[i];
             // Get td of location value
             let content_td = updateRowIndex.getElementsByTagName("td")[1];
             let access_td = updateRowIndex.getElementsByTagName("td")[2];
             let friends_td = updateRowIndex.getElementsByTagName("td")[4];
             let location_td = updateRowIndex.getElementsByTagName("td")[5]
             // Reassign location to our value we updated to
             content_td.innerHTML = parsedData[i-1].content;
             access_td.innerHTML = parsedData[i-1].access;
             friends_td.innerHTML = parsedData[i-1].Friends;  
             location_td.innerHTML = parsedData[i-1].Locations;

             content_td.v
        }
     }
}
