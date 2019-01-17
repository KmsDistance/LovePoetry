$(function () { 
    $.ajax({
        type: 'post',
        url: myViewHistoryMyViewHistorys,
        data: {
            userId:getUserId(),
        },
        success: function (res) { 
            console.log(res);
            var watchHTML = '';
            if (res.status === 200 && res.rows.length === 0) {
                watchHTML += `
                    <!-- 没有观看记录 -->
                    <div class='watchBox' style='background-color: #F3F3FB; padding-top: 1rem;position: fixed;height: 100%'>
                        <p style='text-align: center'>你还没有观看视频哦~</p>
                    </div>
                `;
            } else { 
                watchHTML += `
                <!-- 有观看记录 -->
                <div class='watchBox'>
                    <!-- 主体 -->
                    <div class='watch'>`;
                for (var item of res.rows) { 
                    var {course,classTimes } = item;
                    watchHTML += `
                            <div class='historyBox' onclick="handleGoRouter(${course.id},'${classTimes.resourceUrl}',${classTimes.id})">
                                <p>${item.lastTime}观看</p>
                                <div class='history'>
                                    <div>
                                        <img style="height:54px" src="${course.img2}">
                                    </div>
                                    <div>
                                        <p>${classTimes.courseName}</p>
                                        <span>${classTimes.classTimesName}</span>
                                    </div>
                                </div>
                            </div>`;
                }
                watchHTML += `
                    </div>
                </div>
                `
            }
            $('#watch').html(watchHTML);
        },
        errro: function (error) {
            console.log(error )
         }
    })
})
function handleGoRouter(id,url,TimesId) { 
    location.href = 'courseDetails.html?courseId=' + id + '&url=' + url + '&TimesId='+TimesId;
}