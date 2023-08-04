// Get the objects we need to modify

let addPostForm = document.getElementById('addPost');

// Modify the objects we need
addPostForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUserID = document.getElementById("userID");
    let inputFriendList = document.getElementById("friendList");
    let inputContent = document.getElementById("content");
	let inputAccess = document.getElementById('access');
    let inputLocation = document.getElementById("location");

    // Get the multiple select values from the friendList dropdown
    var selected = [];
    for (var option of inputFriendList.options)
    {
        if (option.selected) {
            selected.push(option.value);
        }
    }
    // Get the values from the form fields
    let userIDValue = inputUserID.value;
    let friendListValue = selected;
    let contentValue = inputContent.value;
	let accessValue = inputAccess.value;
    let locationValue = inputLocation.value;

    // Put our data we want to send in a javascript object
    let data = {
        userID: userIDValue,
        friendList: friendListValue,
        content: contentValue,
		access: accessValue,
        location: locationValue
    }

    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/posts-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUserID.value = '';
            inputFriendList.value = '';
            inputContent.value = '';
            inputLocation.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("post-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let postIDCell = document.createElement("TD");
    let contentCell = document.createElement("TD");
    let accessCell = document.createElement("TD");
    let userNameCell = document.createElement("TD");
    let friendsMentionedCell = document.createElement("TD");
    let locationsPinnedCell = document.createElement("TD");

    // // Fill the cells with correct data
    postIDCell.innerText = newRow.post_id;
    contentCell.innerText = newRow.Content;
    accessCell.innerText = newRow.Access;
    userNameCell.innerText = newRow.user_name;
    friendsMentionedCell.innerText = newRow.FriendsMentioned;
    locationsPinnedCell.innerHTML = newRow.LocationsPinned;

    // // Add the cells to the row 
    row.appendChild(postIDCell);
    row.appendChild(contentCell);
    row.appendChild(accessCell);
    row.appendChild(userNameCell);
    row.appendChild(friendsMentionedCell);
    row.appendChild(locationsPinnedCell);
    
    // // Add the row to the table
    currentTable.appendChild(row);
}