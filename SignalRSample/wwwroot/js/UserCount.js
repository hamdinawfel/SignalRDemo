// create a connection
var connectioUserCount = new signalR.HubConnectionBuilder().withUrl("hubs/userCount").build();

// connect to method that hub invokes aka receive notification from hub
connectioUserCount.on("updateTotalViews", (value) => {
    var viewsCountSpan = document.getElementById("totalViewsCounter");
    viewsCountSpan.innerText = value.toString();
});

connectioUserCount.on("updateTotalUsers", (value) => {
    var usersCountSpan = document.getElementById("totalUsersCounter");
    usersCountSpan.innerText = value.toString();
});
// invoke hub methods aka send notification to hub
function newWindowsLoadedInClient() {
   connectioUserCount.send("NewWindowLoaded");
}


// start connection
function fulfilled() {
    console.log("Connection to User Hub Successful");
    newWindowsLoadedInClient();
}
function rejected() {
    console.log("Connection to User Hub failed");

}
connectioUserCount.start().then(fulfilled, rejected);
