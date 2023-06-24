
// create a connection
var connectionNotification = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notification", signalR.HttpTransportType.WebSockets)
    .configureLogging(signalR.LogLevel.Information)
    .build();

let notificationInput = document.getElementById("notificationInput")
let sendButton = document.getElementById("sendButton")
let notificationCounterSpan = document.getElementById("notificationCounter")

sendButton.addEventListener("click", function (event) {
    event.preventDefault();
    connectionNotification.send("SendNotification", notificationInput.value);
    notificationInput.value = ""

});

let messageList = document.getElementById("messageList")
connectionNotification.on("onSubmitNotification", (messages, count) => {
    notificationCounterSpan.innerText = count;
    messageList.innerHTML = "";
    messages.forEach((message) => {
        let listItem = document.createElement("li");
        listItem.textContent = message;
        messageList.appendChild(listItem);
    });
})

// start connection
function fulfilled() {
    console.log("Connection to NotificationHub Successful");
}

function rejected() {
    console.log("Connection to NotificationHub failed");

}
connectionNotification.start().then(fulfilled, rejected);