var code;
var coupons;
var couponUserId;//优惠券id
var payMoney;
var wxData;
$(function () { 
    // location.replace(location.href.substring(0,location.href.lastIndexOf('/')) + '/code.html?shoppingId=' + search().shoppingId);
	var wxCode = getUrlParam('code');
	if(wxCode){
		pay.wxPayCollege(wxCode, search().shoppingId)//唤醒微信支付的参数
			.then((res) => {
				wxData = JSON.parse(res).data;
				callWxPay();////唤起微信方法
		 });
	}
	
    var userInfo, way;
    Tool.getCustomerByCustomerId()  //根据用户Id获取用户所有信息
        .then((res) => {
            console.log(res);
             userInfo = res;
            var shoppingId = search().shoppingId;
            return pay.orderFormById(shoppingId)
        })
        .then((res) => { //获取订单详情
            code = res.code;
            console.log(res); 
            way = res.course.way;
            var payHTML = '';
            var payMent = '';
            payMoney = res.price;
            var payMent = `<h4 id="payPriceBox">${res.price}</h4>
                            <p>堡币</p><span>(￥${res.price} )</span>`;
            $('#payMent').html(payMent);
            payHTML += `    
                <div class="payType">
                    <p>付款方式</p>
                    <div onclick="GoToPayType(1)">
                        <img src="img/qian.png">
                        <span>堡币支付(可用${parseInt(userInfo.rows.rechargePrice) + parseInt(userInfo.rows.givePrice)})</span>
                        <img src="img/4.png" alt="" class="display-none isPayType1">
                    </div>
                </div>`;
            if (userInfo.rows.isTeacher === 1) {
                payHTML += `
                    <div class="payType">
                        <p></p>
                        <div onclick="GoToPayType(2)">
                            <img src="img/qian.png">
                            <span>申请代付</span>
                            <img src="img/4.png" class="display-none isPayType2">
                        </div>
                    </div>`;
            }
            payHTML += `
                <div class="payType">
                    <p></p>
                    <div onclick="GoToPayType(3)">
                        <img src="img/wx.png">
                        <span>微信支付</span>
                        <img src="img/4.png" class="display-none isPayType3">
                    </div>
                </div>
                <button id="payMony" class="btn1">立即支付</button>
                <button id="payTopUp" onclick="handleGoToRouter('topUp.html')" class="btn1 display-none">立即充值</button>
                </div>
                `;
            console.log(res.code)
            $('#payMoney1').html(payHTML);
            var payBaoBi = '';
            payBaoBi += `
                <p>账号余额 : <span>${parseInt(userInfo.rows.rechargePrice) + parseInt(userInfo.rows.givePrice)}</span> 堡币</p>
                <p>支付 : <span id="modelMoney">${res.price}</span> 堡币</p>
                <div>
                    <p>请输入支付密码 </p>
                    <div>
                        <input id="payPassword" type="password" value="">
                    </div>
                    <span>请输入6位数字的支付密码</span>
                </div>`;
            $('#payBaoBi').html(payBaoBi);

            $('#payMony').click(function () { //立即支付 弹出堡币支付框
                if (payType === 1) {
                    $("#mymodal").modal("toggle");//堡币支付
                    $('#footerPayBaoBi').click(function () { 
                        var pawd = $('#payPassword').val();
                        if (pawd.length !== 6) { 
                            layer.msg('密码不正确');
                            return 
                        }
                        pay.validatePaymentPassword(pawd)//验证支付密码
                            .then((res) => { 
                                console.log(res);
                                if (res.status === 200) {
                                    if (couponUserId) {
                                        couponUserId = couponUserId;
                                        console.log(couponUserId + '优惠券id');
                                    } else { 
                                        couponUserId = 0;
                                        console.log(couponUserId + '优惠券id');
                                    }
                                    return pay.bonusBuy(code,couponUserId);//调用堡币支付
                                } else if (res.status === 500) { 
                                    layer.msg('密码错误');
                                    return 
                                }
                            })
                            .then((res) => { //堡币支付
                                console.log(res);
                                if (res.status === 200) { 
                                    layer.msg('支付成功');
                                    $("#mymodal").modal("toggle").hide();//关闭支付模态框
                                    $.ajax({//获取用户信息
                                        type: 'post',
                                        url: getCustomerByCustomerId,
                                        data: {
                                            customerId: getUserId(),
                                        },
                                        success: function (res) {
                                            console.log(res)
                                            if (res.status === 200) { 
                                                setUserInfo(res.rows);//写入用户 实时更新用户余额
                                            }
                                        },
                                        error: function (error) { console.log(error) }
                                    })
                                    // way = 2
                                    if (way === 2) { //判断是不是线下课程
                                        location.replace(baseURL + '/college/code.html?shoppingId=' + search().shoppingId); //跳转到二维码页面
                                    } else { 
                                        location.replace(baseURL + '/college/paySuccess.html'); //跳转回艾诗学院首页
                                    }
                                }else if (res.status === 500) { 
                                    layer.msg(res.message);
                                }
                            })
                            .catch((error) => { 
                                console.log(error);
                            })
                    })
                } else if (payType === 2) {
                    var mechanism = getUserMechanism();//获取机构信息 获得校长id
                    var paidHTML = `<p>你确定让${mechanism.customerPhone}为你代付么?</p>`;
                    $('#paid').html(paidHTML);
                    $("#mymodalPaid").modal("toggle");//申请代付
                } else if (payType === 3) {//微信支付
                    if (couponUserId) {
                        couponUserId = couponUserId;
                        console.log(couponUserId + '优惠券id');
                    } else { 
                        couponUserId = 0;
                        console.log(couponUserId + '优惠券id');
                    }
						//pay.orderFormWxPay(res.code, couponUserId)
							//.then((res) => {
								//console.log(res);
								//location.replace(res.data);
								// location.href = res.data;
								// return 
								// if (way === 2) { //判断是不是线下课程 是线下课程
								//     location.replace(location.href.substring(0, location.href.lastIndexOf('/')) + '/code.html?shoppingId=' + search().shoppingId); //跳转到二维码页面
								//     location.href = '/paySuccess.html';
								// } else { 
								//     // location.replace(location.origin+'/paySuccess.html'); //跳转回艾诗学院首页
								//     location.replace(location.origin+'/paySuccess.html'); //跳转回艾诗学院首页
								// }
                         //});
						 pay.orderFormWxPayCollege(res.code, couponUserId)
							.then((res) => {
								console.log(res);
								console.log(window.location.href);
								window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ res.data +'&redirect_uri='+ window.location.href +'&response_type=code&scope=snsapi_userinfo#wechat_redirect');
                         });
                } else if (payType === 4) {
                    layer.msg('支付宝支付')
                    pay.orderFormAnotherPay(2);
                } else { 
                    layer.msg('请选择支付方式')
                }
            })
            $.ajax({
                type: 'post',
                url: myCouponsDetails,
                data: {userId:getUserId(),code:code},
                success: function (res){
                    var coupons = res.data;
                    console.log(res);
                    var areaBox = '';
                    for(var couponsList of coupons){
                        areaBox += `
                            <div class="Box" onclick="useCoupons(${couponsList.id}, ${payMoney}, ${couponsList.money}, '${couponsList.name}')">
                                <div>${couponsList.name}</div>
                                <div class='active  display-none'><img src="img/xGou.png"></div>
                                <div></div>
                            </div>`;
                    }
                    areaBox += `
                        <div class="Box" onclick="useCoupons('0', ${payMoney}, '0', '使用代金券')">
                            <div>不使用代金券</div>
                            <div class='active display-none' ><img src="img/xGou.png"></div>
                            <div></div>
                        </div>`
                    $("#areaBox").html(areaBox);
                },
                error: function (error){
                    console.log(error);
                }
            })
        // 点击使用优惠券 弹出优惠券内容
            $("#expressArea").click(function() {
                $("#areaMask").fadeIn();
                $("#areaLayer").animate({"bottom": 0}).attr("flag","0");
               
            });
            $("#areaMask, #closeArea").click(function() {
                clockArea();
            });

        })
        .catch((error) => {
            console.log(error)
        })
    $('#areaBox').on('click', '.Box', function () {
        $(this).children(':nth-child(3)').addClass('display-none').prev().removeClass('display-none')
            .parent().siblings().children(':nth-child(2)').addClass('display-none').next().removeClass('display-none');
        clockArea();
    })


})
    
