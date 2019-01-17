// const courseGetBdiId = baseURL + '/front/course/getById';              //id= 11 根据课程id获取课程详细信息
// 课程信息详情页
var courseId = search().courseId;
// console.log(courseId);
if (getUserInfo()) { 
    var userInfo = getUserInfo();//获取用户信息
}
var userId;
if (getUserId()) {
    userId = getUserId();
} else { 
    userId = -1;
}
$(function () { 
    $.ajax({//获取课程信息
        type: 'post',
        url: courseGetById,
        data: { courseId: courseId, userId: userId },
        success: (res) => {
            // console.log(res);
            var rows = res.rows; //课程详情的在里面
            var courseLabelList = res.courseLabelList;//课程拓展属性
            var groupOfferList = res.groupOfferList;//团报
            var classTimesList = res.classTimesList//系列课次
            var likeNumber = rows.likeNum;
            if (res.status === 200) {
                setCourseInfo(res);
                var html = '';
                if (res.isMyLike === -1) {//判断用户是否点赞了 没有点赞
                    html += `
                         <div class='giveLike CourseGiveLike' style='margin-left: 5.5rem' onclick="handleCourseGiveLike('.CourseGiveLike',${res.rows.id},${likeNumber})">
                            <img src="img/pome/dz1.png">
                            <img src="img/pome/dz2.png" class="display-none">
                            <span id="linkNumber">${likeNumber}</span>
                        </div>
                        `;
                } else { 
                    html += `
                        <div class='giveLike' style='margin-left: 5.5rem'>
                            <img src="img/pome/dz1.png"  class="display-none">
                            <img src="img/pome/dz2.png">
                            <span>${likeNumber}</span>
                        </div>
                        `;
                };
                if (res.isMyCollection === -1) {//判断用户是否收藏了 没有收藏
                    html += `
                    <div class='giveLike CourseCollect' onclick="handleCourseGiveLike('.CourseCollect',${res.rows.id})">
                        <img src="img/pome/sc1.png">
                        <img src="img/pome/sc2.png" class="display-none">
                        <span>收藏</span>
                    </div>
                    `;
                } else {                    //判断用户是否收藏了 收藏了
                    html += `
                    <div class='giveLike CourseCollect' onclick="handleCourseGiveLike('.CourseCollect',${res.rows.id})">
                        <img src="img/pome/sc1.png" class="display-none">
                        <img src="img/pome/sc2.png">
                        <span>收藏</span>
                    </div>
                    `;
                }
                html += `
                    <div class='giveLike comments-html-icon' onclick="handleChangeActiveContent('.comments')" >
                        <img src="img/pome/pl1.png">
                        <span></span>
                    </div>`;
                $('.giveLikeBox').html(html);//渲染点赞 收藏 评论
                // 加载评论内容
                $.ajax({//获取评论信息的条数
                    type: 'post',
                    url: myCommentGetCommentList,
                    data: { courseId: res.rows.id, userId: userId},
                    success: (res) => {
                        // console.log(res);
                        $('.comments-html').html(`<span >评论(${res.rows.length})</span>`);
                        $('.comments-html-icon').html(`<img src="img/pome/pl1.png">
                                                        <span>${res.rows.length}</span>`);
                    },
                    error: (error) => {
                        console.log(error)
                    }
                }); 
                getCourseDetails(res);//渲染课程详情
                bulkHTML = '';//保存报名人数 价格
                console.log(groupOfferList)
                for (var bulkList of groupOfferList) { //渲染立即报名团购
                    var {peopleNum, offerPrice , principalOfferPrice, teacherOfferPrice, trialUserOfferPrice } = bulkList;
                    bulkHTML += `
                        <div class='active priceOne' onclick="signUp.handleGetPrice(${peopleNum},${offerPrice})">
                            <img src="img/pome/1r.png" style='width: .5rem;'>
                            <span>${peopleNum}人价</span>`;
                    if (getUserId()) { //判断是否登录了 登录了根据角色渲染角色价格
                        if (userInfo.isCooperation === 1 || userInfo.isTeacher === 1) {//如果是校长用户
                            bulkHTML += `
                                <span>${teacherOfferPrice}堡币</span>`;
                            console.log('校长用户');
                        } else if (getUserPermissions()  && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1)) {
                            bulkHTML += `
                                <span>${principalOfferPrice}堡币</span>`;
                            console.log('教师用户');
                        } else if ((userInfo.isCooperation === -1 && userInfo.isTeacher === -1)&& !getUserPermissions()) {
                            bulkHTML += `
                                <span>${trialUserOfferPrice}堡币</span>`;
                            console.log('普通用户');
                        }
                    }
                    // <span>${offerPrice}堡币</span>
                    bulkHTML += `
                            <img src="img/pome/gou1.png" class="display-none">
                        </div>
                    `;
                }
                $('#bulkList').html(bulkHTML);
                if (classTimesList.length > 0) { 
                    if (getUserId()) {//判断用户登录 使用videoPlay 
                        $('#videoButton').html(`<img onclick="Video.videoPlay('${classTimesList[0].resourceUrl}', ${courseId} ,${classTimesList[0].id},${rows.isSignUp}, ${classTimesList[0].cost},${classTimesList[0].duration})" src="img/12113.png" alt="">`);
                    } else { //判断用户登录 使用isPlay
                        $('#videoButton').html(`<img onclick="Video.isPlay('${classTimesList[0].resourceUrl}', ${courseId} ,${classTimesList[0].id},${rows.isSignUp}, ${classTimesList[0].cost},${classTimesList[0].duration})" src="img/12113.png" alt="">`);
                    }
                }
                if(res.rows.cost == 1){
                    $(".btn").html('立即报名');
                }else if(res.rows.cost == -1){
                    $('.btn').html('免费课程');
                }
            }
            // $('#videoButton').click(function () { //点击立即播放按钮 没有系列课弹出提示
            //     if (classTimesList.length === 0) { 
            //         layer.msg('课程即将呈现，敬请期待');
            //     }
            // })
        },
        error: (error) => {
            console.log(error)
        }
    });

    $('.lessonDetailsTitle').on( 'click', 'div', function () { //点击课程详情 讲师介绍 评论 切换高亮显示
        $(this).addClass('active').siblings().removeClass('active');
    })
    $('.courseListVideo').on('click', 'p', function () { //点击系列课程 标题高亮显示
        $('.courseListVideo li p').removeClass('active');
        $(this).addClass('active');
    })
    $('#bulkList').on('click', 'div', function () { //点击切换选择团报的人数价格
        $(this).children('img:last-child').removeClass('display-none');
        $(this).siblings().children('img:last-child').addClass('display-none');
    })

    $('.title').click(function () { //头部课程详情后退一页 
        history.go(-1);
    })
})

