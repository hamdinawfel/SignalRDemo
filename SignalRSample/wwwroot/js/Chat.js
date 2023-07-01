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
function getRooms() {
    let ddlDelRoom = document.getElementById("ddlDelRoom");
    let ddlSelRoom = document.getElementById("ddlSelRoom");
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

            ddlDelRoom.innerHTML = "";
            ddlSelRoom.innerHTML = "";
            data.forEach((room) => {
                let roomOption1 = document.createElement("option");
                roomOption1.value = room.id; 
                roomOption1.textContent = room.name;
                roomOption1.dataset.roomId = room.id;
                ddlDelRoom.appendChild(roomOption1);

                let roomOption2 = document.createElement("option");
                roomOption2.value = room.id;
                roomOption2.textContent = room.name;
                roomOption2.dataset.roomId = room.id;
                ddlSelRoom.appendChild(roomOption2);
            });
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


// Get On line Users
function getUsers() {
    let ddlSelUser = document.getElementById("ddlSelUser");
    const apiurl = '/ChatRooms/GetChatUser';

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    fetch(apiurl, options)
        .then(response => response.json())
        .then(data => {

            ddlSelUser.innerHTML = "";
            
            data.forEach((user) => {
                let option = document.createElement("option");
                option.value = user.id;
                option.textContent = user.userName;
                option.dataset.userName = user.userName;
                ddlSelUser.appendChild(option);
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
    let ddlDelRoom = document.getElementById("ddlDelRoom");
    let selectedOption = ddlDelRoom.options[ddlDelRoom.selectedIndex];
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
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// SEND PUBLIC MSG

let btnSendBublicMsg = document.getElementById("btnSendBublicMsg");
btnSendBublicMsg.addEventListener("click", function (event) {

   let txtPublicMessage = document.getElementById("txtPublicMessage").value;
    connection.send("SendPublicMessage", txtPublicMessage);
    txtPublicMessage.value = ""
    event.preventDefault();
});


// send private message

let sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", function (event) {


    let txtPrivateMessage = document.getElementById("txtPrivateMessage").value;

    let ddlSelUser = document.getElementById("ddlSelUser");
    let selectedOption = ddlSelUser.options[ddlSelUser.selectedIndex];
    let userName = selectedOption.dataset.userName;

    connection.send("SendPrivateMessage", txtPrivateMessage, userName);
    txtPrivateMessage.value = ""
    event.preventDefault();
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

connection.on("onSendPublicMessage", (message) => {
    addMessage(message);
})

connection.on("onSendPrivateMessage", (message) => {
    addMessage(message);
})

connection.on("onReceiveUserConnected", (userId, userName) => {
    addMessage(`${userName} has oppen a connection`)
    getUsers();
})

connection.onclose("onReceiveUserDisConnected", (userName) => {
    addMessage(`${userName} has a connection closed`)
    getUsers();
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
    getRooms();
    getUsers();
    connection.send("NotifyWhenRoomJoined", hdUserId);
}
function rejected() {
    console.log("Connection to Chat Hub failed");

}
connection.start().then(fulfilled, rejected);