function useCoupons(id, payMoney, money, name) { 
    couponUserId = id;
    payMyone = parseInt(payMoney) - parseInt(money);
    console.log(payMyone)
    $.ajax({
        type: 'post',
        url: upDateMoney,
        data: {
            userId: getUserId(),
            code: code,
            couponUserId:id,
        },
        success: function (res) {
            console.log(res);
            if (res.status === 200) {
                $('#payMent').html(`￥${res.data} 堡币`);
                $('#modelMoney').html(`${res.data}`);
                $('#couponsText').html(`${name}`);
            } else { 
                layer.msg(res.message);
                couponUserId = 0;
                return 
            }
        },
        error: function (error) {
            console.log(error);
         }
    })
};
    // 修改支付密码发送验证码
    function payCode(){
        var payPhone = $('#payPhone').val();
        console.log(payPhone);
        if(payPhone!="" && reg.test(payPhone)){
            $.ajax({
                type:"post",
                url:baseURL+'/system/customer/sendCode',
                data:{phone:payPhone},
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
    // 修改支付密码
    function payBox(){
        var payPhone = $('#payPhone').val();
        var payCode = $('#payCode').val();
        var paymentPassword = $('#paymentPassword').val();
        console.log(paymentPassword);
        if(payCode == ""){
            layer.msg("请输入验证码!")
            return
        }
        if(payPassword == ""){
            layer.msg("请设置密码!")
            return
        }
        if(payPhone!="" && reg.test(payPhone)){
            $.ajax({
                type:"post",
                url:setPaymentPassword,
                data:{phone:payPhone,code:payCode,password:paymentPassword,customerId:getUserId()},
                success:function (res) {
                    console.log(res)
                    if(res.status == 200){
                        layer.msg("修改成功！");
                        Tool.modalClose('#mymodalForgetPay');
                    }else{
                        layer.msg("修改失败！");
                    }
                },
                error:function(error){
                    console.log(error);
                }
            })
        }else{
            layer.msg("请输入正确手机号格式！");
        }
    }
var payType;//用于接收用户选择的支付类型
function GoToPayType(index) {//点击切换勾选的支付类型
    if (index === 1) {
        $.ajax({//获取用户信息
            type: 'post',
            url: getCustomerByCustomerId,
            data: {
                customerId: getUserId(),
            },
            success: function (res) {
                console.log(res)
                if (res.status === 200) { 
                    setUserInfo(res.rows);//写入用户
                    var money = res.rows.rechargePrice + res.rows.givePrice;//获取用户当前总余额
                    var payMoney =$('#payPriceBox').html();//获取当前的订单价格
                    console.log(payMoney)
                    if (money >= payMoney) {//判定当用户余额小于订单价格 显示立即支付 按钮
                        $('.payType img:last-child').addClass('display-none');
                        $('.isPayType' + index).removeClass('display-none');
                        payType = index;
                    } else {//判定当用户余额小于订单价格 显示立即充值 按钮
                        $('.payType img:last-child').addClass('display-none');
                        $('.isPayType' + index).removeClass('display-none');
                        $('#payTopUp').removeClass('display-none').prev().addClass('display-none');
                    }
                    
                }
            },
            error: function (error) { console.log(error) }
        })
    } else { 
        $('.payType img:last-child').addClass('display-none');
        $('.isPayType' + index).removeClass('display-none');
        $('#payTopUp').addClass('display-none').prev().removeClass('display-none');
        payType = index;
    }
}
function handlePayPaid() { //点击确认代付 成功弹出代付成功页面
    var mechanism = getUserMechanism();//获取机构信息 获得校长id
    pay.orderFormAnotherPay(code, 1, mechanism.customerId)
        .then((res) => {
            console.log(res)
            if (res.status === 200) {
                handleClosePaid();//关闭代付模态框
                handleModelPayPaidSuccess();//弹出代付成功
                location.href = 'myOrder.html';
            } else if (res.status === 500) {
                layer.msg(res.message);
                handleClosePaid();//关闭代付模态框
             }
        })
}
function handleClose(){//关闭堡币支付框
    $("#mymodal").modal("toggle").hide();
}
function handleClosePaid(){//关闭代付模态框
    $("#mymodalPaid").modal("toggle").hide(); 
}
function handleModelPayPaidSuccess() { //弹出代付成功
    $('#mymodalPaidSuccess').modal('toggle');
}
function handleModelClosePayPaidSuccess() { //关闭代付成功
    $('#mymodalPaidSuccess').modal('toggle').hide()
    location.replace(baseURL+'/college/afterInstitutePoem.html?userId=' + getUserId()); //跳转回艾诗学院首页
}

function clockArea() {
    $("#areaMask").fadeOut();
    $("#areaLayer").animate({"bottom": "-100%"});
}

	//获取url中的参数
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
	}

	//调用微信JS api 支付
    function jsApiCall() {
		console.log('wxData::'+wxData);
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            {
                "appId": wxData.appId,     //公众号名称，由商户传入
                "timeStamp": wxData.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": wxData.nonceStr, //随机串
                "package": wxData.prepayId,     //统一订单号
                "signType": "MD5",         //微信签名方式：
                "paySign": wxData.paySign //支付签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {//微信支付成功  回调
					location.replace(baseURL + '/college/paySuccess.html');
                } else {//这里支付失败和支付取消统一处理//微信支付失败回调
					
				}
            });
    }
//唤起微信方法
    function callWxPay() {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
            }
        } else {
            jsApiCall();
        }
    }