function handleChangeActiveContent(header) { //点击课程详情 讲师介绍 评论 切换主要内容 details introduce comments
    $('#courseContent ' + header).removeClass('display-none').siblings().addClass('display-none');
    // if (header === '.details') { //获取课程详细信息
    if (header === '#courseDetails') { //获取课程详细信息
        var courseInfo = getCourseInfo();
        getCourseDetails(courseInfo);
    } else if (header === '.introduce') { //获取讲师信息 
        var courseInfo = getCourseInfo();
        $.ajax({
            type: 'post',
            url: teacherGetById,
            data: { id: courseInfo.rows.teacherId },
            success: (res) => {
                // console.log(res);
                var data = res.rows;
                var html = `
                    <div>
                        <img src="${data.teacherImg}">
                    </div>
                    <div class='introContent'>
                        <h5>${data.teacherName}</h5>
                        ${data.teacherIntroduction}
                    </div>
                        `;
                $('.courseIntro').html(html);
            },
            error: (error) => { 
                console.log(error);
             }
        })
    } else if (header === '.comments') { //获取课程评论信息
        getComments();
    }
}

function handleCourseGiveLike(name, id, linkNum) { //课程点赞 收藏
    if (name === '.CourseGiveLike') {//点赞
        if (getUserId()) {
            $.ajax({
                type: 'post',
                url: myLikeSave,
                data: { userId: getUserId(), courseId: id },
                success: (res) => {
                    console.log(res);
                    if (res.status === 200) { 
                        $('#linkNumber').html(`${linkNum + 1}`);
                        $(name + ' img:first-child').addClass('display-none').siblings().removeClass('display-none');
                        layer.msg('点赞成功');
                    }
                },
                error: (error) => {
                    console.log(error)
                }
            })
        } else { 
            handleMymodalLogin('courseDetails');//调用登录弹框
        }
    } else if (name === '.CourseCollect') { //收藏
        if ($(name + ' img:first-child').hasClass('display-none')) {//判断用户是否收藏了   收藏了  取消收藏
            if (getUserId()) {
                $.ajax({
                    type: 'post',
                    url: myCollectionSave,
                    data: { userId: getUserId(), courseId: id },
                    success: (res) => {
                        console.log(res);
                        if (res.status === 200) { 
                            $(name + ' img:first-child').removeClass('display-none').next().addClass('display-none');
                        }
                    },
                    error: (error) => {
                        console.log(error)
                    }
                })
            } else { 
                handleMymodalLogin('courseDetails');//调用登录弹框
            }
        } else {        //判断用户是否收藏了   没有收藏  加入我的收藏
            if (getUserId()) {
                $.ajax({
                    type: 'post',
                    url: myCollectionSave,
                    data: { userId: getUserId(), courseId: id },
                    success: (res) => {
                        console.log(res);

                        if (res.status === 200) { 
                            $(name + ' img:first-child').addClass('display-none').siblings().removeClass('display-none');
                            layer.msg('收藏成功');
                        }
                    },
                    error: (error) => {
                        console.log(error)
                    }
                })
            } else { 
                handleMymodalLogin('courseDetails');//调用登录弹框
            }
        }
    }
}

