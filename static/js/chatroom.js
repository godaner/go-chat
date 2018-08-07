const NORMAL_MSG=1
const LEAVE_MSG=2
const ENTER_MSG=3


var headBgColorArr=["black","rgb(15,133,244)","green"]
var headColorArr=["white","white","white"]
var headBgColorArrLen = headBgColorArr.length;
var headColorArrLen = headColorArr.length;
var randomNum = randomNum(headBgColorArrLen>headColorArrLen?headColorArrLen:headBgColorArrLen)

var headBgColor=headBgColorArr[randomNum];
var headColor=headColorArr[randomNum];

function randomNum(max){
    return parseInt(Math.random()*max)
}

function showMsg(data) {
    if(NORMAL_MSG==data.type){

        left({
            headStr:data.name,
            str:data.context,
            headBgColor:headBgColor,
            headColor:headColor,
        });
    }else if(ENTER_MSG==data.type){
        left({
            headStr:data.name,
            str:greenMsg("系统消息 : 用户 \""+data.name+"\" 已上线 "),
            headBgColor:headBgColor,
            headColor:headColor,
        });
    }else if(LEAVE_MSG==data.type){
        left({
            headStr:data.name,
            str:redMsg("系统消息 : 用户 \""+data.name+"\" 已下线 "),
            headBgColor:headBgColor,
            headColor:headColor,
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

    //ajax
    conectWS();

})

const SUCCESS = 1;
const FAILURE = 2;
function conectWS() {
    var name = localStorage.getItem("name");
    if(name == undefined||name==""){
        location.href = "http://" + window.location.host;
        return ;
    }
    //check name
    left({
        headStr:data.name,
        str:redMsg("系统消息 : 检测中... "),
        headBgColor:headBgColor,
        headColor:headColor,
    });
    $.ajax({
        url:"http://" + window.location.host + "/checkName",
        method:"POST",
        dataType: "json",
        data:{name:name},
        success:function (data) {
            if(data.code == SUCCESS){
                left({
                    headStr:data.name,
                    str:redMsg("系统消息 : 检测中成功"),
                    headBgColor:headBgColor,
                    headColor:headColor,
                });
            }else if(data.code == FAILURE){
                location.href = "http://" + window.location.host;
            }

        }
    })



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
    var html="<div class='send'><div class='msg'><div title='"+data.headStr+"' style='background: "+data.headBgColor+";color:"+data.headColor+"'>"+data.headStr+"</div>"+
        "<p><i class='msg_input'></i>"+data.str+"</p></div></div>";
    upView(html);
}
function right(data){
    var html="<div class='show'><div class='msg'><div title='"+data.headStr+"' style='background: "+data.headBgColor+";color:"+data.headColor+"'>"+data.headStr+"</div>"+
        "<p><i class='msg_input'></i>"+data.str+"</p></div></div>";
    upView(html);
}
function upView(html){
    $('.message').append(html);
    $('body').animate({scrollTop:$('.message').outerHeight()-window.innerHeight},200)
}
