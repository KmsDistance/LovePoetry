$(function () { 

})
var reg=/^1[3-9][0-9]{9}$/;
//注册发送验证码
function sendCode() {
    var regionPhone = $('#regionPhone').val();
    console.log(regionPhone)
    if(regionPhone!="" && reg.test(regionPhone)){
        $.ajax({
            type:"post",
            url:baseURL+'/system/customer/validateCustomerByPhone',
            data:{phone:regionPhone},
            success:function (res) {
                console.log(res)
                if(res.status == 200){
                    $.ajax({
                        type:"post",
                        url:baseURL+'/system/customer/sendCode',
                        data:{phone:regionPhone},
                        success:function (res) {
                            console.log(123232);
                            if(res.status == 200){
                                layer.msg("验证码发送成功!");
                                $(".btn-1").hide();
                                $(".ji-shi").show().html("60");
                                var timer = setInterval(Countdown,1000);
                                //获取优惠券 倒计时
                                var i=60;
                                function Countdown(){
                                    if(i>1){
                                        i--;
                                        $(".ji-shi").html(i);
                                    } else{
                                        clearInterval(timer);
                                        $(".ji-shi").hide()
                                        $(".btn-2").show();
                                        $(".btn1").hide();
                                    }
                                }
                            }else{
                                layer.msg("验证码发送失败,请稍后重试!");
                            }
                        },
                    })
                }else{
                    layer.msg('用户已存在！')
                }
            },
        })

    }else{
        layer.msg("请输入正确手机号格式！");
        console.log(111)
    }
}
// 忘记密码发送验证码
function forgetCode(){
    var forgetPhone = $('#forgetPhone').val();
    console.log(forgetPhone);
    if(forgetPhone!="" && reg.test(forgetPhone)){
        $.ajax({
            type:"post",
            url:baseURL+'/system/customer/sendCode',
            data:{phone:forgetPhone},
            success:function (res) {
                if(res.status == 200){
                    layer.msg("验证码发送成功!");
                    $(".btn-11").hide();
                    $(".ji-shi1").show().html("60");
                    var timer = setInterval(Countdown,1000);
                    //获取优惠券 倒计时
                    var i=60;
                    function Countdown(){
                        if(i>1){
                            i--;
                            $(".ji-shi1").html(i);
                        } else{
                            clearInterval(timer);
                            $(".ji-shi1").hide()
                            $(".btn-22").show();
                            $(".btn-11").hide();
                        }
                    }
                }else{
                    layer.msg("验证码发送失败,请稍后重试!");
                }
            },
        })

    }else{
        layer.msg("请输入正确手机号格式！");
    }
}

//注册
function region() {
    var regionPhone = $('#regionPhone').val();
    var regionCode = $('#regionCode').val();
    var regionPassword = $('#regionPassword').val();
    if(regionCode == ""){
        layer.msg("请输入验证码!")
        return
    }
    if(regionPassword == ""){
        layer.msg("请设置密码!")
        return
    }
    if(regionPhone!="" && reg.test(regionPhone)){
        $.ajax({
            type:"post",
            url:baseURL+'system/customer/save',
            data:{phone:regionPhone,code:regionCode,password:regionPassword},
            success:function (res) {
                if(res.status == 200){
                    layer.msg("注册成功！");
                    $("#mymodalRegistered").modal("toggle").hide();
                    $("#mymodalLogin").modal("toggle");
                }else{
                    layer.msg("注册失败！");
                }
            },
        })
    }else{
        layer.msg("请输入正确手机号格式！");
    }
}


// 忘记密码  front/retrievePassword
function forget() {
    var forgetPhone = $('#forgetPhone').val();
    var forgetCode = $('#forgetCode').val();
    var forgetPassword = $('#forgetPassword').val();
    if(forgetCode == ""){
        layer.msg("请输入验证码!")
        return
    }
    if(forgetPassword == ""){
        layer.msg("请设置密码!")
        return
    }
    console.log(reg.test(forgetPhone))
    console.log(forgetPhone)
    if(forgetPhone!="" && reg.test(forgetPhone)){
        $.ajax({
            type:"post",
            url:baseURL+'front/retrievePassword',
            data:{phone:forgetPhone,code:forgetCode,password:forgetPassword,customerId:-1},
            success:function (res) {
                console.log(res)
                if(res.status == 200){
                    layer.msg("修改成功！");
                    $("#mymodalForget").modal("toggle").hide();
                    $("#mymodalLogin").modal("toggle");
                }else{
                    layer.msg("修改失败！");
                }
            },
        })
    }else{
        layer.msg("请输入正确手机号格式！");
    }
}


