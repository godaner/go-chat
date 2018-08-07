
$(function () {
    var $fullText = $('.admin-fullText');
    $('#admin-fullscreen').on('click', function() {
        $.AMUI.fullscreen.toggle();
    });

    $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function() {
        $fullText.text($.AMUI.fullscreen.isFullscreen ? '閫€鍑哄叏灞�' : '寮€鍚叏灞�');
    });


    var getWindowHeight = $(window).height(),
        myappLoginBg    = $('.myapp-login-bg');
    myappLoginBg.css('min-height',getWindowHeight + 'px');

    //name input
    var nameInput = $("#name");
    var nameTip =nameInput.val();
    nameInput.blur(function () {
        if($(this).val() == ""){
            $(this).val(nameTip);
        }
    })
    nameInput.focus(function () {
        if($(this).val() == nameTip){
            $(this).val("");
        }
    })
    //regist event

    $("#joinBtn").on("click",function () {
        var name = nameInput.val();
        $.ajax({
            url:"http://" + window.location.host + "/join",
            method:"POST",
            dataType: "json",
            data:{name:name},
            success:function (data) {
                popTipShow.alert('提示',data.msg, ['知道了'],
                    function(e){
                        //callback 处理按钮事件
                        var button = $(e.target).attr('class');
                        if(button == 'ok'){
                            //按下确定按钮执行的操作
                            this.hide();
                            if(data.code == SUCCESS){
                                localStorage.setItem(KEY_OF_NAME,data.data.name);
                                toChatRoom();
                            }
                        }
                    }
                );

            }
        })
    })
})
