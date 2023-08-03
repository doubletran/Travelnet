// Get the objects we need to modify
let updatePostForm = document.getElementById('update-post-form-ajax');

// Modify the objects we need
updatePostForm.addEventListener("submit", function (e) {
  
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    //let inputUsername = document.getElementById("input-username");
    let inputContent = document.getElementById("input-content");
    //let inputFriend = document.getElementById("input-friend");

    // Get the values from the form fields
    //let user_id = inputUsername.value;
    let inputContentValue = inputContent.value;
    //let friend_user_id = inputFriend.value;
    
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for location

    // if (isNaN(friend_user_id)) 
    // {
    //     return;
    // }
    if (isNaN(post_id)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        user: user_id,
        post: post_id,
        friend: friend_user_id
    
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
    console.log(post_id);
    let table = document.getElementById("post-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == post_id) {

            // Get the location of the row where we found the matching post ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of location value
            let td = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign location to our value we updated to

            td.innerHTML = parsedData[0].friend_user_id; 
            console.log(td.innerHTML);
       }
    }
}