﻿// create a connection
var connectionChat = new signalR.HubConnectionBuilder()
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
            
            ddlDelRoom.innerHTML = "";
            data.forEach((room) => {
               let roomOption = document.createElement("option");
                roomOption.textContent = room.name;
                ddlDelRoom.appendChild(roomOption);
            });
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



connectionChat.on("onRoomCreated", () => {
    GetRooms();
})


// start connection SendEmail
function fulfilled() {
    console.log("Connection to Chat Hub Successful");
    GetRooms();
}
function rejected() {
    console.log("Connection to Chat Hub failed");

}
connectionChat.start().then(fulfilled, rejected);