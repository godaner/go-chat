$(function () {
    var headImg = imgarr[sj(imgarr.length)];
    $.ajax({
        url:"http://" + window.location.host + "/name",
        method:"GET",
        dataType: "json",
        success:function (data) {
            // Create a socket
            socket = new WebSocket('ws://' + window.location.host + '/ws?name=' + data.name);
            //title
            $(".tit").html("欢迎 "+data.name);
            // Receive msg
            socket.onmessage = function (event) {
                var data = JSON.parse(event.data);
                console.info(data)
                left(headImg,data.Name+" : "+data.Context);

            };

            // Send messages.
            var postConecnt = function () {
                var content = $('#sendbox').val();
                socket.send(content);
                $('#sendbox').val('');
            }

            //enable input ?
            $('.footer').on('keyup','input',function(){
                if($(this).val().length>0){
                    $(this).next().css('background','#114F8E').prop('disabled',true);

                }else{
                    $(this).next().css('background','#ddd').prop('disabled',false);
                }
            })
            //send
            $('#sendbtn').click(function(){
                postConecnt();
            })

        }
    })
})


/*鍙戦€佹秷鎭�*/
function left(headSrc,str){
    var html="<div class='send'><div class='msg'><img src="+headSrc+" />"+
        "<p><i class='msg_input'></i>"+str+"</p></div></div>";
    upView(html);
}
/*鎺ュ彈娑堟伅*/
function right(headSrc,str){
    var html="<div class='show'><div class='msg'><img src="+headSrc+" />"+
        "<p><i class='msg_input'></i>"+str+"</p></div></div>";
    upView(html);
}
/*鏇存柊瑙嗗浘*/
function upView(html){
    $('.message').append(html);
    $('body').animate({scrollTop:$('.message').outerHeight()-window.innerHeight},200)
}
function sj(max){
    return parseInt(Math.random()*max)
}
var imgarr=['/static/img/touxiang.png','/static/img/touxiangm.png']