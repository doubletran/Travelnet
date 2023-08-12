//Citation Scope: Node.js and database connection set up on flip and each CRUD operation. 
//Date: 08/12/2023
//Originality: Adapted
//Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/ 
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
    let editCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");
    console.log(newRow.FriendsMentioned)
    // // Fill the cells with correct data
    postIDCell.innerText = newRow.post_id;
    contentCell.innerText = newRow.Content;
    accessCell.innerText = newRow.Access;
    userNameCell.innerText = newRow.user_name;
    friendsMentionedCell.innerText = newRow.FriendsMentioned;
    locationsPinnedCell.innerHTML = newRow.LocationsPinned;
    
    let editA = document.createElement("a");
    editA.innerHTML = "Edit";
    //editA.setAttribute("onclick","updateItem(newRow.post_id); renderPosts('{{this.[Post ID]}}'); renderFriendsUpdate('{{this.[User Name]}}')");
    editA.addEventListener("click", () => {updateItem(newRow.post_id); renderPosts(newRow.post_id); renderFriendsUpdate(newRow.user_name, newRow.post_id)});
    editA.href = "#";
    editCell.appendChild(editA);

    let deleteA = document.createElement("a");
    deleteA.innerHTML = "Delete";
    deleteA.onclick = "deletePost('{{this.[Post ID]}}')";
    deleteA.href = "#";
    deleteCell.appendChild(deleteA);

    // // Add the cells to the row 
    row.appendChild(postIDCell);
    row.appendChild(contentCell);
    row.appendChild(accessCell);
    row.appendChild(userNameCell);
    row.appendChild(friendsMentionedCell);
    row.appendChild(locationsPinnedCell);
    row.appendChild(editCell);
    row.appendChild(deleteCell);
    row.setAttribute('data-value', newRow.post_id);
    // // Add the row to the table
    document.getElementById("post-table-body").appendChild(row);

    // let newContent = document.getElementById("input-content");
    // let txt = document.createElement("textarea");
    // txt.text = newRow.content;
    // txt.value = newRow.content;
    // newContent.add(txt);
}
