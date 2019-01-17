// var  baseURL="http://192.168.1.234:8080/Castle/";
// var  baseURL="http://192.168.1.150:8888/Castle/";
// var baseURL = "http://www.xiaozhangbao.cn/Castle/";
// var baseURL = "http://192.168.1.93:8080/Castle/";
// var baseURL = "http://192.168.1.123:8888/Castle/";
var baseURL = "http://wx2.xiaozhangbao.com/Castle/";
// 课程详情页面
var courseGetById = baseURL + 'front/course/getById';              //id= 11 根据课程id获取课程详细信息
var teacherGetById = baseURL + 'front/teacher/getById';             //id= 7  根据讲师id获取讲师信息   
var myCommentGetCommentList = baseURL + 'front/myComment/getCommentList';//courseId = 11 根据课程id获取课程评论
var myLikeSave = baseURL + 'front/myLike/save';                    //userId  courseId 根据课程id 用户id
var myCollectionSave = baseURL + 'front/myCollection/save';        //用户添加课程 收藏
var myCollectionDelete = baseURL + 'front/myCollection/delete';    //取消收藏
// 首页相关
var courseGetIndexCourse = baseURL + 'front/course/getIndexCourse';  //获取首页课程全部
// 评论相关
var myCommentSave = baseURL + 'front/myComment/save';               //添加用户评论
var saveMyCommentLike = baseURL + 'front/myComment/saveMyCommentLike';//给课程下用户评论点赞
//报名相关
var signUpSavePartner = baseURL + 'system/signUp/savePartner';//添加报名信息

//我的收藏
var myCollection = baseURL + 'front/myCollection/myCollections';

// 我的评论
var myComments = baseURL + 'front/myComment/myComments';
// 我的观看历史
var myViewHistorySave = baseURL + 'front/myViewHistory/save';//添加我的观看历史
var myViewHistoryMyViewHistorys = baseURL + 'front/myViewHistory/myViewHistorys';//获取我的所有观看记录
//下单                                                                          //用户id 课程id  
var orderFormSaveCollege = baseURL + 'finance/orderForm/saveCollege';//用户下单 userId=0&courseId=0
var orderFormById = baseURL + 'finance/orderForm/byId'; //根据订单id获取订单信息
var orderFormWxPay = baseURL + 'finance/orderForm/wxPay';//用户微信去支付userId=0&code='0'
var orderFormAnotherPay = baseURL + 'finance/orderForm/anotherPay';//代付 userId=0&code='0'&payAnother=1&payAnotherUserId=0是否代付1是 2 代付人id
// var bonusBuy = baseURL + 'pay/bonus/buy';//堡币支付
var bonusBuy = baseURL + 'pay/bonus/buyCourse';//堡币支付
var upDateMoney = baseURL + 'system/coupon/getCouponMoney';//重新计算价格
var rechargeForm = baseURL + 'finance/rechargeForm/save';       //微信下单 充值
var shoppingPayWxPay = baseURL + 'pay/wxPay/getQCode';       //微信支付?orderFormId=0;
var rechargeFormWxSave = baseURL + 'finance/rechargeForm/wxSave';//直接发起微信充值；

var getCustomerByCustomerId = baseURL + 'front/getCustomerByCustomerId';   //根据用户Id获取用户所有信息
var validatePaymentPassword = baseURL + 'front/validatePaymentPassword';   //宝币支付验证支付密码

// 我的订单
var myOrderContent = baseURL + 'finance/orderForm/courseList';

var getCouponCodeInfo = baseURL + 'front/course/getCouponCodeInfo';//?code=''
// 支付页显示的优惠券内容
var myCouponsDetails = baseURL + 'system/coupon/myUseList';
//选择优惠券页面加载
var couponsClose = baseURL + 'pay/bonus/buyCourse';

// 我的优惠券
var myCoupons = baseURL + 'system/coupon/myList';   

//重置支付密码
var setPaymentPassword = baseURL + 'front/setPaymentPassword';

var orderFormWxPayCollege = baseURL + 'finance/orderForm/wxPayCollege';//用户微信去支付userId=0&code='0'
var wxPayCollege = baseURL + 'pay/wxPay/college';//获取微信jsapi支付参数

var setUserId = (userId) => { //写入用户Id
    sessionStorage.setItem("userId",userId);
}

