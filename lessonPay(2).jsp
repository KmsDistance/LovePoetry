<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8"/>
    <title>微信安全支付</title>

    <link rel="stylesheet" type="text/css" href="${ctx }/oss/css/bootstrap.css"/>
    <script src="${ctx }/js/public/jquery.1.10.1.js"></script>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="${ctx }/js/flexible.js"></script>
    <script src="${ctx }/js/bootstrap.js"></script>
</head>
<style>
   div{
            text-align: center;
        }
        /* div>img{
            width: 1.89rem;
            height: auto;
        } */
        h4{
            font-size: .5rem;
            color: #333333;
            margin-top: .6rem;
            /* margin-bottom: 2rem; */
        }

        button{
            border: none;
            outline: none;
            background-color:transparent;
            text-decoration: underline

        }
        .codeBox{
            padding: .6rem;
            display: inline-block;
            width: 8rem;
            height: 10rem;
            /* background: url('img/code/border2x.png'); */
            background: url('img/code/bg23.png') no-repeat;
            background-size: cover;

        }
        .codeBox p{
            font-size: .5rem;
            color: #333333;
            text-align: left;
            margin-bottom: .1rem;
        }
        .codeBox span{
            display: block;
            color: #29A8FF;
            font-size: .5rem;
            margin-bottom: .1rem;
        }
        .code{
            display: inline-block;
            background: url('img/code/border2x.png') no-repeat;
            width: 3.6rem;
            height: 3.6rem;
            background-size: cover;
            line-height: 3.6rem;
        }
        .code img{
            width: 3.5rem;
            height: 3.5rem;
        }
        hr{
            width: 85%;
        }
        .textBox{
            margin: 0;
            text-align: center;
        }
        .textBox p{
            display: inline-block;
            font-size: .48rem;
            color: #333333;
            padding-left: .35rem;
        }
        /* 尾部返回 */
.footerBox{
    display: flex;
    height: 1.5rem;
    background-color: #ffffff;
    position: fixed;
    bottom: 0;
    width: 100%;
    line-height: 1.5rem;
    justify-content: center;
    border-top: .5px solid #f3f3fb;
}
.footerBox div{
    width: 31%;
    text-align: center;
}
.footerBox img{
    width: .22rem;
}
.modal{
        text-align: center;
        margin: 0
    }
    .modal-dialog{
        margin: 3rem 0 0 0 ;
        text-align: center;
        width: 8rem;
        display: inline-block;
    }
    .modal-footer,
    .modal-header{
        border: none;
    }
    .modal-header span{
        position: absolute;
        right: .6rem;
        top: .2rem;
        color: #ffffff;
        font-size: .5rem;
    }
    .modal-content{
        display: inline-block;
        background: url('img/bj2121.png') no-repeat;
        width: 7rem;
        height: 8rem;
        background-size: 7rem 8rem;
    }
</style>
<body>
</br></br></br></br>
<div style='margin: 0'>
    <div style='margin: 0;width: 100%; text-align: left;height: 1.3rem; line-height: 1.3rem'>
        <button onclick='winClose()' style='width: 1rem;text-align: center;'><img src="${ctx }/images/pay/back.png" style='width: .3rem;'></button>
    </div>
    <div id='messSus' style="display:none">
        <img src="${ctx }/images/pay/gou.png" alt="">
        <h4>支付成功</h4>
        <div style='margin-top: .8rem' class='codeBox'>
            <p>此次课程券码为：</p>
            <span>1234567890</span>
            <div class='code' style='margin: 0'>
                <img src="img/code/timg.png">
            </div>
            <hr>
            <div class='textBox'>
                <p>请保存该券码，于线下参课时将此券码展示给相关工作人员</p>
            </div>
        </div>
    </div>
    <div id='messErr' style="display:none">
        <img src="${ctx }/images/pay/shibai.png" alt="">
        <h4>支付失败</h4>
    </div>

    <input type="hidden" id="appId" value="${appId}"/>
    <input type="hidden" id="nonceStr" value="${nonceStr}"/>
    <input type="hidden" id="prepayId" value="${prepayId}"/>
    <input type="hidden" id="paySign" value="${paySign}"/>
    <input type="hidden" id="timeStamp" value="${timeStamp}"/>
</div>

