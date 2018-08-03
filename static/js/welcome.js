function join() {
    var name = $("#name").val()

    $.ajax({
        url:"http://" + window.location.host + "/join",
        method:"POST",
        data:{name:name},
        success:function (data) {
            location.href = "http://" + window.location.host + "/chatroom"
        }
    })
}