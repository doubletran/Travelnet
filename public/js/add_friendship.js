//Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/ 
let addFriendshipForm = document.getElementById('addFriendship');

// Modify the objects we need
addFriendshipForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let user1Value= document.getElementById("username1").value;
    let user2Value = document.getElementById("username2").value;
    let startDateValue = document.getElementById("start_date").value;
    console.log(startDateValue);


	

    // Put our data we want to send in a javascript object
    let data = {
        user_id: user1Value,
        friend_user_id: user2Value,
        start_date : startDateValue

    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/add-friendship-ajax', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            // inputUserID.value = '';
            // inputFriendList.value = '';
            // inputContent.value = '';
            // inputLocation.value = '';
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
    let currentTable = document.getElementById("friendship-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log(newRow);
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let friendshipIDCell = document.createElement("TD");
    let startDateCell = document.createElement("TD");
    let mutualFriendCtCell = document.createElement("TD");
    let username1Cell = document.createElement("TD");
    let username2Cell = document.createElement("TD");

    // // Fill the cells with correct data
    friendshipIDCell.innerText = newRow["Friendship ID"];
    startDateCell.innerText = newRow["Start Date"];
    mutualFriendCtCell.innerText = newRow['Mutual Friends Count'];
    username1Cell.innerHTML = newRow[ 'User 1 Name'];
    username2Cell.innerHTML = newRow['User 2 Name'];

    // // Add the cells to the row 
    row.appendChild(friendshipIDCell);
    row.appendChild(startDateCell);
    row.appendChild(mutualFriendCtCell);
    row.appendChild(username1Cell);
    row.appendChild(username2Cell);
    
    // // Add the row to the table
    currentTable.appendChild(row);
}
