// create a connection
var connectionUserCount = new signalR.HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl("/hubs/usercount", signalR.HttpTransportType.WebSockets)
    .configureLogging(signalR.LogLevel.Information)
    .build();

// connect to method that hub invokes aka receive notification from hub
connectionUserCount.on("updateTotalViews", (value) => {
    var viewsCountSpan = document.getElementById("totalViewsCounter");
    viewsCountSpan.innerText = value.toString();
});

connectionUserCount.on("updateTotalUsers", (value) => {
    var usersCountSpan = document.getElementById("totalUsersCounter");
    usersCountSpan.innerText = value.toString();
});
// invoke hub methods aka send notification to hub
function newWindowsLoadedInClient() {
    connectionUserCount.invoke("NewWindowLoaded", "Nawfel").then((value) => console.log(value));
}


// start connection
function fulfilled() {
    console.log("Connection to User Hub Successful");
    newWindowsLoadedInClient();
}
function rejected() {
    console.log("Connection to User Hub failed");

}

connectionUserCount.onclose(function (error) {
    document.body.style.backgroundColor = "red";
});

connectionUserCount.onreconnected(function (connectionId) {
    document.body.style.backgroundColor = "green";
});

connectionUserCount.onreconnecting(function (error) {
    document.body.style.backgroundColor = "orange";
});


connectionUserCount.start().then(fulfilled, rejected);