// 修改团报信息
var massDetails =  baseURL + 'system/signUp/getPartners'
var upDatePartner = baseURL + 'system/signUp/upDatePartner'


 var getUserId = () => { //读取用户Id
    return sessionStorage.getItem("userId");
}

 var setUserInfo = (info) => { //写入用户信息
    sessionStorage.setItem("info",JSON.stringify(info));
}

 var getUserInfo = () => { //读取用户信息
     return JSON.parse(sessionStorage.getItem("info"));
}
var setUserPermissions = (info) => { //写入用户权限数组
    if (info) {
        sessionStorage.setItem("Permissions", JSON.stringify(info));
    } else { 
        sessionStorage.setItem("Permissions", '');
    }
}

var getUserPermissions = () => { //读取用户权限数组
     var permissions = (sessionStorage.getItem("Permissions") ? sessionStorage.getItem("Permissions") :'')  ? JSON.parse(sessionStorage.getItem("Permissions")) : ''
     return permissions;
}
 var setUserMechanism = (info) => { //写入用户机构信息
    sessionStorage.setItem("setUserMechanism",JSON.stringify(info));
}

 var getUserMechanism = () => { //读取用户机构信息
     return JSON.parse(sessionStorage.getItem("setUserMechanism"));
}
var setCourseInfo = (course) => { //写入课程信息
    sessionStorage.setItem("course",JSON.stringify(course));
}

 var getCourseInfo = () => { //读取课程信息
     return JSON.parse(sessionStorage.getItem("course"));
}
var setPrice = (price) => { //写入报名信息 人数 价格
    sessionStorage.setItem("price",JSON.stringify(price));
}

var getPrice = () => { //读取报名信息 人数 价格
     return JSON.parse(sessionStorage.getItem("price"));
}
var clearPrice = () => { //读取报名信息 人数 价格
    // $('#bulkList').children('img:last-child').removeClass('display-none');
    $('#bulkList .priceOne img:last-child').addClass('display-none');//去除选择人数后的样式(每次进入弹窗);
     sessionStorage.removeItem("price");
}
var setOne = (one) => { //写入第一次进入艾诗学院
    sessionStorage.setItem("one",one);
}
var getOne = () => { //写入第一次进入艾诗学院
    return sessionStorage.getItem('one');
}

function search(){//获取url参数
    var searchObj={}
    if(location.search!=""){
        var search=location.search.slice(1);//"_ijt=uius89iamtsiffau6gdjhdkjmn"
        if(search.indexOf("&")!=-1){
            var arr=search.split("&");
            for(var str of arr){
                var [key,value]=str.split("=");
                if(!(key in searchObj))
                    searchObj[key]=value
                else
                    searchObj[key]=[].concat(searchObj[key],value);
            }
        }else{
            var [key,value]=search.split("=");
            searchObj[key]=value;
        }
    }
    return searchObj;
}

function handleGoToRouter(router) { //公共路由跳转
    window.location.href = router;
}

