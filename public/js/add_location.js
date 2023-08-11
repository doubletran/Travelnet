//Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/ 
let addLocationForm = document.getElementById('addLocation');
console.log(addLocationForm);
// Modify the objects we need
addLocationForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputAddress = document.getElementById("address");
    let inputCity = document.getElementById("city");
    let inputState = document.getElementById("state");
    let inputZipCode = document.getElementById("zip_code");
    let inputCountry = document.getElementById("country");

    // Get the values from the form fields
    let addressValue = inputAddress.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipcodeValue = inputZipCode.value;
    let countryValue = inputCountry.value;
	

    // Put our data we want to send in a javascript object
    let data = {
        address: addressValue,
        city: cityValue,
        state: stateValue,
        zipcode: zipcodeValue,
        country: countryValue
    }
    console.log(data)
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", '/add-location-ajax', true);
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
    let currentTable = document.getElementById("location-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let locationIDCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipcodeCell = document.createElement("TD");
    let countryCell = document.createElement("TD");

    // // Fill the cells with correct data
    locationIDCell.innerText = newRow.location_id;
    addressCell.innerText = newRow.address;
    cityCell.innerText = newRow.city;
    stateCell.innerHTML = newRow.state;
    zipcodeCell.innerHTML = newRow.zip_code;
    countryCell.innerHTML = newRow.country;

    // // Add the cells to the row 
    row.appendChild(locationIDCell);
    row.appendChild(addressCell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipcodeCell);
    row.appendChild(countryCell);
    
    // // Add the row to the table
    currentTable.appendChild(row);
}
