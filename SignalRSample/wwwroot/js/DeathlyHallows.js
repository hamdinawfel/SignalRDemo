﻿var cloakCounterSpan = document.getElementById("cloakCounter");
var stoneCounterSpan = document.getElementById("stoneCounter");
var wandCounterSpan = document.getElementById("wandCounter");

// create connection
var connectionDeathlyHallows = new signalR.HubConnectionBuilder()
    .withUrl("hubs/DeathlyHallows", signalR.HttpTransportType.WebSockets)
    .build();

// Method to be called from the controller
connectionDeathlyHallows.on("updateDeathlyHallowsCount", (cloak, stone, wand) => {
    cloakCounterSpan.innerText = cloak.toString();
    stoneCounterSpan.innerText = stone.toString();
    wandCounterSpan.innerText = wand.toString();
});

// start connection
function fulfilled() {
    console.log("Connection to DeathlyHallowsHub Successful");
    connectionDeathlyHallows.invoke("GetDeathlyHallowsStatus").then((raceCount) => { 
        cloakCounterSpan.innerText = raceCount.cloak.toString();
        stoneCounterSpan.innerText = raceCount.stone.toString();
        wandCounterSpan.innerText = raceCount.wand.toString();
    }
)}

function rejected() {
    console.log("Connection to DeathlyHallowsHub failed");

}
connectionDeathlyHallows.start().then(fulfilled, rejected);