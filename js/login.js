$(function(){
    $("#loginDj").click(function () {
        var phone = $("#input-width").val();
        var yzm = $("#yzm").val();
        var reg=/^1[3-9]\d{9}$/;
        console.log(phone,yzm);
        if(reg.test(phone)&&yzm!=""){

        };
    });
});
