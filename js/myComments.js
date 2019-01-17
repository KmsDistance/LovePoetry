var isCooperation;
var isTeacher;
if (getUserInfo()) { 
    var userInfo = getUserInfo();//获取用户信息
    console.log(userInfo);
    isCooperation = userInfo.isCooperation;
    isTeacher = userInfo.isTeacher;
}
var userId;
$(function(){
    userId = getUserId();
    $.ajax({
        type:'post',
        url:myComments,
        data: { userId: userId },
        success:function(res){
            console.log(res);
            if(res.status == 200){
                console.log(res.rows);
                var commentsBoxDetails = '';
                var comments = res.rows;
                if(comments.length>0){
                    for(var i=0;i<comments.length;i++){
                        commentsBoxDetails += `
                            <div class="content">
                                <p>${comments[i].content}</p>
                            </div>
                            <div class='myComments'>
                                <div>
                                    <img src="${comments[i].course.img4}">
                                </div>
                                <div>
                                    <p>${comments[i].course.courseName}</p>
                                    <p>讲师：${comments[i].course.teacherName}</p> `;
                        console.log(isCooperation);
                        if (isTeacher === 1) {
                            commentsBoxDetails += `<span>${comments[i].course.teacherPrice}堡币</span>`;
                        } else if (isCooperation === 1) {
                            commentsBoxDetails += `<span>${comments[i].course.principalPrice}堡币</span>`;
                        } else if (comments[i].course.price) {
                            commentsBoxDetails += `<span>${comments[i].course.price}堡币</span>`;
                        }
                        commentsBoxDetails += `
                                </div>
                            </div>
                            <p>点赞${comments[i].likeNum}次</p>`;
                    }
                    $("#commentsBox").html(commentsBoxDetails)
                    $("#OrderBox1").hide();
                }else{
                    $("#commentsBox").hide();
                    $("#OrderBox1").show();
                }
            }
        },
        error:function(error){
            condole.log(error)
        }
    })
})