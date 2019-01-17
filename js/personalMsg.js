
{/* <title>个人信息验证</title> */}
$(function () { 
    var shoppingId = search().shoppingId;
    pay.orderFormById(shoppingId)
        .then(res => {
            console.log(res.code)
            $.ajax({
                type: 'post',
                url: baseURL+'front/course/getCouponCodeInfo',
                data: {
                    code:res.code
                },
                success: function (res) {
                    console.log(res);
                    var { code, courseName, payTime,mechanismName,phone,userName,sex } = res.data;
                    var personalMsgHTML = '';
                    personalMsgHTML += `
                        <div class='personalBox'>
                            <div class='personal'>
                                <p>购买课程名：</p>
                                <p>${courseName}</p>
                            </div>
                            <div class='personal'>
                                <p>订单号：</p>
                                <p>${code}</p>
                            </div>
                            <div class='personal'>
                                <p>购买时间：</p>
                                <p>${payTime}</p>
                            </div>
                        </div>`;
                        // var userInfo = getUserInfo();
                        // console.log(getUserInfo())
                    // if (userInfo.isCooperation !== -1 || userInfo.isTeacher !== -1) { 
                        // console.log(getUserMechanism());
                        // var mechanism = getUserMechanism();
                        // var { mechanismName, customerName, customerPhone, sex} = mechanism;
                    personalMsgHTML += `
                                <div class='personalBox'>
                                    <div class='personal'>
                                        <p>机构信息：</p>
                                        <p>${mechanismName}</p>
                                    </div>
                                    <div class='personal'>
                                        <p>用户名：</p>
                                        <p>${userName}</p>
                                    </div>
                                    <div class='personal'>
                                        <p>手机号：</p>
                                        <p>${phone}</p>
                                    </div>
                                    <div class='personal'>
                                        <p>性别：</p>`;
                    if (sex === 1) {
                        personalMsgHTML += `<p>男</p>`;
                    } else if (sex === 2) {
                        personalMsgHTML += `<p>女</p>`;
                    } else { 
                        personalMsgHTML += `<p>保密</p>`;
                    }
                    personalMsgHTML += `
                                    </div>
                                </div>`;
                    // }
                    if (res.partners.length > 0) { 
                        personalMsgHTML += `
                                <div class='personalBox'>`;
                        for (var item of res.partners) { 
                            personalMsgHTML += `
                                    <div class='personal' style='border: none'>
                                        <p>携带同伴信息：</p>`;
                            if (item.partnerName.length === 2) {
                                personalMsgHTML += `
                                        <p>${item.partnerName.substring(0, 1)}${'&nbsp;&nbsp;&nbsp;'}${item.partnerName.substring(1,2)}:${item.partnerPhone}</p>
                                    </div>`;
                            } else { 
                                personalMsgHTML += `
                                            <p>${item.partnerName}:${item.partnerPhone}</p>
                                        </div>`;
                            }
                        personalMsgHTML += `
                                </div> `;
                        }
                    }
                    $('.personalMsg').html(personalMsgHTML);
                },
                error: function (error) {
                    console.log(error);
                 }
            })  
        })
        .catch(error => { 
            console.log(error);
        })
})