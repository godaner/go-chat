const NORMAL_MSG=1
const LEAVE_MSG=2
const ENTER_MSG=3



function showMsg(data) {
    if(NORMAL_MSG==data.type){

        left({
            name:data.name,
            str:data.context,
        });
    }else if(ENTER_MSG==data.type){
        left({
            name:data.name,
            str:redMsg("系统消息 : 用户 \""+data.name+"\" 已上线 "),
        });
    }else if(LEAVE_MSG==data.type){
        left({
            name:data.name,
            str:redMsg("系统消息 : 用户 \""+data.name+"\" 已下线 "),
        });
    }
}
function greenMsg(originMsg){
    return colorMsg(originMsg,"green");
}
function redMsg(originMsg){
    return colorMsg(originMsg,"red");
}

function colorMsg(originMsg,color){
    return "<span style='color: "+color+"'>"+originMsg+"</span>"
}

var $sendbtn = undefined;
var $sendbox = undefined;
$(function () {

    //$
    $sendbtn = $("#sendbtn");
    $sendbox = $("#sendbox");

    check(conectWS)


});
function check(checkSuccess) {
    var name = localStorage.getItem(KEY_OF_NAME);
    if(name == undefined||name==""){
        toHome();
        return ;
    }

    //check name
    left({
        name:name,
        str:redMsg("系统消息 : 上网状态检测中... "),
    });
    $.ajax({
        url:"http://" + window.location.host + "/check",
        method:"POST",
        dataType: "json",
        data:{name:name},
        success:function (data) {
            if(data.code == SUCCESS){
                left({
                    headImgUrl:gravatar(name),
                    name:name,
                    str:redMsg("系统消息 : 检测成功"),
                });
                checkSuccess(name);
            }else if(data.code == FAILURE){
                toHome();
                return;
            }

        }
    })


}

function conectWS(name) {
    // Create a socket
    socket = new WebSocket('ws://' + window.location.host + '/ws?name=' + name);
    //title
    $(".tit").html("欢迎 : "+name);
    // Receive msg
    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        console.info(data);
        showMsg(data);

    };
    //close
    socket.onclose = function (event) {
        localStorage.removeItem(KEY_OF_NAME);
        toHome();

    };

    // Send messages.
    var postConecnt = function () {
        if(enbaleSend == false){
            return ;
        }
        var content = $('#sendbox').val();
        socket.send(content);
        enableSendBtn(false);
        $('#sendbox').focus();
        $('#sendbox').val('');
    }

    //enable input ?
    $sendbox.keyup(function(event){
        enableSendBtn($(this).val().length>0)

        if(event.keyCode == 13)
        {
            postConecnt();
        }

    })
    //send
    $('#sendbtn').click(function(){

        postConecnt();
    })

}


var enbaleSend = false;

function enableSendBtn(enable){
    enbaleSend = enable;
    $sendbtn.css('background',enbaleSend?'#114F8E':'#ddd').prop('disabled',!enbaleSend);
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
function left(data){
    var id=uuid()
    var html="<div id='"+id+"' class='send'>" +
        "<div class='msg'><img src='"+gravatar(data.name)+"'/>"+
        "<p>" +
        "<span style='font-size: 0.25rem;color: #0BB20C'>"+data.name+" : <span><br/>"+
        "<i class='msg_input'></i>"+
        "<span style='font-size: 0.35rem;color:black'>"+data.str+"</span>"+
        "</p>" +
        "</div>" +
        "</div>";
    upView(html,id);

}

function upView(html,id){
    $('.message').append(html);

    $("html,body").animate({scrollTop: $("div#"+id).offset().top}, 500);
    // var scrollHeight = $('.message').prop("scrollHeight");
    // $('.message').animate({scrollTop:scrollHeight}, 100);

}