<div class="modal fade" id="mymodal">
    <div class="modal-dialog">
        <div class="modal-content" >
            <div class="modal-body" style="text-align: center;padding:0;">
                <div style='min-height: 4.5rem'></div>
                <p style="font-size:.5rem;color:#666;margin-bottom: 5px;">恭喜您！</p>
                <p style="font-size:.35rem;color:#666;margin-bottom: 5px;padding: 0 .8rem">分享课程邀请好友一起来学习，艾诗学院送您价值99元全场代金券。</p>
            </div>
            <div class="modal-footer"  style='margin: 0;text-align: center;padding-top: 5px;position: relative'>
                <button style='font-size: .48rem;color: #ffffff;
                        background: url(${ctx }/images/pay/btnnn.png) no-repeat;
                        width: 6rem;height: 1rem;background-size: 6rem 1rem;text-decoration: none'>立即分享</button>
                <button style='position: absolute;bottom: -75%;left: 43%' onclick="handleClose()">
                    <img src="${ctx }/images/pay/cj.png" style='width: .6rem;'>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="mymodal1">
    <div class="modal-dialog">
        <div class="modal-content" >
            <div class="modal-body" style="text-align: center;padding:0;">
                <div style='min-height: 4.8rem'></div>
                <p style="font-size:.5rem;color:#666;margin-bottom: 5px;">分享成功！</p>
                <p style="font-size:.35rem;color:#666;margin-bottom: 5px;">代金券可在
                    <span style='color: #e72409'>[我的代金券]</span>内查看</p>
            </div>
            <div class="modal-footer"  style='margin: 0;text-align: center;padding-top: 5px;position: relative;'>
                <button onclick="handleClose1()" style='font-size: .48rem;color: #ffffff;
                        background: url(${ctx }/images/pay/btnnn.png) no-repeat;
                        width: 6rem;height: 1rem;background-size: 6rem 1rem;text-decoration: none'>知道了</button>
                <button  style='position: absolute;left: 40%;bottom: -75%;' onclick="handleClose1()">
                    <img src="${ctx }/images/pay/cj.png" style='width: .6rem;'>
                </button>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $(function () {
        callpay();

        // 微信分享设置
        var wxConfig = {};
        var shareUrl = window.location.href.split('#')[0];
        console.log(shareUrl);
        $.ajax({
            type: "post",
            url: "${ctx }/wx/web/share",
            async: false,
            data: {"url": encodeURIComponent(shareUrl)},
            success: function (result) {
                // alert(result);
                console.log(result);
                if(result.status==200){
                    wxConfig = result.data;
                    wxShare();
                }else{
                    console.log(result.message);
                }
            }
        });
        function wxShare(){
            // 微信分享配置
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: wxConfig.appId, // 必填，公众号的唯一标识
                timestamp: wxConfig.timestamp,// 必填，生成签名的时间戳
                nonceStr: wxConfig.nonceStr, // 必填，生成签名的随机串
                signature: wxConfig.signature, // 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareTimeline',//分享给好友
                    'onMenuShareAppMessage',//分享到朋友圈
                    'hideMenuItems'
                ],
                success: function (res) {
                    console.log('微信分享配置');
                },
                fail: function (res) {
                    console.log(JSON.stringify(res));
                }
            });

            wx.ready(function () {
                var title = '《新东方成长历程》_艾诗学院课程_校长堡';
                var desc = '校长堡是一家提供优质教育产品、教育加盟、教学教研服务、教育培训机构培训，帮助百万中小型教育机构实现品牌、管理、课程、运营思维等全面升级，从而推动中国青少年基础教育变革。';
                var link = 'http://xiaozhangbao.com/selling/index.html';
                var imgUrl = 'http://oss-xzb.oss-cn-beijing.aliyuncs.com/Files/d7ccb3de8bcdb35aee35539432334c5d.jpg';
                // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    link: link, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        shareCoupon();
                    }
                });

                // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: link, // 分享链接
                    imgUrl: imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        shareCoupon();
                    }
                });

                wx.hideMenuItems({
                    menuList: [
                        'menuItem:share:qq', // 分享到朋友圈
                        'menuItem:share:QZone' // 复制链接
                    ]
                });
            });

            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，
                // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
                //对于SPA可以在这里更新签名。
                // alert(res);
            });

        }
    });

    //调用微信JS api 支付
    function jsApiCall() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            {
                "appId": $('#appId').val(),     //公众号名称，由商户传入
                "timeStamp": $('#timeStamp').val(),         //时间戳，自1970年以来的秒数
                "nonceStr": $('#nonceStr').val(), //随机串
                "package": $('#prepayId').val(),     //统一订单号
                "signType": "MD5",         //微信签名方式：
                "paySign": $('#paySign').val() //支付签名
            },
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    document.getElementById("messSus").style.display = "block";
                    // 支付成功提示分享框
                    $("#mymodal").modal("toggle");
                } else {//这里支付失败和支付取消统一处理
                    document.getElementById("messErr").style.display = "block";
                }
            });
    }

    function callpay() {
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

    function winClose() {
        window.history.go(-1);
    }

    function winBack() {
        window.history.go(-1);
    }
    // 关闭弹框
    function handleClose(){
        $("#mymodal").modal("toggle").hide();
    }
    function handleClose1(){
        $("#mymodal1").modal("toggle").hide();
    }
    function shareCoupon(){//用户分享成功后赠送卡卷
        $.ajax({
            type: "post",
            url: "${ctx }/wx/lesson/shareCoupon",
            async: false,
            data: {"userId": ${userId},"lessonId":1},
            success: function (result) {
                console.log(result);
                if(result.status==200){
                    console.log(result.message);
                    // 分享成功提示成功框
                    // if($("#mymodal").modal("toggle")){
                    //     $("#mymodal").modal("toggle");
                    // }
                    $('#mymodal').modal('hide')
                    $("#mymodal1").modal("toggle");
                }else{
                    console.log(result.message);
                }
            }
        });
    }
</script>
</body>
</html>