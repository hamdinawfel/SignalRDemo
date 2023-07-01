// create a connection
var connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 500, null])
    .withUrl("/hubs/chat", signalR.HttpTransportType.WebSockets)
    .configureLogging(signalR.LogLevel.Information)
    .build();



// create room
let btnCreateRoom = document.getElementById("btnCreateRoom");
btnCreateRoom.addEventListener("click", function (event) {
    let createRoomName = document.getElementById("createRoomName").value;

    const apiurl = '/ChatRooms/PostChatRoom';
    const room = {
        name: createRoomName
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
    };

    fetch(apiurl, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    createRoomName.value = ""
    event.preventDefault();
});

// Get Rooms
function GetRooms() {
    let ddlSelRoom = document.getElementById("ddlSelRoom");
    let ddlDelRoom = document.getElementById("ddlDelRoom");
    const apiurl = '/ChatRooms/GetChatRooms';

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(apiurl, options)
        .then(response => response.json())
        .then(data => {

            ddlSelRoom.innerHTML = "";
            ddlDelRoom.innerHTML = "";
            data.forEach((room) => {
                let roomOption = document.createElement("option");
                roomOption.value = room.id; // Set the value attribute to the room id
                roomOption.textContent = room.name;
                roomOption.dataset.roomId = room.id;
                ddlSelRoom.appendChild(roomOption);
                ddlDelRoom.appendChild(roomOption);
            });
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Delete Room
let btnDeleteRoom = document.getElementById("btnDeleteRoom");
btnDeleteRoom.addEventListener("click", function (event) {
    let ddlSelRoom = document.getElementById("ddlDelRoom");
    let selectedOption = ddlSelRoom.options[ddlSelRoom.selectedIndex];
    let roomId = selectedOption.dataset.roomId;

    const apiurl = `/ChatRooms/DeleteChatRoom/${roomId}`;

    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(apiurl, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            GetRooms();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});



connection.on("onRoomUpdated", () => {
    GetRooms();
})

let hdUserId = document.getElementById("hdUserId").value;

connection.on("sayHiToNewJoinedUser", (userName) => {
    if (userName) {
        let messagesList = document.getElementById("messagesList")
        let messageItem = document.createElement("li");
        messageItem.textContent = `Hi ${userName}`;
        messagesList.appendChild(messageItem);
    }
})

connection.on("onReceiveUserConnected", (userId, userName) => {
    addMessage(`${userName} has oppen a connection`)
})

connection.onclose("onReceiveUserDisConnected", (userName) => {
    addMessage(`${userName} has a connection closed`)
})

function addMessage(msg) {
    if (!msg) {
        return
    }

    let messagesList = document.getElementById("messagesList")
    let messageItem = document.createElement("li");
    messageItem.textContent = msg;
    messagesList.appendChild(messageItem);
}

// start connection SendEmail
function fulfilled() {
    console.log("Connection to Chat Hub Successful");
    GetRooms();
    connection.send("NotifyWhenRoomJoined", hdUserId);
}
function rejected() {
    console.log("Connection to Chat Hub failed");

}
connection.start().then(fulfilled, rejected);