


var isCooperation;
var isTeacher;
if (getUserInfo()) { 
    var userInfo = getUserInfo();//获取用户信息
    isCooperation = userInfo.isCooperation;
    isTeacher = userInfo.isTeacher;
}
var userId = getUserId();

$(function(){
    $.ajax({
        type: 'post',
        url: myCoupons,
        data: {userId:userId},
        success: function (res){
            console.log(res);
            var dataCoupons = res.data;
            var myCouponsDetails = ''
            var endTime1 = '';
            var endTime = '';
            if(res.status == 200){
                // console.log(dataCoupons);
                if(dataCoupons.length>0){
                    for(var i=0;i<dataCoupons.length;i++){
                        endTime = dataCoupons[i].endTime;
                            endTime1 = endTime.substring(0,10);
                            console.log(endTime1);
                            // 可使用
                            if(dataCoupons[i].status === 1){
                                myCouponsDetails +=`
                                    <div  class="coupons">
                                        <div class="couponsPrice">
                                            <p>￥${dataCoupons[i].money}</p>
                                            <span>代金券</span>
                                        </div>
                                        <div class="couponsTime">
                                            <p>${dataCoupons[i].name}</p>`
                                myCouponsDetails +=`            
                                            <p>有效期至: ${endTime1}</p>`;
                                myCouponsDetails +=`
                                        </div>
                                        <div class="couponsBtn">
                                            <button onclick="goInstitutePoem()">立即使用</button>
                                        </div>
                                    </div>`;
                            }else if(dataCoupons[i].status === 2){//已使用
                                myCouponsDetails +=`
                                    <div  class="couponsCancel">
                                        <div class="CancelPrice">
                                            <p>￥${dataCoupons[i].money}</p>
                                            <span>代金券</span>
                                        </div>
                                        <div class="CancelTime">
                                            <p>${dataCoupons[i].name}</p>
                                            <p>有效期至:${endTime1}</p>
                                        </div>
                                        <div class="CancelBtn">
                                            <button>已使用</button>
                                        </div>
                                    </div>`
                            }else if(dataCoupons[i].status === 3){//已过期
                                myCouponsDetails +=`
                                    <div  class="couponsCancel">
                                        <div class="CancelPrice">
                                            <p>￥${dataCoupons[i].money}</p>
                                            <span>代金券</span>
                                        </div>
                                        <div class="CancelTime">
                                            <p>${dataCoupons[i].name}</p>
                                            <p>有效期至:${endTime1}</p>
                                        </div>
                                        <div class="CancelBtn">
                                            <button>已过期</button>
                                        </div>
                                    </div>`
                        }
                    
                    }
                    $("#myCouponsDetails").html(myCouponsDetails);
                }else{
                    $("#myCouponsDetails").hide();
                    $("#OrderBox1").show();
                }
            }
        },
        error: function (error){
            console.log(error);
        },
    })
})

