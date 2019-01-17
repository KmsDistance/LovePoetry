var afterInstitutePoemURL = search();
var userInfo = getUserInfo();//获取用户信息
console.log(userInfo)
// if (!userInfo) { 
//     login('institutePoem');
// }
// 用户名   用户id  用户充值堡币  赠送堡币      电话      is校长        is教师      项目id
if (userInfo) {
    var { userName, id, rechargePrice, givePrice, phone, isCooperation, isTeacher, projectId } = userInfo;//对象解构 用户信息
 }
$(function () {
    if (!getOne()) { 
        Tool.modalOpen('#mymodalShare'); 
    }
    setOne('true');
    if (!getUserId()) { 
        location.href = 'institutePoem.html';
        return 
    }
    var userphone = phone.substring(0, 3) + '****' + phone.substring(7);
    var htmlUserInfo = `
            <li class="sidebar-brand">
                <img src="./img/pome/logo.png" style='width: 1rem;height: 1rem;position: static'>
                <span style='font-size: .4rem'>${userphone}</span>
            </li>
            <li class='remaining'>
                <span>剩余堡币 : ${rechargePrice}</span>
                <button onclick = "handleGoToRouter('topUp.html')">立即充值</button>
            </li>
            <li class='remaining1'>
                <span>赠送堡币 : ${givePrice}</span>
            </li>    `;
    $('#leftNav').prepend(htmlUserInfo);//渲染侧边栏导航
    $('.animated').html(//头部电话号码
                        `<img src="./img/pome/logo.png" style='margin-left:.2rem;width: 1rem;height: 1rem;position: static'>
                        <span style='font-size: .3rem'>${userphone}</span>
                        <p style='color:#fff;font-size: .45rem;display: inline-block;margin-left: 1.3rem'>艾诗学院</p>`); 
    // 渲染课程数据 famousTeacherCourse  //获取名师养成课程 
                //获取热门推荐课程
                // hotCourse 
                //获取线下班课程
                //   offlineCourse 
    
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
    $.ajax({
        type: 'post',
        url: courseGetIndexCourse,
        data: {userId: getUserId()},
        success: (res) => {
            console.log(res);
            var hotCourse = res.hotCourse;
            var famousTeacherCourse = res.famousTeacherCourse;
            var offlineCourse = res.offlineCourse;
            // 渲染热门课程
            var statuHotCourse = 0;//保存热门课程是否不是下架状态的课程 大于0为有
            for (var list of hotCourse) { 
                var { status } = list;
                if (status !== 2) { 
                    statuHotCourse += 1;
                }
            }
            if (statuHotCourse > 0) {// 有不是下架状态的课程 显示热门推荐 
                var htmlRecommended = `<p class='headings'><span>/</span> &nbsp; 热门推荐 &nbsp; <span>/</span></p>`;
            }
            for (var list of hotCourse) { 
                // 课程名称        教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id 区间最低优惠价 区间最低优惠价 试用用户价格(公共价)教师价格
                var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, teacherPrice, principalPrice, status } = list;
                if (status === 2) {//判断课程状态 => 是下架 => 不显示

                } else {//判断课程状态 => 不是下架 =>显示
                    numReported = numReported ? numReported : 0;
                    htmlRecommended += `
                                    <div class='recommendedBox'  onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                        <div class='recommendedbody'>
                                            <h6>${courseName}</h6>
                                            <p>讲师：${teacherName}</p>
                                            <div class='recommendedPrice'>`;
                    // 判断价格显示区间
                    // if (minPrice && maxPrice) {
                    //     htmlRecommended += `<p>${minPrice}~${maxPrice}堡币</p>`;
                    // } else 
                    if (isTeacher === 1 || isCooperation === 1) {
                        htmlRecommended += `<p>${teacherPrice}堡币</p>`;
                    } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                        htmlRecommended += `<p>${principalPrice}堡币</p>`;
                    } else if ((trialUserPrice >=0 )) { 
                        htmlRecommended += `<p>${trialUserPrice}堡币</p>`;
                    }
                    htmlRecommended += `
                                                <div>
                                                    <img src="img/pome/huang.png" style='width:.3rem'>
                                                    <span>${numReported}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class='recommendedImg'>
                                            <img src="${img2}">
                                        </div>
                                    </div>
                                    `;
                }
            }
            $('.recommended').html(htmlRecommended);
            //渲染名师养成
            var statusFamousTeacher = 0;//保存热门课程是否不是下架状态的课程 大于0为有
            for (var list of famousTeacherCourse) { 
                var { status } = list;
                if (status !== 2) { 
                    statusFamousTeacher += 1;
                }
            }
            if (statusFamousTeacher > 0) {// 有不是下架状态的课程 显示热门推荐 
                var htmlFamousTeacher = `
                    <p class='headings'><span>/</span> &nbsp; 名师养成 &nbsp; <span>/</span></p>`;
            }
            var famousTeacher = [];//保存所有名师养成课程状态不是下架的课
                for (var i = 0; i < famousTeacherCourse.length; i++) {
                    var { status } = famousTeacherCourse[i];
                    if (status !== 2) {
                        famousTeacher.push(famousTeacherCourse[i]);
                        }
                }
                // 循环课程 每次i+2 因为课程页面结构为左右结构 一次循环会循环两个课程 
            for (var i = 0; i < famousTeacher.length; i += 2) { 
                    if (famousTeacher.length >1) { 
                    // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id  区间最低优惠价 区间最低优惠价 试用用户价格(公共价) 是否报名
                        var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, isSignUp, teacherPrice, principalPrice, status } = famousTeacher[i];

                        numReported = numReported ? numReported : 0;
                        htmlFamousTeacher += `
                                <!-- 偶数 -->
                                <div class='developBox'>`;
                        htmlFamousTeacher += `
                                            <div class='develop' onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                            <div class='developImg'>`;
                        if (isSignUp > 0) { 
                            htmlFamousTeacher += ` <img src="img/pome/baoming.png" class='baoming'>`;
                        }
                        htmlFamousTeacher += `
                                                <img src="${img2}">
                                            </div>
                                            <div class='developIntro'>
                                                <h4>${courseName}</h4>
                                                <p class='teachName'>讲师：${teacherName}</p>`;
                        // 判断价格显示区间
                        if (isTeacher === 1 || isCooperation === 1) {// 显示自研用户价格
                            console.log('自研用户');
                            htmlFamousTeacher += `<span>${teacherPrice}堡币</span>
                                                            <s>${price}堡币</s>`;
                        } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                            console.log('生态圈用户');
                            htmlFamousTeacher += `<span>${principalPrice}堡币</span>
                                                    <s>${price}堡币</s>`;
                        } else if (trialUserPrice >=0 ) {
                            console.log('普通用户');
                            htmlFamousTeacher += `<span>${trialUserPrice}堡币</span><s>${price}堡币</s>`;
                        }
                        // htmlFamousTeacher += `
                        //                     <span>199堡币</span>
                        htmlFamousTeacher += `
                                            <p class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                        </div>
                                    </div>`;
                        // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id  区间最低优惠价 区间最低优惠价 试用用户价格(公共价)
                        var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, isSignUp, teacherPrice, principalPrice, status } = famousTeacher[i + 1];
                        numReported = numReported ? numReported : 0;
                        htmlFamousTeacher += `
                                    <div class='develop' onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                        <div class='developImg'>`;
                        if (isSignUp >0) { 
                            htmlFamousTeacher += ` <img src="img/pome/baoming.png" class='baoming'>`;
                        }
                        htmlFamousTeacher += `
                                            <img src="${img2}">
                                        </div>
                                        <div class='developIntro'>
                                            <h4>${courseName}</h4>
                                            <p class='teachName'>讲师：${teacherName}</p>`;
                        // 判断价格显示区间
                        if (isTeacher === 1 || isCooperation === 1) {
                            console.log('自研用户');
                            htmlFamousTeacher += `<span>${teacherPrice}堡币</span>
                                                            <s>${price}堡币</s>`;
                        } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                            console.log('生态圈用户');
                            htmlFamousTeacher += `<span>${principalPrice}堡币</span>
                                                    <s>${price}堡币</s>`;
                        } else if ((trialUserPrice >=0 )) {
                            console.log('普通用户');
                            htmlFamousTeacher += `<span>${trialUserPrice}堡币</span><s>${price}堡币</s>`;
                        }
                        htmlFamousTeacher += `
                                            <p class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                        </div>
                                    </div>
                                </div>`;
                    }
                }
                // 判断数组中的课程是奇数还是偶数 奇数 最后的样式使用为此
                if (famousTeacher.length % 2 !== 0) { 
                    // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id  是否普通注册用户  自营用户        自研用户
                    var { courseName, teacherName, price, summary, introduction, img2, numReported, id, isGeneralUser, isEcosphereUser, isSelfUser, minPrice, maxPrice, trialUserPrice, isSignUp, teacherPrice, principalPrice, status } = famousTeacher[famousTeacher.length - 1];
                    numReported = numReported ? numReported : 0;
                    htmlFamousTeacher += `
                            <!-- 奇数 -->
                            <div class='developOdd' onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                <div class='developImg'>`;
                    if (isSignUp > 0) { 
                        htmlFamousTeacher += ` <img src="img/pome/baoming.png" class='baoming'>`;
                    }
                    htmlFamousTeacher += `
                                    <img src="${img2}">
                                </div>
                                <div class='developIntro'>
                                    <h4>${courseName}</h4>
                                    <p class='teachName'>讲师：${teacherName}</p>`;
                    // 判断价格显示区间
                    if (isTeacher === 1 || isCooperation === 1) {
                        htmlFamousTeacher += `<span>${teacherPrice}堡币</span>
                                                        <s>${price}堡币</s>`;
                    } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                        htmlFamousTeacher += `<span>${principalPrice}堡币</span>
                                                <s>${price}堡币</s>`;
                    } else if ((trialUserPrice >=0 )) {
                        htmlFamousTeacher += `<span>${trialUserPrice}堡币</span><s>${price}堡币</s>`;
                    }
                    htmlFamousTeacher += `
                                    <p style='margin:.3rem 0 0 0;display: block' class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                </div>
                            </div>  `;
                }
                $('.famousTeacher').html(htmlFamousTeacher);
            // 渲染线下课程
            var htmlOffline = `<p class='headings'><span>/</span> &nbsp; 线下课程 &nbsp; <span>/</span></p>`;
            var statuinternal = 0;//保存内部课程是否不是下架状态的课程 大于0为有
            for (var list of offlineCourse) { 
                if (list.offlineLabel === 1) { //是内部课程
                    var { status } = list;
                    if (status !== 2) { 
                        statuinternal += 1;
                    }
                }
            }
            if (statuinternal > 0) {// 有不是下架状态的课程 显示热门推荐 
                 htmlOffline += `
                        <div class='levelTitle'>
                            <h4>内部</h4>
                        </div>`;
            }
                for (var item of offlineCourse) { 
                   if (item.offlineLabel === 1) { 
                         // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id
                       var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, isSignUp, teacherPrice, principalPrice, status } = item;
                       if (status === 2) {//判断课程状态 => 是下架 => 不显示

                       } else {//判断课程状态 => 不是下架 =>显示
                        numReported = numReported ? numReported : 0;
                        htmlOffline += `
                                 <div class='developOdd'  onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                     <div class='developImg'>`;
                         if (isSignUp > 0) { 
                             htmlOffline += ` <img src="img/pome/baoming.png" class='baoming'>`;
                         }
                         htmlOffline += `
                                         <img src="${img2}">
                                     </div>
                                     <div class='developIntro'>
                                         <h4>${courseName}</h4>
                                         <p class='teachName'>讲师：${teacherName}</p>`;
                         // 判断价格显示区间
                         if (isTeacher === 1 || isCooperation === 1) {
                             htmlOffline += `<span>${teacherPrice}堡币</span>
                                                             <s>${price}堡币</s>`;
                         } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                             htmlOffline += `<span>${principalPrice}堡币</span>
                                                     <s>${price}堡币</s>`;
                         } else if ((trialUserPrice >=0 )) {
                             htmlOffline += `<span>${trialUserPrice}堡币</span><s>${price}堡币</s>`;
                         }
                        htmlOffline +=`
                                         <p style='margin:.3rem 0 0 0;display: block' class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                     </div>
                                 </div>`;
                       }
                    }
            }
            var statuexternal = 0;//保存外部课程是否不是下架状态的课程 大于0为有
            for (var list of offlineCourse) { 
                if (list.offlineLabel === 2) { //是外部课程
                    var { status } = list;
                    if (status !== 2) { 
                        statuexternal += 1;
                    }
                }
            }
            if (statuexternal > 0) {// 有不是下架状态的课程 显示外部 
                htmlOffline += `
                    <div class='levelTitle'>
                        <h4>外部</h4>
                    </div>`;
            }
                for (var item of offlineCourse) { 
                    if (item.offlineLabel === 2) { 
                            // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id
                        var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, isSignUp, teacherPrice, principalPrice, status } = item;
                        if (status === 2) {//判断课程状态 => 是下架 => 不显示

                        } else {//判断课程状态 => 不是下架 =>显示
                            numReported = numReported ? numReported : 0;
                            htmlOffline += `
                                    <div class='developOdd'  onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                        <div class='developImg'>`;
                            if (isSignUp > 0) { 
                                htmlOffline += ` <img src="img/pome/baoming.png" class='baoming'>`;
                            }
                            htmlOffline += `
                                            <img src="${img2}">
                                        </div>
                                        <div class='developIntro'>
                                            <h4>${courseName}</h4>
                                            <p class='teachName'>讲师：${teacherName}</p>`;
                            // 判断价格显示区间
                            if (isTeacher === 1 || isCooperation === 1) {
                                htmlOffline += `<span>${teacherPrice}堡币</span>
                                                                <s>${price}堡币</s>`;
                            } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                                htmlOffline += `<span>${principalPrice}堡币</span>
                                                        <s>${price}堡币</s>`;
                            } else if ((trialUserPrice >=0 )) {
                                htmlOffline += `<span>${trialUserPrice}堡币</span><s>${price}堡币</s>`;
                            }
                            htmlOffline +=`
                                            <p style='margin:.3rem 0 0 0;display: block' class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                        </div>
                                    </div>`;
                        }
                    }
            }
            var statuMerchants  = 0;//保存招商会课程是否不是下架状态的课程 大于0为有
            for (var list of offlineCourse) { 
                if (list.offlineLabel === 3) { //是招商会
                    var { status } = list;
                    if (status !== 2) { 
                        statuMerchants += 1;
                    }
                }
            }
            if (statuMerchants > 0) {// 有不是下架状态的课程 显示招商会 
                htmlOffline += `
                    <div class='levelTitle'>
                        <h4>招商会</h4>
                    </div>`;
            }
                for (var item of offlineCourse) { 
                    if (item.offlineLabel === 3) { 
                        // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id
                        var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, isSignUp, teacherPrice, principalPrice, status } = item;
                        if (status === 2) {//判断课程状态 => 是下架 => 不显示

                        } else {//判断课程状态 => 不是下架 =>显示
        
                            numReported = numReported ? numReported : 0;
                            htmlOffline += `
                                    <div class='developOdd'  onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                        <div class='developImg'>`;
                            if (isSignUp > 0) { 
                                htmlOffline += ` <img src="img/pome/baoming.png" class='baoming'>`;
                            }
                             htmlOffline += `
                                            <img src="${img2}">
                                        </div>
                                        <div class='developIntro'>
                                            <h4>${courseName}</h4>
                                            <p class='teachName'>讲师：${teacherName}</p>`;
                            // 判断价格显示区间
                            if (isTeacher === 1 || isCooperation === 1) {
                                htmlOffline += `<span>${teacherPrice}堡币</span>
                                                                <s>${price}堡币</s>`;
                            } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                                htmlOffline += `<span>${principalPrice}堡币</span>
                                                        <s>${price}堡币</s>`;
                            } else if ((trialUserPrice >=0 )) {
                                htmlOffline += `<span>${trialUserPrice}堡币</span> <s>${price}堡币</s>`;
                            }
                            htmlOffline +=`
                                            <p style='margin:.3rem 0 0 0;display: block' class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                        </div>
                                    </div>`;
                        }
                    }
                }
            $('.offline').html(htmlOffline);
        },
        error: (error) => { 
        },
    })
})
