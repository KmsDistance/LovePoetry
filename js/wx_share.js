$(function () { 
    var wxConfig = {};
    // 微信分享设置
    var shareUrl = window.location.href.split('#')[0];
    $.ajax({
        type: "post",
        url: baseURL + "wx/web/share",
        async: false,
        data: {"url": encodeURIComponent(shareUrl)},
        success: function (result) {
            console.log(result);
            if(result.status==200){
                wxConfig = result.data;
                wxShare();
            }else{
                // console.log(result.message);
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
            ]
        });
        
        wx.ready(function () {
            var title = '艾诗学院——培训学校的进修中心';
            var desc = '培训学校管理、招生、名师课程尽在艾诗学院，几十位业内大咖为你的学校保驾护航';
            var link = 'http://wx2.xiaozhangbao.com/Castle/college/index.html';
            var imgUrl = 'http://oss-xzb.oss-cn-beijing.aliyuncs.com/Files/e20b4ac36829816aa7db0dfca8017323.png';
            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    // shareCoupon();
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数

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
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
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
        // function shareCoupon(){//用户分享成功后赠送卡卷
        //     $.ajax({
        //             type: "post",
        //             url: baseURL + "/system/course/shareCoupon",
        //             async: false,
        //             data: {userId: sessionStorage.getItem('userId'),lessonId:1},
        //             success: function (result) {
        //                 if (result.status==200) {
        //                     layer.msg('分享成功');
        //                     $('#coupons').removeClass('display-none');
        //                 }else{
        //                     layer.msg(result.message);
        //                     return 
        //                 }
        //             }
        //     });
        // }
    }
})