//登录
function login(a){//a 判断是不是从爱诗学院来的
    var loginPhone = $('#loginPhone').val();
    var loginPassword = $('#loginPassword').val();
    if(loginPassword == ""){
        layer.msg("请输入密码!");
        return
    }
    if(loginPhone!="" && reg.test(loginPhone)){
        $.ajax({
            type:"post",
            url:baseURL+'system/customer/login',
            data:{phone:loginPhone,password:loginPassword},
            success:function (res) {
                if (res.status == 200) {
                    console.log(res);
                    setUserId(res.data.id);//保存用户id
                    setUserInfo(res.data);
                    setUserPermissions(res.mechanismProjectList);
                    setUserMechanism(res.mechanism);
                    var userId = res.data.id;
                    layer.msg("登录成功!");
                    handleCloseLogin();//关闭登录窗口
                    location.reload();
                    // window.location='afterShopping.html?userId='+userId;
                    if (a === 'institutePoem') { //判断是不是从爱诗学院过来的 是跳转登录后的页面
                        window.location = 'afterInstitutePoem.html?userId=' + userId;
                    } else if (a === 'courseDetails') {
                        window.location = 'afterInstitutePoem.html?userId=' + userId;
                    } else { 
                        window.location = 'afterIndex.html?userId=' + userId;
                    }
                }else{
                    layer.msg("登录失败!");
                }
            },
        })
    }else{
        layer.msg("请输入正确手机号格式！");
    }
}
// 登陆后的跳转
function goShoppingCenter(){//跳转到商城中心
    var userId = sessionStorage.getItem('userId');
    window.location = 'afterShopping.html?userId='+userId;
}
function goInstitutePoem(){//跳转到艾诗学院
    var userId = sessionStorage.getItem('userId');
    window.location = 'afterInstitutePoem.html?userId='+userId;
}
function goIndex(){//跳转到首页
    var userId = sessionStorage.getItem('userId');
    window.location = 'afterIndex.html?userId='+userId;
}
// 返回上一级
function goBack(){
    history.go(-1);
}
// 跳转注册
function handleRegister(a){//a判断是否是从登录过来的
    handleCloseLogin();//关闭登录弹框
    if (a !== 'login') { 
        handleCloseForget();//关闭修改密码
    }
    handleMymodalRegistered();//弹出注册弹框
}
// 跳转忘记密码
function handleForget(a) {//a判断是否是从登录过来的 或是否从注册过来
    if (a !== 'registered') { 
        handleCloseLogin();//关闭登录弹框
    }
    if (a !== 'login') { 
        handleCloseRegister();//关闭注册弹框
    }
    $("#mymodalForget").modal("toggle");//弹出忘记密码
}
//跳转登录
function handleLogin(a) {//a 判断是否是从忘记密码过来的
    if (a !== 'registered') { 
        handleCloseForget();//关闭修改密码弹框
    }
    if (a !== 'forget') { 
        handleCloseRegister();//关闭注册弹框
    }
    handleMymodalLogin();//弹出登录弹框
}
    
function handleMymodalLogin(){//弹出登录弹框
    $("#mymodalLogin").modal("toggle");
}
function handleCloseLogin(){//关闭登录弹框
   $("#mymodalLogin").modal("toggle").hide();
}
function handleMymodalRegistered(){//弹出注册弹框
    $("#mymodalRegistered").modal("toggle");
}
function handleCloseRegister(){//关闭注册弹框
   $("#mymodalRegistered").modal("toggle").hide();
}
function handleCloseForget(){//关闭修改密码弹框
   $("#mymodalForget").modal("toggle").hide();
}
