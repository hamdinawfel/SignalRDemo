// create a connection
var connection = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect([0, 1000, 500, null])
    .withUrl("/hubs/chat", signalR.HttpTransportType.WebSockets)
    .configureLogging(signalR.LogLevel.Information)
    .build();



//// create room
//let btnCreateRoom = document.getElementById("btnCreateRoom");
//btnCreateRoom.addEventListener("click", function (event) {
//    let createRoomName = document.getElementById("createRoomName").value;

//    const apiurl = '/ChatRooms/PostChatRoom';
//    const room = {
//        name: createRoomName
//    };

//    const options = {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify(room)
//    };

//    fetch(apiurl, options)
//        .then(response => response.json())
//        .then(data => {
//            console.log(data);
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });

//    createRoomName.value = ""
//    event.preventDefault();
//});

//// Get Rooms
//function GetRooms() {
//    let ddlDelRoom = document.getElementById("ddlDelRoom");
//    const apiurl = '/ChatRooms/GetChatRooms';

//    const options = {
//        method: 'GET',
//        headers: {
//            'Content-Type': 'application/json'
//        }
//    };

//    fetch(apiurl, options)
//        .then(response => response.json())
//        .then(data => {

//            ddlDelRoom.innerHTML = "";
//            data.forEach((room) => {
//                let roomOption = document.createElement("option");
//                roomOption.textContent = room.name;
//                ddlDelRoom.appendChild(roomOption);
//            });
//            console.log(data);
//        })
//        .catch(error => {
//            console.error('Error:', error);
//        });
//}



connection.on("onRoomCreated", () => {
    GetRooms();
})

let hdUserId = document.getElementById("hdUserId").value;

//connection.on("sayHiToNewJoinedUser", (userName) => {
//    if (userName) {
//        let messagesList = document.getElementById("messagesList")
//        let messageItem = document.createElement("li");
//        messageItem.textContent = `Hi ${userName}`;
//        messagesList.appendChild(messageItem);
//    }
//})

connection.on("onReceiveUserConnected", (userId, userName, isOldConnection) => {
    if (!isOldConnection) {
        addMessage(`${userName} is online`)
    }
})

connection.onclose("onReceiveUserDisConnected", (userName) => {
    addMessage(`${userName} is offline`)
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
    /*GetRooms();*/
    //connection.send("NotifyWhenRoomJoined", hdUserId);
}
function rejected() {
    console.log("Connection to Chat Hub failed");

}
connection.start().then(fulfilled, rejected);