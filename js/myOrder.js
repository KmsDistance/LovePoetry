var isCooperation;
var isTeacher;
if (getUserInfo()) { 
    var userInfo = getUserInfo();//获取用户信息
    // console.log(userInfo);
    isCooperation = userInfo.isCooperation;
    isTeacher = userInfo.isTeacher;
}
var userId = getUserId();
$(function(){
    getOrder(0);//页面一加载获取全部订单数据
    $('.titleBox').on('click', 'li', function (e) { 
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
    })
})
function getOrder(status) {
    $.ajax({
        type: 'post',
        url: myOrderContent,
        data: {userId:userId,status:status},
        success: function (res) {
            // console.log(res)
            if(res.status == 200){
                var myOrder = res.data;
                // console.log(myOrder);
                var myOrderDetails = '';
                var remainCount = '';
                var countDown = '';
                var timeType = '';
                var endTime = '';
                var hours = '';
                var mins = '';
                var s = '';
                var date = '';
                var id;
                var count = ''
                var liveTime =''
                var addTime = '';
                var oderAddtime = '';
                    // 获取全部
                    if(status === 0) {
                        console.log(getUserInfo())
                        console.log(1212)
                        for(let i=0;i<myOrder.length;i++){
                            // endTime = endTime.getTime();
                            endTime = new Date(myOrder[i].course.endTime.replace(/-/g,'/')).getTime();
                            addTime = new Date(myOrder[i].course.addTime.replace(/-/g,'/')).getTime()+86400000;
                            // console.log(endTime);
                            if(myOrder[i].course.numLimit>myOrder[i].course.numReported){
                                remainCount = myOrder[i].course.numLimit - myOrder[i].course.numReported;
                            }else{
                                remainCount ='报名人数已满!'
                            }
                            addTime1 =  new Date(myOrder[i].addTime.replace(/-/g,'/')).getTime()+86400000;
                            // addTime1 = addTime1.substring(0,10);
                            oderAddtime = myOrder[i].addTime.substring(0, 10);
                            // myOrderDetails += ``
                            // 1 未支付    2 已支付    5  已取消   0  全部
                            // 未支付
                            if(myOrder[i].status === 1){
                                id = myOrder[i].id;
                                // console.log(id)
                                myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                <p>剩余名额：${remainCount}人</p>
                                                <p id="count${id}">报名倒计时：</p>`;
                                
                                function a(id, endTime) { //报名倒计时
                                    var countTime;
                                    countTime = count + id;
                                    countTime = setInterval(function(){
                                        date = new Date().getTime();
                                        timeType = parseInt(endTime - date);
                                        day = parseInt(timeType / 86400000);
                                        hours = parseInt(timeType/3600000%24);
                                        mins = parseInt((timeType - hours * 3600000) / 60000%60);
                                        mins = mins < 10 ? '0' + mins : mins;
                                        s = parseInt((timeType - hours * 3600000 - mins * 60000) / 1000%60);
                                        s = s < 10 ? '0' + s : s;
                                        count = "报名倒计时："+day+'天&nbsp;'+hours+":"+mins+":"+s;
                                        $("#count" + id).html(count);
                                        if (hours <= 0 && mins <= 0 && s <= 0) {
                                            clearInterval(countTime);
                                            $("#count" + id).html('报名结束');
                                            $('.payMoneyPrice' + id).html(`<span class='pq'>报名已结束</span>`);
                                        }
                                    },1000)
                                }
                                a(id, endTime);
                                myOrderDetails +=`                
                                                <span id="order${id}">订单取消倒计时：00:00:00</span>
                                            </div>
                                        </div>
                                        <div class='payMoneyPrice payMoneyPrice${id}'>`;
                                function b(id, addTime1) { //订单取消时间
                                    var orderTime;
                                    orderTime = orderTime + id;
                                    orderTime = setInterval(function(){
                                        date = new Date().getTime();
                                        timeType = parseInt(addTime1-date) ;
                                        hours = parseInt(timeType/3600000);
                                        mins = parseInt((timeType-hours*3600000) / 60000);
                                        mins = mins < 10 ? '0' + mins : mins;
                                        s = parseInt((timeType - hours * 3600000 - mins * 60000) / 1000);
                                        s = s < 10 ? '0' + s : s;
                                        order = "订单取消倒计时" + hours + ":" + mins + ":" + s;
                                        $("#order" + id).html(order);
                                        if (hours <= 0 && mins <= 0 && s <= 0) {
                                            clearInterval(orderTime);
                                            $("#order" + id).html('已取消');
                                            $('.payMoneyPrice' + id).html(`<span class='pq'>已取消</span>`);
                                        }
                                    },1000)
                                }
                                b(id, addTime1);
                                // 教师账户
                                    if(userId == myOrder[i].userId && myOrder[i].payAnother == 1){
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <span class='pq'>等待代付</span>
                                            </div>
                                        </div>`
                                    }else if(userId != myOrder[i].userId && myOrder[i].payAnother == 1){
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                    <a onclick="codePay(${myOrder[i].id})">慷慨代付</a>
                                                </div>
                                            </div>`
                                    }else if(myOrder[i].payAnother == 2){
                                        
                                        myOrderDetails += `
                                                    <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                    <a  onclick="codePay(${myOrder[i].id})">立即支付</a>
                                                </div>
                                            </div>`
                                    }
                            }
                            // 已支付
                            // 线下  
                            if(myOrder[i].status === 2 && myOrder[i].course.way == 2){
                                // console.log(myOrder[i]);
                                liveTime = myOrder[i].course.liveTime;
                                liveTime = liveTime;
                                if(myOrder[i].course.isGroupDiscount == -1){
                                    // console.log(myOrder[i].course.isGroupDiscount);
                                    myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                <p>形式：线下</p>`
                                    if(myOrder[i].payType == 3){
                                        myOrderDetails += `<p>支付方式：堡币</p>`;
                                    }else if(myOrder[i].payType == 1){
                                        myOrderDetails += `<p>支付方式：微信</p>`;
                                    }
                                    myOrderDetails += `
                                                <span>开课时间：${liveTime}</span>
                                            </div>
                                        </div>
                                        <div class='payMoneyPrice'>`;
                                    if (isTeacher === 1) {
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                            </div>
                                        </div>`;
                                    } else if (isCooperation === 1) {
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                            </div>
                                        </div>`;
                                    } else if (myOrder[i].course.price) {
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                            </div>
                                        </div>`;
                                    }
                                }else if(myOrder[i].course.isGroupDiscount == 1){
                                    // console.log(myOrder[i].course.isGroupDiscount)
                                    myOrderDetails += `
                                        <div>
                                            <div class='massMsg'>
                                            <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                                <a onclick="massDetails(${myOrder[i].id})">修改团报信息</a>
                                            </div>
                                            <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                    <p>形式：线下 &nbsp; &nbsp; &nbsp; 团报：${myOrder[i].joinGroupNum}人</p>
                                                    <span>开课时间：${liveTime}</span>
                                                </div>
                                            </div>
                                            <div class='payMoneyPrice'>`;
                                            myOrderDetails += `
                                            <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                    <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                                </div>
                                            </div>`;
                                }
                            }
                            // 点播
                            if(myOrder[i].status == 2 && myOrder[i].course.way == 0){
                                // console.log(myOrder[i]);
                                myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                <p>形式：点播</p>`;
                                if(myOrder[i].payType == 3){
                                    myOrderDetails += `<p>支付方式：堡币</p>`;
                                }else if(myOrder[i].payType == 1){
                                    myOrderDetails += `<p>支付方式：微信</p>`;
                                }
                                if (isTeacher === 1) {
                                    myOrderDetails += `
                                        </div>
                                            </div>
                                                <div class='payMoneyPrice'>
                                                <p>实付: <span>${myOrder[i].price}堡币</span></p>`;
                                } else if (isCooperation === 1) {
                                    myOrderDetails += `
                                    </div>
                                        </div>
                                            <div class='payMoneyPrice'>
                                            <p>实付: <span>${myOrder[i].price}堡币</span></p>`;
                                } else if (myOrder[i].course.price) {
                                    myOrderDetails += `
                                    </div>
                                        </div>
                                            <div class='payMoneyPrice'>
                                            <p>实付: <span>${myOrder[i].price}堡币</span></p>`;
                                }
                                if(userId == myOrder[i].userId && myOrder[i].payAnother == 1){
                                    myOrderDetails += `            
                                            <a onclick="courseDetails(${myOrder[i].course.id})">立即播放</a>
                                        </div>
                                    </div>`
                                }else if(userId != myOrder[i].userId && myOrder[i].payAnother == 1){
                                    myOrderDetails += `            
                                            <span class='pq'>已代付</span>
                                        </div>
                                    </div>`
                                }else if(myOrder[i].payAnother == 2){
                                    myOrderDetails += `            
                                            <a onclick="courseDetails(${myOrder[i].course.id})">立即播放</a>
                                        </div>
                                    </div>`
                                }
        
                            }
                            if(myOrder[i].status == 5){
                                // console.log(myOrder[i]);
                                myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                <p>剩余名额：${remainCount}人</p>
                                                <span>订单已取消</span>
                                            </div>
                                        </div>
                                        <div class='payMoneyPrice'>
                                            <span class='pq'>已取消</span>
                                        </div>
                                    </div>`
                            }
                        }
                    }
                    // 待付款
                    if(status === 1){
                        for (var i = 0; i < myOrder.length; i++){
                            console.log(myOrder[i]);
                            endTime = new Date(myOrder[i].course.endTime.replace(/-/g,'/')).getTime();
                            addTime = new Date(myOrder[i].course.addTime.replace(/-/g, '/')).getTime() + 86400000;
                            addTime1 = new Date(myOrder[i].addTime.replace(/-/g, '/')).getTime() + 86400000; 
                            oderAddtime = myOrder[i].addTime.substring(0, 10);
                            if(myOrder[i].course.numLimit>myOrder[i].course.numReported){
                                remainCount = myOrder[i].course.numLimit - myOrder[i].course.numReported;
                            }else{
                                remainCount ='报名人数已满!'
                            }
                            // addTime1 = addTime1.substring(0,10);
                            if(myOrder[i].status === 1){
                            id = myOrder[i].id;
                                myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                <p>剩余名额：${remainCount}人</p>
                                                <p id="count${id}">报名倒计时：</p>`;
                                function a(id, endTime) { //报名倒计时
                                    var countTime;
                                    countTime = count + id;
                                    countTime = setInterval(function(){
                                        date = new Date().getTime();
                                        timeType = parseInt(endTime - date);
                                        day = parseInt(timeType / 86400000);
                                        hours = parseInt(timeType/3600000%24);
                                        mins = parseInt((timeType-hours*3600000) / 60000%60);
                                        mins = mins < 10 ? '0' + mins : mins;
                                        s = parseInt((timeType - hours * 3600000 - mins * 60000) / 1000%60);
                                        s = s < 10 ? '0' + s : s;
                                        count = "报名倒计时："+day+'天&nbsp;'+hours+":"+mins+":"+s;
                                        $("#count" + id).html(count);
                                        if (hours <= 0 && mins <= 0 && s <= 0) {
                                            clearInterval(countTime);
                                            $("#count" + id).html('报名结束');
                                            // $('.payMoneyPrice' + id).html(`<span class='pq'>报名已结束</span>`);
                                        }
                                    },1000)
                                }
                                a(id, endTime);
                                myOrderDetails +=`                
                                                <span id="order${id}">订单取消倒计时：00:00:00</span>
                                            </div>
                                        </div>
                                        <div class='payMoneyPrice payMoneyPrice${id}'>`;
                                function b(id, addTime1) { //订单取消时间
                                    console.log(id);
                                    var orderTime;
                                    orderTime = orderTime + id;
                                    orderTime = setInterval(function (){
                                        date = new Date().getTime();//获取当前的时间
                                        timeType = parseInt(addTime1 - date);
                                        hours = parseInt(timeType/3600000);
                                        mins = parseInt((timeType-hours*3600000) / 60000);
                                        mins = mins < 10 ? '0' + mins : mins;
                                        s = parseInt((timeType - hours * 3600000 - mins * 60000) / 1000);
                                        s = s < 10 ? '0' + s : s;
                                        order = "订单取消倒计时" + hours + ":" + mins + ":" + s;
                                        $("#order" + id).html(order);
                                        if (hours <= 0 && mins <= 0 && s <= 0) {
                                            clearInterval(orderTime);
                                            $("#order" + id).html('已取消');
                                            $('.payMoneyPrice' + id).html(`<span class='pq'>已取消</span>`);
                                        }
                                    },1000)
                                }
                                b(id, addTime1);
                                // 教师账户
                                    if(userId == myOrder[i].userId && myOrder[i].payAnother == 1){
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <span class='pq'>等待代付</span>
                                            </div>
                                        </div>`
                                    }else if(userId != myOrder[i].userId && myOrder[i].payAnother == 1){
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                    <a onclick="codePay(${myOrder[i].id})">慷慨代付</a>
                                                </div>
                                            </div>`
                                    }else if(myOrder[i].payAnother == 2){
                                        
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                    <a  onclick="codePay(${myOrder[i].id})">立即支付</a>
                                                </div>
                                            </div>`
                                    }
                                }
                        }
                    }
                    // 已付款
                    if (status === 2) {
                        console.log(myOrder)
                        for (var i = 0; i < myOrder.length; i++){
                            oderAddtime = myOrder[i].addTime.substring(0, 10);
                            // 线下
                            if(myOrder[i].status === 2 && myOrder[i].course.way == 2){
                                console.log(myOrder[i]);
                                liveTime = myOrder[i].course.liveTime;
                                liveTime = liveTime;
                                if(myOrder[i].course.isGroupDiscount == -1){
                                    console.log(myOrder[i].course.isGroupDiscount);
                                    myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                <p>形式：线下</p>`
                                    if(myOrder[i].payType == 3){
                                        myOrderDetails += `<p>支付方式：堡币</p>`;
                                    }else if(myOrder[i].payType == 1){
                                        myOrderDetails += `<p>支付方式：微信</p>`;
                                    }
                                    myOrderDetails += `
                                                <span>开课时间：${liveTime}</span>
                                            </div>
                                        </div>
                                        <div class='payMoneyPrice'>`;
                                    if (isTeacher === 1) {
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                            </div>
                                        </div>`;
                                    } else if (isCooperation === 1) {
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                            </div>
                                        </div>`;
                                    } else if (myOrder[i].course.price) {
                                        myOrderDetails += `
                                        <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                            </div>
                                        </div>`;
                                    }
                                }else if(myOrder[i].course.isGroupDiscount == 1){
                                    console.log(myOrder[i].course.isGroupDiscount)
                                    myOrderDetails += `
                                        <div>
                                            <div class='massMsg'>
                                            <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                                <a onclick="massDetails(${myOrder[i].id})">修改团报信息</a>
                                            </div>
                                            <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                    <p>形式：线下 &nbsp; &nbsp; &nbsp; 团报：${myOrder[i].joinGroupNum}人</p>
                                                    <span>开课时间：${liveTime}</span>
                                                </div>
                                            </div>
                                            <div class='payMoneyPrice'>`;
                                            if (isTeacher === 1) {
                                                myOrderDetails += `
                                                <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                        <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                                    </div>
                                                </div>`;
                                            } else if (isCooperation === 1) {
                                                myOrderDetails += `
                                                <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                        <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                                    </div>
                                                </div>`;
                                            } else if (myOrder[i].course.price) {
                                                myOrderDetails += `
                                                <p>实付: <span>${myOrder[i].price}堡币</span></p>
                                                        <a onclick="codeGo(${myOrder[i].id})">查看劵码</a>
                                                    </div>
                                                </div>`;
                                            }
                                }
                            }
                            // 点播
                            // 点播
                            if(myOrder[i].status == 2 && myOrder[i].course.way == 0){
                                // console.log(myOrder[i]);
                                myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>
                                                <p>形式：点播</p>`;
                                if(myOrder[i].payType == 3){
                                    myOrderDetails += `<p>支付方式：堡币</p>`;
                                }else if(myOrder[i].payType == 1){
                                    myOrderDetails += `<p>支付方式：微信</p>`;
                                }
                                if (isTeacher === 1) {
                                    myOrderDetails += `
                                        </div>
                                            </div>
                                                <div class='payMoneyPrice'>
                                                <p>实付: <span>${myOrder[i].price}堡币</span></p>`;
                                } else if (isCooperation === 1) {
                                    myOrderDetails += `
                                    </div>
                                        </div>
                                            <div class='payMoneyPrice'>
                                            <p>实付: <span>${myOrder[i].price}堡币</span></p>`;
                                } else if (myOrder[i].course.price) {
                                    myOrderDetails += `
                                    </div>
                                        </div>
                                            <div class='payMoneyPrice'>
                                            <p>实付: <span>${myOrder[i].price}堡币</span></p>`;
                                }
                                if(userId == myOrder[i].userId && myOrder[i].payAnother == 1){
                                    myOrderDetails += `            
                                            <a onclick="courseDetails(${myOrder[i].course.id})">立即播放</a>
                                        </div>
                                    </div>`
                                }else if(userId != myOrder[i].userId && myOrder[i].payAnother == 1){
                                    myOrderDetails += `            
                                            <span class='pq'>已代付</span>
                                        </div>
                                    </div>`
                                }else if(myOrder[i].payAnother == 2){
                                    myOrderDetails += `            
                                            <a onclick="courseDetails(${myOrder[i].course.id})">立即播放</a>
                                        </div>
                                    </div>`
                                }
                            }
                        }
                    }
                    // 已取消
                    if(status === 5){
                        console.log(1212)
                        for (var i = 0; i < myOrder.length; i++){
                            oderAddtime = myOrder[i].addTime.substring(0, 10);
                            if(myOrder[i].course.numLimit>myOrder[i].course.numReported){
                                remainCount = myOrder[i].course.numLimit - myOrder[i].course.numReported;
                            }else{
                                remainCount ='报名人数已满!'
                            }
                            if(myOrder[i].status == 5){
                                // console.log(myOrder[i]);
                                myOrderDetails += `
                                    <div>
                                        <p>${oderAddtime} 订单号：${myOrder[i].code}</p>
                                        <div class='order' onclick="courseDetails(${myOrder[i].course.id})">
                                            <div>
                                                <img src="${myOrder[i].course.img4}">
                                            </div>
                                            <div>
                                                <h5>${myOrder[i].course.courseName}</h5>`;
                                myOrderDetails += `
                                                <p>剩余名额：${remainCount}人</p>`,
                                    myOrderDetails += `
                                                <span>订单已取消</span>
                                            </div>
                                        </div>
                                        <div class='payMoneyPrice'>
                                            <span class='pq'>已取消</span>
                                        </div>
                                    </div>`;
                            }
                        }
                    }
                    $('#myOrderDetails').html(myOrderDetails);
                    // $('#OrderBox1').hide();
            }
        },
        error: function (error){
            console.log(error);
        },
    })
 }
//  massDetails 修改团报信息
function massDetails(id){
    Tool.modalOpen('#mymodalUser');
    $.ajax({
        type: 'post',
        url: baseURL + 'system/signUp/getPartners',
        data: {orderFormId:id},
        success: function (res){
            var massData = res.rows;
            var massdataList = '';
            var id = '';
            var nameInput = '';
            console.log(massData);
            if(res.status == 200){
                for(var i=0;i<massData.length;i++){
                    id = massData[i].id;
                    massdataList += `
                        <div class='companionMsg'>
                            <div>同伴${i+1}</div>
                            <div>
                                <input type="text" placeholder="请输入姓名" id='nameInput${massData[i].id}' value='${massData[i].partnerName}'>
                            </div>
                            <p id = 'nameMsg' style='display:none'>请输入正确的姓名！</p>
                        </div>
                        <div class='companionMsg'>
                            <div></div>
                            <div>
                                <input type="text" placeholder="请输入手机号" id='phoneInput${massData[i].id}' value='${massData[i].partnerPhone}'>
                            </div>
                            <p id='phoneMsg' style='display:none'>请输入正确的手机号！</p>
                        </div>`;
                        console.log("#nameInput"+id)
                    }
                    $('#massdataList').html(massdataList);
                    var userInfo =[];
                    $('#btnClose').click(function(){
                        for(var i=0;i<massData.length;i++){
                            if (!$('#nameInput' + massData[i].id).val()) {
                                layer.msg('请输入同伴用户名');
                                return
                            } else { 
                                var checkName = $('#nameInput' + massData[i].id).val();
                                var checkPhone = $('#phoneInput' + massData[i].id).val();
    
                                var isCheckName = Tool.checkName(checkName, '#nameInput' + massData[i].id);//验证用户名
                                var isCheckPhone = Tool.checkPhone(checkPhone, '#phoneInput' + massData[i].id);//验证用户电话
                                if (!isCheckName) { 
                                    layer.msg('请正确填写伙伴姓名');
                                    return 
                                }
                                if (!isCheckPhone) { 
                                    layer.msg('请正确填写伙伴电话');
                                    return 
                                }
                            }
                            var obj = {};
                            obj.id=massData[i].id;
                            obj.partnerName = $('#nameInput' + massData[i].id).val();
                            obj.partnerPhone = $('#phoneInput' + massData[i].id).val();
                            userInfo.push(obj);
                            console.log(userInfo);
                        }
                        $.ajax({//发送同伴信息到后台保存起来
                            type: 'post',
                            url: upDatePartner,
                            data: {
                                partners:JSON.stringify(userInfo),
                            },
                            success: (res) => {
                                if (res.status === 200) { 
                                    console.log(res);
                                    Tool.modalClose('#mymodalUser');
                                    layer.msg('修改成功!')
                                }else{
                                    layer.msg('修改失败!')
                                }
                            },
                            error: (error) => { 
                                console.log(error);
                            },
                        })
                    })
            }
        },   
        error: function (error){
            console.log(error);
        },
    });
}
 // 跳转到支付
function codePay(code){
    window.location = "payment.html?shoppingId="+code;
}
// 跳转到详情
function courseDetails(id){
    window.location = "courseDetails.html?courseId="+id;
}
// 跳转到券码页
function codeGo(id){
    window.location = "code.html?shoppingId="+id;
}