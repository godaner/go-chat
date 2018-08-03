$(function () {

    $.ajax({
        url:"http://" + window.location.host + "/name",
        method:"GET",
        success:function (data) {
            // Create a socket
            socket = new WebSocket('ws://' + window.location.host + '/ws/join?name=' + data.name);
            // Message received on the socket
            socket.onmessage = function (event) {
                var data = JSON.parse(event.data);
                var li = document.createElement('li');

            };

            // Send messages.
            var postConecnt = function () {

            }
        }
    })
})