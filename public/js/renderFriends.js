function renderFriends(userID) {
    document.getElementById('friendList').innerHTML = '<option value="" selected>--Please select--</option>';
    let i = 0;
    {{#each friendships}}
    if ({{this.[UserID]}} == userID) {
        const newOption = document.createElement("option");
        newOption.innerHTML = '{{this.[Friend]}}';
        newOption.value = {{this.[FriendID]}};
        document.getElementById('friendList').appendChild(newOption)
    }
    {{/each}}
};