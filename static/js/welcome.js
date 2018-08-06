(function($) {
    'use strict';

    $(function() {
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
    });
})(jQuery);