// 工具类
var Tool = {
    toolCountdown: function (time) { 
        var endTime = new Date(time.replace(/-/g,'/')).getTime() / 1000;
        var countdown = setInterval( () => {
            var date = parseInt(new Date().getTime() / 1000);//获得当前系统时间的秒数
            var time = endTime - date;
            var day = parseInt(time / (3600 * 24));
            var hours = parseInt(time % (3600 * 24) / 3600);
            hours = hours < 10 ? '0' + hours : hours;
            var minutes = parseInt(time % 3600 / 60);
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var seconds = time % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            $('#endTime').html(`报名倒计时:${day}天 ${hours}:${minutes}:${seconds}`);
            $('#ending').hide();
            if (parseInt(day) <= 0 && parseInt(hours) <= 0 &&  parseInt(minutes) <= 0 && parseInt(seconds) <= 0) { 
                $('#endTime').hide();
                $('#ending').show()
                $('#ending').html(`报名已结束`);
                $('.btn').hide();
                $('.btnClose').show()
                clearInterval(countdown);
            }
        }, 1000);
    },
    modalOpen: function (modal) { //打开模态框
        $(modal).modal("toggle");
    },
    modalClose: function (modal,modalopen) { //关闭模态框
        $(modal).modal("toggle").hide(); 
        if (modalopen) { //判断关闭后是否需要在打开一个模态框
            $(modalopen).modal("toggle")
        }
    },
    checkName: function (value, name) {//name=需要验证的name value=需要显示jq选择器 
        var regName = value.match(/^[\u4e00-\u9fa5]{2,8}$/g);
        if (name) { 
            if (regName === null) {
                $(name).parent().next().removeClass('display-none');
                return false
            } else { 
                $(name).parent().next().addClass('display-none');
                return true
            }
        }
    },
    checkPhone: function (value, name) { //value=需要验证的value name=需要显示jq选择器 
        var regPhone = /^1[3-9][0-9]{9}$/;
        if (name) { 
            if (!regPhone.test(value) && value.lenght !== 11) {
                $(name).parent().next().removeClass('display-none');
                return false
            } else { 
                $(name).parent().next().addClass('display-none');
                return true
            }
        }
    },
    getCustomerByCustomerId: function () { //获取用户信息
        return new Promise((open, error) => {
            $.ajax({
                type: 'post',
                url: getCustomerByCustomerId,
                data: {
                    customerId: getUserId(),
                },
                success: function (res) {
                    console.log(res)
                    if (res.status === 200) { 
                        open(res);
                    }
                },
                error: function (error) {console.log(error) }
            })
         })
    }
}
// 支付类
var pay = {
    GotoPay: function (courseId, parentIds) { 
        $.ajax({//下单
            type: 'post',
            url: orderFormSaveCollege,
            data: {
                userId: getUserId(),
                courseId: courseId,
                parentIds:parentIds ? '['+parentIds.toString()+']' : '',
            },
            success: function (res) { 
                console.log(res);
                if (res.status === 200) { 
                    location.href = 'payment.html?shoppingId=' + res.data.id;//跳转到支付页面
                } if (res.status === 500) { 
                    layer.msg(res.message);
                }
            },
            error: function (error) { 
                console.log(error)
            }
        })
    },
    orderFormById: function (id) { //获取订单详情
        return new Promise((open, error) => { 
            $.ajax({//下单
                type: 'post',
                url: orderFormById,
                data: {
                    id:id,
                },
                success: function (res) { 
                    // console.log(res);
                    open(res);
                },
                error: function (error) { 
                    console.log(error)
                }
            })
        })
    },
    orderFormWxPay: function (code,couponUserId) { //微信支付
        return new Promise((open, error) => { 
            $.ajax({//下单
                type: 'post',
                url: orderFormWxPay,
                data: {
                    userId: getUserId(),
                    code: code,
                    couponUserId:couponUserId,
                },
                success: function (res) { 
                    // console.log(res);
                    open(res);
                },
                error: function (error) { 
                    console.log(error)
                }
            })
        })
    },
    orderFormAnotherPay: function (code, payAnother, payAnotherUserId) { 
        return new Promise((open, error) => { 
            $.ajax({//下单
                type: 'post',
                url: orderFormAnotherPay,
                data: {
                    userId: getUserId(),
                    code: code,
                    payAnother: payAnother,
                    payAnotherUserId:payAnotherUserId,
                },
                success: function (res) { 
                    // console.log(res);
                    open(res);
                },
                error: function (error) { 
                    console.log(error)
                }
            })
        })
    },
    //                  订单流水号 优惠券id
    bonusBuy: function (code, couponUserId) { 
        console.log(couponUserId);
        
        return new Promise((open, error) => { 
            $.ajax({//下单
                type: 'post',
                url: bonusBuy,
                data: {
                    code: code,
                    userId: getUserId(),
                    couponUserId:couponUserId,
                },
                success: function (res) { 
                   return  open(res);
                },
                error: function (error) { 
                    console.log(error)
                }
            })
        })
    },
    validatePaymentPassword: function (password) { //验证支付密码
        return new Promise((open, error) => {
            $.ajax({
                type: 'post',
                url: validatePaymentPassword,
                data: {
                    customerId: getUserId(),
                    paymentPassword: password,
                },
                success: function (res) { 
                    return open(res);
                },
                error: function (error) { 
                    console.log(error)
                }
            })
         })
    },
	orderFormWxPayCollege: function (code,couponUserId) { //微信支付
        return new Promise((open, error) => { 
            $.ajax({//下单
                type: 'post',
                url: orderFormWxPayCollege,
                data: {
                    userId: getUserId(),
                    code: code,
                    couponUserId:couponUserId,
                },
                success: function (res) { 
                    // console.log(res);
                    open(res);
                },
                error: function (error) { 
                    console.log(error)
                }
            })
        })
    },
	wxPayCollege: function (wxCode,orderFormId) { //微信支付
        return new Promise((open, error) => { 
            $.ajax({//下单
                type: 'post',
                url: wxPayCollege,
                data: {
                    code: wxCode,
                    orderFormId:orderFormId
                },
                success: function (res) { 
                    // console.log(res);
                    open(res);
                },
                error: function (error) { 
                    console.log(error)
                }
            })
        })
    },
}