// 无权购买弹框
function handleMymodal(){
    $("#mymodal").modal("toggle");
}
function handleClose(){
    $("#mymodal").modal("toggle").hide();
}
//    三人价
function handleClose1(){
    $("#mymodal1").modal("toggle").hide();
}
//    同伴信息
function handleMymodal2(){
    $("#mymodal2").modal("toggle");
    $("#mymodal1").modal("toggle").hide();
}
function handleClose2(){
    $("#mymodal2").modal("toggle").hide();
}
function handleShow() { //点击展开更多
    $('.LineM').addClass('display-none');
    $('.LineL').removeClass('display-none');
    $('.courseListVideo li').removeClass('display-none');


}
function handleHide() { //点击内容收起
    $('.LineM').removeClass('display-none');
    $('.LineL').addClass('display-none');
    $('.courseListVideo li:gt(4)').addClass('display-none');
}   
// 发表评论
function published() { 
    var published = $('#published').val();//获取评论内容
    if (getUserId()) {//判断是否含有用户id 有发送评论
        $.ajax({
            type: 'post',
            url: myCommentSave,
            data: {
                userId: userId,
                phone: userInfo.phone,
                courseId: courseId,
                content: published,
            },
            success: function (res) {
                if (res.status == 200) {
                    layer.msg('感谢参与！您的评论已提交审核');
                    $('#published').val('');
                    getComments();//获取评论 渲染数据
                }
            },
            error: function (error) {
                console.log(error);
            }
        })
    } else { //判断是否含有用户id 没有弹出登录框
        handleMymodalLogin('courseDetails');//调用登录弹框
    }
}
function handleGiveLike(id,num,myCommentId) {//评论点赞 
    $('.GiveLike' + id).children('img:first-child').removeClass('display-none').next().addClass('display-none');
    $.ajax({
        type: 'post',
        url: saveMyCommentLike,
        data: {
            userId: userId,
            myCommentId: id
        },
        success: function (res) {
            // console.log(res);
            $('#praise' + myCommentId).html(`${num + 1}`);
         },
        error: function (error) { },
    })
}
// 获取评论 渲染数据
function getComments() { 
    $('.lessonDetailsTitle div').removeClass('active');
    $('.lessonDetailsTitle div:last-child').addClass('active');
    var courseInfo = getCourseInfo();
    $.ajax({//获取评论信息
        type: 'post',
        url: myCommentGetCommentList,
        data: { courseId: courseId, userId: userId },
        success: (res) => { 
            // console.log(res)
            var html = `
                    <div class='published'>
                        <div>
                            <textarea placeholder="我来说几句..." id="published"></textarea>
                        </div>
                        <button onclick = "published()" >发表</button>
                    </div>
                    <h4>全部热评</h4> 
            `;
            for (var item of res.rows) { 
                var {portraitUrl, userName, content, likeNum, status,myCommentId, phone, isLike} = item;//头像 名字 评论内容 点赞数 状态
                html += `
                    <div class='commentsBox'>
                        <div class='commentsContent'>
                            <div class='headPortrait'>`;
                if (portraitUrl) { 
                    html += `
                         <img src="${portraitUrl}" >`;
                } else {
                    // var sum = parseInt(Math.random() * (6 - 1 + 1) + 1);
                    html += `
                        <img src="img/pome/pic3.png">`;
                }
                var userphone = phone.substring(0, 3) + '****' + phone.substring(7);
                html += `
                                <p>${userphone}</p>
                            </div>
                            <div class='greatNumber active GiveLike${myCommentId}' onclick = "handleGiveLike(${myCommentId},${likeNum},${myCommentId})">`;
                if (isLike >0 ) {
                    html += `
                            <img src="img/pome/1.png" >
                            <img src="img/pome/2.png" class="display-none">`
                } else if (isLike == 0) { 
                    html += `
                        <img src="img/pome/1.png" class="display-none">
                        <img src="img/pome/2.png" >`;
                }
                html += `
                            <span id="praise${myCommentId}">${likeNum}</span>
                            </div>
                        </div>
                        <p>${content}</p>
                    </div>
                `;
            }
            $('.comments').html(html);
        },
        error: (error) => { 
            console.log(error)
        }
    })
}
// 课程详情 数据渲染
function getCourseDetails(courseInfo) { 
            // 课程名称    课程id 课程简介 普通用户 1 2否   生态圈用户 1 2否  自研用户    
            var { courseName, id, summary, isGeneralUser, isEcosphereUser, isSelfUser,
            // 合伙人用户    使用优惠券 1 -1 所属项目id 内训 0 1   原价    试用用户价        校长价        教师价
                isPartnerUser, isCoupon, projectId, training,price, trialUserPrice, principalPrice, teacherPrice,
            //课程 直播/上架/开课 时间  课时 报名人数限制 已报名人数 报名开始时间 报名结束时间 课程状态  * -1、未开始 1、进行 2、下架 是否报名0 1
                liveTime, period, numLimit, numReported, startTime, endTime, status, isSignUp,
                //团报优惠      是否可以团报   课程简介         封面  形式
                groupDiscount, isGroupDiscount, introduction, img2, way,minPrice, maxPrice,
                } = courseInfo.rows;
                // console.log(courseInfo);
                Tool.toolCountdown(endTime);
                var courseLabelList = courseInfo.courseLabelList;//课程拓展属性
                var groupOfferList = courseInfo.groupOfferList;//团报
                var classTimesList = courseInfo.classTimesList//系列课次

            var courseDetailsHTML = '';
            courseDetailsHTML += `
                    <!-- 课程详情内容 -->
                    <div class="details">
                        <!-- 课程名称 -->
                        <div class='lessonName'>
                            <h4>${courseName}</h4>
                            <p>${summary}</p>
                        </div>
                        <!-- 价格 -->
                        <div class="lessonPrice">`;
            if (getUserId()) {//判断是否登陆 登录显示对应的价格
                if (userInfo.isTeacher === 1 || userInfo.isCooperation === 1) {//如果是自研用户
                    courseDetailsHTML += `
                            <span>${teacherPrice}</span>堡币
                            <s> ${price} </s>`;
                    // console.log('校长用户');
                } else if (getUserPermissions() && (userInfo.isCooperation === -1 && userInfo.isTeacher === -1) ) {
                    courseDetailsHTML += `
                            <span>${principalPrice}</span>堡币
                            <s> ${price} </s>`;
                    // console.log('教师用户');
                } else if ((userInfo.isCooperation === -1 && userInfo.isTeacher === -1)&& !getUserPermissions()) {
                    courseDetailsHTML += `
                            <span>${trialUserOfferPrice}</span>堡币
                            <s> ${price} </s>`;
                    // console.log('普通用户');
                }
            } else { //判断是否登陆 没有登录显示区间价格
                courseDetailsHTML += `
                <span>${minPrice}</span>
                <span>~${maxPrice}</span>堡币`;
            }
            if (endTime) { courseDetailsHTML += `<p id="endTime"></p>
                                <span id="ending"></span>`;}
            courseDetailsHTML += `
                    </div>
                    <!-- 重要标签 -->
                    <div class="importantTag">
                        <div class='class'>
                            <span>课时: &nbsp;${period}</span>
                        </div>
                        <div class='class'>
                            <span>开课时间:  &nbsp;${liveTime.substring(0, 10)}</span>
                        </div>`;
                        if(numLimit == 0){
                            courseDetailsHTML += ``;
                        }else{
                            courseDetailsHTML += `            
                                <div class='class'>
                                    <span>限制报名人数: &nbsp;${numLimit}人</span>
                                </div>`;
                        }
            courseDetailsHTML += `
                        <div class='class'>
                            <span>剩余名额: &nbsp;${numLimit - numReported}人</span>
                        </div>
                        <div class='class'>
                            <span>已报名人数:${numReported}人</span>
                        </div>`;
            if (courseLabelList.length > 0) {//渲染扩展属性
                // 标签         内容
                for (var list of courseLabelList) { 
                    var {labelName, content } = list;
                    // console.log(courseLabelList)
                    courseDetailsHTML += `
                    <div class='class'>
                        <span>${labelName}:${content}</span>
                    </div>`;
                }
            }
    courseDetailsHTML += `</div>`;
            if (way !== 2) { //判断 是不是线下的 不是线下的
                courseDetailsHTML += `
                        <!-- 系列课程 -->
                        <div class='seriesCourses'>
                            <div class='seriesTitle'>
                                <h4>系列课程</h4>
                            </div>
                            <ul class="courseListVideo">`;
                        for (var item = 0; item < classTimesList.length; item++) { 
                                // <p  class='active'>${item.orderNum}.${item.classTimesName}</p>
                            // var {resourceUrl, orderNum, classTimesName, } = item

                            console.log(classTimesList[item].duration);
                            if (!getUserId()) {//判断你是否登录 没有登录 系列课第一节 试看 其他弹出登录
                                if (item === 0) {
                                    courseDetailsHTML += `
                                    <li onclick="Video.isPlay('${classTimesList[item].resourceUrl}',${id},${classTimesList[item].id}, ${isSignUp},${classTimesList[item].duration}, 0)">
                                        <img src="img/pome/bofang.png">
                                        <p>${classTimesList[item].orderNum}.${classTimesList[item].classTimesName}</p><p class="active">试看</p>
                                        <input type="hidden" value="${classTimesList[item].resourceUrl}">
                                    </li>`;
                                } else { 
                                    courseDetailsHTML += `
                                    <li onclick="Video.isPlay('${classTimesList[item].resourceUrl}',${id},${classTimesList[item].id}, ${isSignUp},${classTimesList[item].duration},1)">
                                        <img src="img/pome/bofang.png">
                                        <p>${classTimesList[item].orderNum}.${classTimesList[item].classTimesName}</p><p class="active"></p>
                                        <input type="hidden" value="${classTimesList[item].resourceUrl}">
                                    </li>`;
                                }
                            } else { //判断是否登录 有登录 没有购买 系列课第一二三节 免费 其他弹出登录购买
                                if (item < 5) {//判断 显示更多的 展示更多
                                    // console.log(classTimesList[item].cost);
                                    if (item < 3) {//判断有没有登录 没有登录
                                        courseDetailsHTML += `
                                                                         
                                            <li onclick="Video.videoPlay('${classTimesList[item].resourceUrl}',${id},${classTimesList[item].id}, ${isSignUp},${classTimesList[item].cost})">
                                                <img src="img/pome/bofang.png">
                                                <p>${classTimesList[item].orderNum}.${classTimesList[item].classTimesName}</p>
                                                <input type="hidden" value="${classTimesList[item].resourceUrl}">
                                            </li>`;
                                    } else { 
                                        courseDetailsHTML += `
                                            <li onclick="Video.videoPlay('${classTimesList[item].resourceUrl}',${id},${classTimesList[item].id}, ${isSignUp},${classTimesList[item].cost})">
                                                <img src="img/pome/bofang.png">
                                                <p>${classTimesList[item].orderNum}.${classTimesList[item].classTimesName}</p>
                                                <input type="hidden" value="${classTimesList[item].resourceUrl}">
                                            </li>`;
                                    }
                                } else { 
                                    courseDetailsHTML += `
                                            <li class="display-none" onclick="Video.videoPlay('${classTimesList[item].resourceUrl}',${id},${classTimesList[item].id}, ${isSignUp},${classTimesList[item].cost})" >
                                                <img src="img/pome/bofang.png">
                                                <p>${classTimesList[item].orderNum}.${classTimesList[item].classTimesName}</p>
                                                <input type="hidden" value="${classTimesList[item].resourceUrl}">
                                            </li>`;
                                }
                            }
                        }
                            courseDetailsHTML += `
                                            </ul>
                                            <div class="elasticLine1 LineL display-none" onclick="handleHide()">
                                                <div class="line1"></div>
                                                <div class="handleDown" >内容收起</div>
                                                <div class="line1"></div>
                                            </div>
                                            <div class="elasticLine1 LineM" onclick="handleShow()">
                                                <div class="line1"></div>
                                                <div class="handleDown">展开更多</div>
                                                <div class="line1"></div>
                                            </div>
                                        </div>`;
            } else {
                $('#videoButton').addClass('display-none');
            }
                    if (isGroupDiscount === 1) {
                        courseDetailsHTML += `
                                <!-- 团报优惠 -->
                                <div class='group'>
                                    <div class='groupTitle'>
                                        <h4>团报优惠</h4>
                                    </div>
                                    <p>${groupDiscount}
                                    </p>
                                </div>`;
                        }
                        courseDetailsHTML += `
                                <div class='introduction'>
                                    <div class='groupTitle'>
                                        <h4>课程简介</h4>
                                    </div>
                                        <div>${introduction}</div>
                                </div>
                            </div>
                        `;
            $('#courseDetails').html(courseDetailsHTML);
            console.log(isSignUp)
            if (isSignUp === 1) { //判断是否报过名 报过名 取消报名按钮
                $('.btn').addClass('display-none');
                $('#btnOver').removeClass('display-none');
            }
            if (status === 2) {//判断课程是否下架 是 取消报名按钮 展示课程已下架
                $('.btn').addClass('display-none');
                $("#statusOver").removeClass('display-none');
            }
            $('#ad').attr('src', img2);
            var video = document.getElementById('videoPlay');
            if (video.paused) {//判断当前视屏是否在播放 在不重新渲染数据
                var VideoUrl = search();
                if (VideoUrl.url) { 
                    Video.videoPlay(VideoUrl.url, VideoUrl.courseId, VideoUrl.TimesId);
                    return
                }
                if (classTimesList.length > 0) { 
                    videoHTML = `
                        <video src="${classTimesList[0].resourceUrl}" id="videoPlay" controls x5-playsinline="" playsinline="" webkit-playsinline="" poster="" x-webkit-airplay="allow"></video>`;
                        $('#video').html(videoHTML);
                }
            }
    $('.courseListVideo').on('click', 'li', function () { //点击当前的视屏系列课程高亮
        $(this).children('p').addClass('active');
        $(this).siblings().children('p').removeClass('active');
    })

}
// 视频对象类方法
var Video = {           //播放地址 课程id 系列课id 是否购买
    videoPlay: function (url, id, TimesId, isSignUp,cost) { //播放视频
        // isSignUp = 1
        // console.log('登录后判定是否可以播放');
    if (cost === -1) {//判断是否收费 不收费 直接观看
        var video = document.getElementById('videoPlay');//打开视频
        Video.clearPlay();//去除封面图片
        video.play();
        video.pause();
        video.setAttribute('src', url);
        video.play();
        if (getUserId()) { //判断是否登录 登录添加观看历史
            $.ajax({
                type: 'post',
                url: myViewHistorySave,
                data: {
                    userId: getUserId(),
                    courseId: id,
                    classTimesId: TimesId,
                    surplusTime: 0,
                    lastTime: 0,
                },
                success: function (res) {
                    console.log(res);
                },
                error: function (error) {
                    console.log(error)
                },
            })
        }
        return 
    }
    if (isSignUp === 1) {//判断是否购买
        Video.clearPlay();//去除封面图片
        var video = document.getElementById('videoPlay');//打开视频
        video.play();
        video.pause();
            video.setAttribute('src', url);
            video.play();
            if (getUserId()) { //判断是否登录 登录添加观看历史
                $.ajax({
                    type: 'post',
                    url: myViewHistorySave,
                    data: {
                        userId: getUserId(),
                        courseId: id,
                        classTimesId: TimesId,
                        surplusTime: 0,
                        lastTime: 0,
                    },
                    success: function (res) {
                        console.log(res);
                    },
                    error: function (error) {
                        console.log(error)
                    },
                })
            }
        } else { 
            layer.msg('请先购买课程,再观看');
        }
    },
    clearPlay: function () { //清除播放前的图片 按钮
        $('#video').siblings().addClass('display-none');
    },
    addClassPlay: function () { //清除播放前的图片 按钮
        $('#video').siblings().removeClass('display-none');
        $('#videoButton').addClass('display-none');
    },
                    // 视频地址 课程id 课次id 是否购买 试看时长 用户id
    isPlay: function (url, id, TimesId, isSignUp, duration, isOne) { //播放视频 试看视屏
        // url, id, TimesId, isSignUp, cost, duration,0
        console.log('未登录后判定是否可以播放');
        if (getUserId()) {
            Video.clearPlay();//去除封面图片
            var video = document.getElementById('videoPlay');//打开视频
            if (video.currentTime >= parseInt(duration*60)) {
                layer.msg('您的试看已经结束');
                video.pause();
                return
            }
            video.play();
            video.pause();
            video.setAttribute('src', url);
            video.play();
            video.addEventListener("timeupdate", function () {
                if (video.currentTime >= duration*60) {
                    layer.msg('试看结束');
                    video.pause();
                    Video.addClassPlay();
                }
            })
            if (getUserId()) { //判断是否登录 登录添加观看历史
                $.ajax({
                    type: 'post',
                    url: myViewHistorySave,
                    data: {
                        userId: getUserId(),
                        courseId: id,
                        classTimesId: TimesId,
                        surplusTime: 0,
                        lastTime: 0,
                    },
                    success: function (res) {
                        // console.log(res);
                    },
                    error: function (error) {
                        console.log(error)
                    },
                })
            }
        } else { 
            if (isOne === 0) {//判断是不是第一个
                Video.clearPlay();//去除封面图片
                var video = document.getElementById('videoPlay');//打开视频
                video.currentTime = 0;
                video.play();
                video.pause();
                video.setAttribute('src', url);
                video.play();
                video.addEventListener("timeupdate", function () {
                    if (video.currentTime >= duration*60) {
                        layer.msg('试看结束');
                        video.pause();
                        Video.addClassPlay();
                    }
                })
                if (getUserId()) { //判断是否登录 登录添加观看历史
                    $.ajax({
                        type: 'post',
                        url: myViewHistorySave,
                        data: {
                            userId: getUserId(),
                            courseId: id,
                            classTimesId: TimesId,
                            surplusTime: 0,
                            lastTime: 0,
                        },
                        success: function (res) {
                            // console.log(res);
                        },
                        error: function (error) {
                            console.log(error)
                        },
                    })
                }
            } else { 
                handleMymodalLogin('courseDetails');//调用登录弹框
            }
        }
    },
}
// 立即报名类
var signUp = {
    immediately: function () { //点击立即报名
        Tool.modalOpen("#mymodal1");
    },
    checkPermissions: function () { //验证权限
        // console.log(getCourseInfo().rows);
        if(getCourseInfo().rows.cost == 1){//判断课程是不是收费的课程 => 是 =>判定报名的权限
            if (getUserId()) {
                var { isCooperation, isTeacher, projectId: projectIdUser } = getUserInfo();
                // 普通注册用户 //生态圈用户    是否自研用户 合伙人用户     是否可以使用优惠券
                var { isGeneralUser, isEcosphereUser, isSelfUser, isPartnerUser, isCoupon,
                    //内训   所属项目id   试用用户价         校长价     教师价
                    training, projectId, trialUserPrice, principalPrice, teacherPrice,
                    //是否可以团报-1 1 报名人数限制 已报名人数 课程状态-1 1 2 是否报名 0 1
                    isGroupDiscount, numLimit, numReported, status, isSignUp } = getCourseInfo().rows;
                var endTime = $('#ending').html();
                if (endTime === '报名已结束') { //判断报名是否结束  结束不在执行
                    layer.msg('报名已经结束');
                    return
                }
                if (numReported > numLimit) {
                    layer.msg('报名人数已满')
                    return
                }
                if (isEcosphereUser === 1) {//判断课程是不是 生态圈用户可购买
                    // if (training === 1) {//判断是否是内训课 是 
                    if (isCooperation !== -1) { //判断是不是校长用户 是 
                        var userPermissions = getUserPermissions();
                        for (var userProject of userPermissions) {
                            if (userProject.projectId === projectId) { //判断用户的项目id 是否和课程id相同 有权限
                                if (isGroupDiscount === 1) { //判断课程是否支持团报 支持
                                    clearPrice();//清楚用户上次选择的人数
                                    Tool.modalOpen('#mymodalBulk');//弹出选择团购人数
                                    return
                                } else { //判断课程是否支持团报 不支持直接跳转支付页面
                                    signUp.goToPay('-1');
                                    return
                                }
                            }
                        }
                        // Tool.modalOpen("#mymodalService");//循环出来 若无购买权限弹出无权购买弹框
                        // return
                    }
                    if (getUserPermissions()) { //判断是否含有自营用户 权限组
                        var UserPermissions = getUserPermissions()//获取自营用户 权限组
                        for (var item of UserPermissions) { //循环权限数组
                            if (item.projectId === projectId) { //如果权限数组中的某一个 == 课程的id
                                if (isGroupDiscount === 1) { //判断课程是否支持团报 支持
                                    clearPrice();//清除用户上次选择的人数
                                    Tool.modalOpen('#mymodalBulk');//弹出选择团购人数
                                    return
                                } else { //判断课程是否支持团报 不支持直接跳转支付页面
                                    signUp.goToPay('-1');
                                    return
                                }
                            }
                        }
                        if (isGeneralUser !== 1) { 
                            Tool.modalOpen("#mymodalService");//循环出来 若无购买权限弹出无权购买弹框
                            return
                        }
                    }
                    // }
                }
                
                if (isSelfUser === 1) {//判断是不是自研用户可以购买
                    if (training === 1) {//判断是否是内训课 是 
                        if (isCooperation !== -1) { //判断是不是校长用户
                            var userPermissions = getUserPermissions();
                            for (var userProject of userPermissions) {
                                if (userProject.projectId === projectId) { //判断用户的项目id 是否和课程id相同 有权限
                                    if (isGroupDiscount !== -1) { //判断课程是否支持团报 支持
                                        clearPrice();
                                        Tool.modalOpen('#mymodalBulk');//弹出选择团购人数
                                        return
                                    } else { //判断课程是否支持团报 不支持直接跳转支付页面
                                        signUp.goToPay('-1');
                                        return
                                    }
                                }
                            }
                            // Tool.modalOpen("#mymodalService");//循环出来 若无购买权限弹出无权购买弹框
                            // return
                        } else if (isTeacher === -1) {
                            if (projectIdUser === projectId) { //判断用户的项目id 是否和课程id相同 有权限
                                if (isGroupDiscount === 1) { //判断课程是否支持团报 支持
                                    clearPrice();
                                    Tool.modalOpen('#mymodalBulk');//弹出选择团购人数
                                    return
                                } else { //判断课程是否支持团报 不支持直接跳转支付页面
                                    signUp.goToPay('-1');
                                    return
                                }
                            }
                            // else {
                            //     Tool.modalOpen("#mymodalService");//循环出来 若无购买权限弹出无权购买弹框
                            //     return
                            // }
                        }
                    } else { //判断是否是内训课 不是 
                        if (isCooperation !== -1 || isTeacher === -1) { //判断是不是教师 校长=> 是
                            if (isGroupDiscount === 1) { //判断课程是否支持团报 支持
                                clearPrice();
                                Tool.modalOpen('#mymodalBulk');//弹出选择团购人数
                                return
                            } else { //判断课程是否支持团报 不支持直接跳转支付页面
                                signUp.goToPay('-1');
                                return
                            }
                        }
                    }
                }
               
                if (isGeneralUser === 1) { //判断是否全部用户可购买 是
                    if (isGroupDiscount === 1) { //判断课程是否支持团报 支持
                        clearPrice();//清楚用户上次选择的人数
                        Tool.modalOpen('#mymodalBulk');//弹出选择团购人数
                        return
                    } else { //判断课程是否支持团报 不支持直接跳转支付页面
                        signUp.goToPay('-1');
                        return 
                    }
                }
                Tool.modalOpen("#mymodalService");//弹出无权限购买
            } else { 
                handleMymodalLogin('courseDetails');//调用登录弹框
            }
        } else if (getCourseInfo().rows.cost == -1) {//判断课程是不是收费的课程 => 不是 =>判定报名的权限
            return;
        }
    },
    goToPay: function (num) { //跳转到支付页面 //num 报名的人数
        if (num === '-1') {//判断是否可以团报 不可以
            pay.GotoPay(getCourseInfo().rows.id);
        } else { //判断是否可以团报 可以
            console.log(getCourseInfo());
            var userInfo = [];
            for (var i = 0; i < num-1; i++) { 
                if (!$('.inpuName' + i).val()) {
                    console.log($('.inpuName' + i).val());
                    layer.msg('请输入同伴用户名');
                    return
                } else { 
                    var checkName = $('.inpuName' + i).val();
                    var checkPhone = $('.inpuPhone' + i).val();
                    var isCheckName = Tool.checkName(checkName, '.inpuName' + i);//验证用户名
                    var isCheckPhone = Tool.checkPhone(checkPhone, '.inpuPhone' + i);//验证用户电话
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
                obj.id=0;
                obj.partnerName = $('.inpuName' + i).val();
                obj.partnerPhone = $('.inpuPhone' + i).val();
                userInfo.push(obj);
                // console.log(userInfo)
            }
            $.ajax({//发送同伴信息到后台保存起来
                type: 'post',
                url: signUpSavePartner,
                data: {
                    userId: getUserId(),
                    courseId:getCourseInfo().rows.id,
                    partners:JSON.stringify(userInfo),
                },
                success: (res) => {
                    if (res.status === 200) { 
                        console.log(res);
                        pay.GotoPay(getCourseInfo().rows.id, res.idList);
                    }
                },
                error: (error) => { 
                    console.log(error);
                },
            })
        }

        
    },
    handleGetPrice: function (num, price) { 
            var info = {
                num,
                price,
            } 
        setPrice(info);//写入session
        return info
    },
    modalClose: function (modal, modalopen) { //选择参与人数 下一步关闭当前的模态框
        // '#mymodalBulk'关闭选择人数弹框,'#mymodalUser' 弹出填写信息
        console.log(getCourseInfo().rows.id);
        // return
        if (!getPrice()) { 
            layer.msg("请选择报名类型");
            return 
        }
        if(getPrice().num < 2){//判定报名的是否小于2人 是直接去支付
            pay.GotoPay(getCourseInfo().rows.id);
        }else{
            signUp.checknum(modal,modalopen)
        }
    },
    checknum: function (modal, modalopen) { //点击下一步 判断是否选择价格 人数 
        if (getPrice()) {
            var num = getPrice().num;
            var price = getPrice().price;
            // 保存填写同伴信息
            bulkUserHTML = `
                <p class='companion'>请填写其他同伴的姓名、手机号</p>
                <p class='companion'>（平台将会进行信息保密）</p>
            `;
            for (var i = 0; i < num-1; i++) { 
                bulkUserHTML += `
                <div>
                    <div class='companionMsg'>
                        <div>同伴${i+1}</div>
                        <div>
                            <input type="text" placeholder="请输入姓名" class="inpuName${i}">
                        </div>
                        <p class="display-none">请输入正确的姓名！</p>
                    </div>
                    <div class='companionMsg'>
                        <div></div>
                        <div>
                            <input type="text" placeholder="请输入手机号" class="inpuPhone${i}">
                        </div>
                        <p  class="display-none">请输入正确的手机号！</p>
                    </div>
                </div> `;
            }
            bulkUserHTML += `
            <div class="modal-footer">
                <button class='botton' onclick='signUp.goToPay(${num})'>完成,去支付</button>
                <p>报名成功后可在我的订单修改</p>
            </div>`;
            $('#bulkUser').html(bulkUserHTML);//动态渲染参与伙伴人数信息填写表
            $(modal).modal("toggle").hide(); //'#mymodalBulk'关闭选择人数弹框
            if (modalopen) { //判断关闭后是否需要在打开一个模态框
                $(modalopen).modal("toggle");//'#mymodalUser' 弹出填写信息
            }
        } else { 
            layer.msg('请选择参与人数');
            return 
        }
    }
}

function baoming() { 
    if (getUserId()) {
        Tool.modalOpen("#mymodalBulk");
    } else { 
        handleMymodalLogin();//弹出登录的弹框
    }
}
function classTimesList(url, id, TimesId, isSignUp, cost, duration) {
    if (getUserId()) {
        Video.videoPlay(url, id, TimesId, isSignUp, cost)
    } else { 
        Video.isPlay(url, id, TimesId, isSignUp, duration,0)
    }
}