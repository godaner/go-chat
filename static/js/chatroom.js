$(function () {

    $.ajax({
        url:"http://" + window.location.host + "/name",
        method:"GET",
        dataType: "json",
        success:function (data) {
            // Create a socket
            socket = new WebSocket('ws://' + window.location.host + '/ws?name=' + data.name);
            $("#name").html(data.name);
            // Message received on the socket
            socket.onmessage = function (event) {
                var data = JSON.parse(event.data);
                console.info(data)
                $("#display").append("<div>"+data.Name+" : "+data.Context+"</div>");

            };

            // Send messages.
            var postConecnt = function () {
                var content = $('#sendbox').val();
                socket.send(content);
                $('#sendbox').val('');
            }

            $('#sendbtn').click(function () {
                postConecnt();
            });
        }
    })
})