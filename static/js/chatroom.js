const NORMAL_MSG=1
const LEAVE_MSG=2
const ENTER_MSG=3



function showMsg(data) {
    if(NORMAL_MSG==data.type){

        left({
            headImgUrl:headImgUrl,
            name:data.name,
            str:data.context,
        });
    }else if(ENTER_MSG==data.type){
        left({
            headImgUrl:headImgUrl,
            name:data.name,
            str:redMsg("系统消息 : 用户 \""+data.name+"\" 已上线 "),
        });
    }else if(LEAVE_MSG==data.type){
        left({
            headImgUrl:headImgUrl,
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
var headImgUrl = undefined
function check(checkSuccess) {
    var name = localStorage.getItem(KEY_OF_NAME);
    if(name == undefined||name==""){
        toHome();
        return ;
    }
    $.ajax({
        url:"http://" + window.location.host + "/headImgUrl",
        method:"GET",
        dataType: "json",
        data:{name:name},
        success:function (data) {
            if(data.code == SUCCESS){
                headImgUrl = data.data.headImgUrl;
                //check name
                left({
                    headImgUrl:headImgUrl,
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
                                headImgUrl:headImgUrl,
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


function left(data){
    var html="<div class='send'>" +
        "<div class='msg'><img src='"+data.headImgUrl+"'/>"+
        "<p>" +
        "<span style='font-size: 0.1rem;color: #0BB20C'>"+data.name+" : <span><br/>"+
        "<i class='msg_input'></i>"+
        "<span style='font-size: 0.3rem;color:black'>"+data.str+"</span>"+
        "</p>" +
        "</div>" +
        "</div>";
    upView(html);

}
function right(data){
    var html="<div class='show'><div class='msg'><img src='"+data.headImgUrl+"'/>"+
        "<p><i class='msg_input'></i>"+data.str+"</p></div></div>";
    upView(html);
}
function upView(html){
    $('.message').append(html);
    $('body').animate({scrollTop:$('.message').outerHeight()-window.innerHeight},200)
}
