var afterInstitutePoemURL = search();
var userInfo = getUserInfo();//获取用户信息
console.log(userInfo)
if (userInfo) { 
    var { userName, id, rechargePrice, givePrice, phone, isCooperation, isTeacher,projectId } = userInfo;//对象解构 用户信息
}
$(function () { 
    if (getUserId()) { 
        location.href = 'afterInstitutePoem.html?userId=' + getUserId();
        return 
    }
    $.ajax({
        type: 'post',
        url: courseGetIndexCourse,
        data: {userId: -1},
        success: (res) => {
            console.log(res);
            var hotCourse = res.hotCourse;
            var famousTeacherCourse = res.famousTeacherCourse;
            var offlineCourse = res.offlineCourse;
            // 渲染热门课程
            var statusHotCourse = 0;//保存热门课程是否不是下架状态的课程 大于0为有
            for (var list of hotCourse) { 
                var { status } = list;
                if (status !== 2) { 
                    statusHotCourse += 1;
                }
            }
            if (statusHotCourse > 0) {// 有不是下架状态的课程 显示热门推荐 
                var htmlRecommended = `<p class='headings'><span>/</span> &nbsp; 热门推荐 &nbsp; <span>/</span></p>`;
            }
            for (var list of hotCourse) { 
                // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id  区间最低优惠价 区间最低优惠价 试用用户价格(公共价)
                var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, status } = list;
                if (status === 2) {

                } else { 
                        numReported = numReported ? numReported : 0;
                        htmlRecommended += `
                                        <div class='recommendedBox' onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                            <div class='recommendedbody'>
                                                <h6>${courseName}</h6>
                                                <p>讲师：${teacherName}</p>
                                                <div class='recommendedPrice'>
                                                    <div>`;
                        // 判断价格显示区间
                        if (minPrice && maxPrice) {
                            htmlRecommended += `<p>${minPrice}~${maxPrice}堡币</p>`;
                        } else if (trialUserPrice) {
                            htmlRecommended += `<p>${trialUserPrice}堡币</p>`;
                        } else if (price) {
                            htmlRecommended += `<p>${price}堡币</p>`;
                        }
                        htmlRecommended += `        </div>
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
                    // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id  区间最低优惠价 区间最低优惠价 试用用户价格(公共价)
                        var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, status } = famousTeacher[i];
                            numReported = numReported ? numReported : 0;
                            htmlFamousTeacher += `
                                    <!-- 偶数 -->
                                    <div class='developBox'>`;
                            htmlFamousTeacher += `
                                                <div class='develop' onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                                <div class='developImg'>
                                                    <img src="${img2}">
                                                </div>
                                                <div class='developIntro'>
                                                    <h4>${courseName}</h4>
                                                    <p class='teachName'>讲师：${teacherName}</p>`;
                            // 判断价格显示区间
                            if (minPrice && maxPrice) {
                                htmlFamousTeacher += `<span>${minPrice}~${maxPrice}堡币</span>`;
                            } else if (trialUserPrice) {
                                htmlFamousTeacher += `<span>${trialUserPrice}堡币</span>
                                                        <s>${price}堡币</s>`;
                            } else if (price) {
                                htmlFamousTeacher += `<span>${price}堡币</span>`;
                            }
                            // htmlFamousTeacher += `
                            //                     <span>199堡币</span>
                            htmlFamousTeacher += `
                                                <p class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                            </div>
                                        </div>`;
                        // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id  区间最低优惠价 区间最低优惠价 试用用户价格(公共价)
                        var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, status } = famousTeacher[i + 1];
                            numReported = numReported ? numReported : 0;
                            htmlFamousTeacher += `
                                        <div class='develop' onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                            <div class='developImg'>
                                                <img src="${img2}">
                                            </div>
                                            <div class='developIntro'>
                                                <h4>${courseName}</h4>
                                                <p class='teachName'>讲师：${teacherName}</p>`;
                            // 判断价格显示区间
                            if (minPrice && maxPrice) {
                                htmlFamousTeacher += `<span>${minPrice}~${maxPrice}堡币</span>`;
                            } else if (trialUserPrice) {
                                htmlFamousTeacher += `<span>${trialUserPrice}堡币</span>
                                <s>${price}堡币</s>`;
                            } else if (price) {
                                htmlFamousTeacher += `<span>${price}堡币</span>`;
                            }
                                                // <span>199堡币</span>
                                                // <s>${price}堡币</s>
                            htmlFamousTeacher += `
                                                <p class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                            </div>
                                        </div>
                                    </div>`;
                        
                    }
                } 
                // 判断数组中的课程是奇数还是偶数 奇数 最后的样式使用为此
                if (famousTeacher % 2 !== 0) { 
                    // 课程名称         教师名称    原价   课程简介  课程介绍       封面    报名人数  课程Id  是否普通注册用户  自营用户        自研用户
                    var { courseName, teacherName, price, summary, introduction, img2, numReported, id, isGeneralUser, isEcosphereUser, isSelfUser, minPrice, maxPrice, trialUserPrice, status } = famousTeacher[famousTeacher.length - 1];
                    if (status === 2) {//判断课程状态 => 是下架 => 不显示

                    } else {//判断课程状态 => 不是下架 =>显示
                        numReported = numReported ? numReported : 0;
                        htmlFamousTeacher += `
                                <!-- 奇数 -->
                                <div class='developOdd' onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                    <div class='developImg'>
                                        <img src="${img2}">
                                    </div>
                                    <div class='developIntro'>
                                        <h4>${courseName}</h4>
                                        <p class='teachName'>讲师：${teacherName}</p>`;
                        // 判断价格显示区间
                        if (minPrice && maxPrice) {
                            htmlFamousTeacher += `<span>${minPrice}~${maxPrice}堡币</span>`;
                        } else if (trialUserPrice) {
                            htmlFamousTeacher += `<span>${trialUserPrice}堡币</span>
                                                    <s>${price}堡币</s>`;
                        } else if (price) {
                            htmlFamousTeacher += `<span>${price}堡币</span>`;
                        }
                        htmlFamousTeacher += `
                                        <p style='margin:.3rem 0 0 0;display: block' class='countNmae'><img src="img/pome/jiang.png">&nbsp;${numReported}</p>
                                    </div>
                                </div>  `;
                    }
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
                       var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, status } = item;
                       if (status === 2) {

                       } else { 
                           numReported = numReported ? numReported : 0;
                           htmlOffline += `
                                    <div class='developOdd'  onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                        <div class='developImg'>
                                            <img src="${img2}">
                                        </div>
                                        <div class='developIntro'>
                                            <h4>${courseName}</h4>
                                            <p class='teachName'>讲师：${teacherName}</p>`;
                            // 判断价格显示区间
                            if (minPrice && maxPrice) {
                                htmlOffline += `<span>${minPrice}~${maxPrice}堡币</span>`;
                            } else if (trialUserPrice) {
                                htmlOffline += `<span>${trialUserPrice}堡币</span>
                                <s>${price}堡币</s>`;
                            } else if (price) {
                                htmlOffline += `<span>${price}堡币</span>`;
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
                    var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, status } = item;
                    if (status === 2) {

                    } else { 
                        numReported = numReported ? numReported : 0;
                         htmlOffline += `
                                 <div class='developOdd'  onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                     <div class='developImg'>
                                         <img src="${img2}">
                                     </div>
                                     <div class='developIntro'>
                                         <h4>${courseName}</h4>
                                         <p class='teachName'>讲师：${teacherName}</p>`;
                         // 判断价格显示区间
                         if (minPrice && maxPrice) {
                             htmlOffline += `<span>${minPrice}~${maxPrice}堡币</span>`;
                         } else if (trialUserPrice) {
                             htmlOffline += `<span>${trialUserPrice}堡币</span>
                             <s>${price}堡币</s>`;
                         } else if (price) {
                             htmlOffline += `<span>${price}堡币</span>`;
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
                    var { courseName, teacherName, price, summary, introduction, img2, numReported, id, minPrice, maxPrice, trialUserPrice, status } = item;
                    if (status === 2) {

                    } else { 
                        numReported = numReported ? numReported : 0;
                        htmlOffline += `
                                 <div class='developOdd'  onclick="handleGoToRouter('courseDetails.html?courseId=${id}')">
                                     <div class='developImg'>
                                         <img src="${img2}">
                                     </div>
                                     <div class='developIntro'>
                                         <h4>${courseName}</h4>
                                         <p class='teachName'>讲师：${teacherName}</p>`;
                         // 判断价格显示区间
                         if (minPrice && maxPrice) {
                         htmlOffline += `<span>${minPrice}~${maxPrice}堡币</span>`;
                         } else if (trialUserPrice) {
                             htmlOffline += `<span>${trialUserPrice}堡币</span>
                             <s>${price}堡币</s>`;
                         } else if (price) {
                             htmlOffline += `<span>${price}堡币</span>`;
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
        error: (error) => { console.log(error)
        },
    })
})
