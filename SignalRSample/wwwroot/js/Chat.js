// create a connection
var connectionChat = new signalR.HubConnectionBuilder()
    .withUrl("hubs/chatHub", signalR.HttpTransportType.WebSockets)
    .configureLogging(signalR.LogLevel.Information)
    .build();

let chatMessageInput = document.getElementById("chatMessage");
let sendMessageBtn = document.getElementById("sendMessage");


sendMessageBtn.disable = true;

let messagesList = document.getElementById("messagesList");

sendMessageBtn.addEventListener("click", function (event) {
    let message = chatMessageInput.value
    let sender = document.getElementById("senderEmail").value;
    let receiver = document.getElementById("receiverEmail").value;

    //connectionChat.send("SendPublicMessage", sender, message)

    if (receiver.length > 0 ) {
        console.log("receiver", receiver);
        console.log("sender", sender);

        connectionChat.send("SendPrivateMessage", sender, receiver, message)
    }else{
        connectionChat.send("SendPublicMessage", sender, message)
        console.log("public", receiver);

    }
    chatMessageInput.value = ""
    event.preventDefault();

});


connectionChat.on("onMessageRecieved", (sender, message) => {
    messageList.innerHTML = "";
    let listItem = document.createElement("li");
    listItem.textContent = `${sender} - ${message}`;
    messagesList.appendChild(listItem);
    console.log(`${sender} - ${message}`)
})

// start connection SendEmail
function fulfilled() {
    console.log("Connection to Chat Hub Successful");
    sendMessageBtn.disable = false
}
function rejected() {
    console.log("Connection to Chat Hub failed");

}
connectionChat.start().then(fulfilled, rejected);
