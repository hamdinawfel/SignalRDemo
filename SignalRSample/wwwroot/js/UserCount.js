// create a connection
var connectionUserCount = new signalR.HubConnectionBuilder()
    .withUrl("hubs/userCount", signalR.HttpTransportType.WebSockets)
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
connectionUserCount.start().then(fulfilled, rejected);
