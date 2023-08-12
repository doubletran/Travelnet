//Citation Scope: Node.js and database connection set up on flip and each CRUD operation. 
//Date: 08/12/2023
//Originality: Adapted
//Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/ 
let addUserForm = document.getElementById('addUser');

// Modify the objects we need
addUserForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUsername = document.getElementById("userName");
    let inputEmail = document.getElementById("email");
    let inputPassword = document.getElementById("password");

    // Get the values from the form fields
    let usernameValue = inputUsername.value;
    let emailValue = inputEmail.value;
    let passwordValue = inputPassword.value;
	

    // Put our data we want to send in a javascript object
    let data = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,

    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/add-user-ajax', true);
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
    let currentTable = document.getElementById("user-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    console.log(newRow);
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let userIDCell = document.createElement("TD");
    let usernameCell = document.createElement("TD");
    let passwordCell = document.createElement("TD");
    let emailCell = document.createElement("TD");

    // // Fill the cells with correct data
    userIDCell.innerText = newRow.user_id;
    usernameCell.innerText = newRow.user_name;
    passwordCell.innerText = newRow.password;
    emailCell.innerHTML = newRow.email;

    // // Add the cells to the row 
    row.appendChild(userIDCell);
    row.appendChild(usernameCell);
    row.appendChild(emailCell);
    row.appendChild(passwordCell);
    
    // // Add the row to the table
    currentTable.appendChild(row);
}
