
// create connection
var connectionHouse = new signalR.HubConnectionBuilder()
    .withUrl("hubs/houseGroupHub", signalR.HttpTransportType.WebSockets)
    .build();

var subscribedListUi = document.getElementById("lbl_houseJoined")
var subscribedList = [];

var gryffindorSubsBtn = document.getElementById("btn_gryffindor")
var gryffindorUnSubsBtn = document.getElementById("btn_un_gryffindor")

gryffindorSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("JoineHouse", "Gryffindor");
});

gryffindorUnSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("LeaveHouse", "Gryffindor");
});

var slytherinSubsBtn = document.getElementById("btn_slytherin")
var slytherinUnSubsBtn = document.getElementById("btn_un_slytherin")

slytherinSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("JoineHouse", "Slytherin");
});

slytherinUnSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("LeaveHouse", "Slytherin");
});

var hufflepuffSubsBtn = document.getElementById("btn_hufflepuff")
var hufflepuffUnSubsBtn = document.getElementById("btn_un_hufflepuff")

hufflepuffSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("JoineHouse", "Hufflepuff");      
});

hufflepuffUnSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("LeaveHouse", "Hufflepuff");
});


var ravenclawSubsBtn = document.getElementById("btn_ravenclaw")
var ravenclawUnSubsBtn = document.getElementById("btn_un_ravenclaw")

ravenclawSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("JoineHouse", "Ravenclaw");
});

ravenclawUnSubsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("LeaveHouse", "Ravenclaw");
});

function updateSubscribedListUi() {
    const joinedList = subscribedList.join(",");
    subscribedListUi.innerText = joinedList;
}

connectionHouse.on("onSubscribe", (houseName) => {
    subscribedList.push(houseName);
    toastr.success('You are successfully subscribed to ' + houseName);
    
    switch (houseName) {
        case 'Gryffindor':
            gryffindorSubsBtn.style.display = "none";
            gryffindorUnSubsBtn.style.display = "block";
            break;

        case 'Slytherin':
            slytherinSubsBtn.style.display = "none";
            slytherinUnSubsBtn.style.display = "block";
            break;

        case 'Hufflepuff':
            hufflepuffSubsBtn.style.display = "none";
            hufflepuffUnSubsBtn.style.display = "block";
            break;

        case 'Ravenclaw':
            ravenclawSubsBtn.style.display = "none";
            ravenclawUnSubsBtn.style.display = "block";
            break;

        default:
            break;
    }

    updateSubscribedListUi();
});


connectionHouse.on("onUnsubscribe", (houseName) => {
    subscribedList.splice(subscribedList.indexOf(houseName), 1);
    toastr.success('You are successfully unsubscribed from ' + houseName);

    switch (houseName) {
        case 'Gryffindor':
            gryffindorSubsBtn.style.display = "block";
            gryffindorUnSubsBtn.style.display = "none";
            break;

        case 'Slytherin':
            slytherinSubsBtn.style.display = "block";
            slytherinUnSubsBtn.style.display = "none";
            break;

        case 'Hufflepuff':
            hufflepuffSubsBtn.style.display = "block";
            hufflepuffUnSubsBtn.style.display = "none";
            break;

        case 'Ravenclaw':
            ravenclawSubsBtn.style.display = "block";
            ravenclawUnSubsBtn.style.display = "none";
            break;

        default:
            break;
    }

    updateSubscribedListUi();
});

connectionHouse.on("newMemberAddedInHouse", (houseName) => {
    toastr.success('Member has subscrbed to :' + houseName);
    console.log("test")
})

connectionHouse.on("memberRemovedFromHouse", (houseName) => {
    toastr.warning('Member has unsubscrbed from :' + houseName);
})

let trigger_gryffindor = document.getElementById("trigger_gryffindor");
let trigger_slytherin = document.getElementById("trigger_slytherin");
let trigger_hufflepuff = document.getElementById("trigger_hufflepuff");
let trigger_ravenclaw = document.getElementById("trigger_ravenclaw");


trigger_gryffindor.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("TriggerNotification", "Gryffindor");
});
trigger_slytherin.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("TriggerNotification", "Slytherin");
});
trigger_hufflepuff.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("TriggerNotification", "Hufflepuff");
});
trigger_ravenclaw.addEventListener("click", function (event) {
    event.preventDefault();
    connectionHouse.send("TriggerNotification", "Ravenclaw");
});

connectionHouse.on("onTriggerNotification", (houseName) => {
    toastr.success('a new Member has subscrbed to :' + houseName);
})
// start connection
function fulfilled() {
    console.log("Connection to HouseGroupHub Successful");
}

function rejected() {
    console.log("Connection to HouseGroupHub failed");

}
connectionHouse.start().then(fulfilled, rejected);