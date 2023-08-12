function renderFriendsUpdate(userName, pid) {
    let current_friends;
    document.getElementById('input-friends').innerHTML = '<option value="">--Please select--</option>';
    for (let i = 1, row; row = document.getElementById("post-table").rows[i]; i++) {
      if (row.getAttribute("data-value") == pid) {
        current_friends = row.getElementsByTagName("td")[4].textContent.split(", ");
      }
    }
    {{#each friendships}}
    if ('{{this.[User]}}' == userName) {
        const newOption = document.createElement("option");
        newOption.innerHTML = '{{this.[Friend]}}';
        newOption.value = {{this.[FriendID]}};
        if (current_friends.includes('{{this.[Friend]}}')) {
          newOption.setAttribute("selected", true)
        }
        document.getElementById('input-friends').appendChild(newOption)
    }
    {{/each}}
}