// create a connection
var connectionNotification = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/order", signalR.HttpTransportType.WebSockets)
    .configureLogging(signalR.LogLevel.Information)
    .build();


var dataTable;
$(document).ready(function () {
    loadDataTable();
});

function loadDataTable() {

    dataTable = $('#tblData').DataTable({
        "ajax": {
            "url": "/Home/GetAllOrder"
        },
        "columns": [
            { "data": "id", "width": "5%" },
            { "data": "name", "width": "15%" },
            { "data": "itemName", "width": "15%" },
            { "data": "count", "width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="w-75 btn-group" role="group">
                        <a href=""
                        class="btn btn-primary mx-2"> <i class="bi bi-pencil-square"></i> </a>
                      
					</div>
                        `
                },
                "width": "5%"
            }
        ]
    });
}


// start connection
function fulfilled() {
    console.log("Connection to Order Hub Successful");
}

function rejected() {
    console.log("Connection to Order Hub failed");

}
connectionNotification.start().then(fulfilled, rejected);