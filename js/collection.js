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
    // myCollection
    userId = getUserId();
    $.ajax({
        type: 'post',
        url: myCollection,
        data: { userId: userId },
        success: function(res){
            if(res.status == 200){
                console.log(res.rows);
                var collectionDetails = '';
                var collection = res.rows;
                if(collection.length>0){
                    for(var i=0;i<collection.length;i++){
                        collectionDetails += `
                        <div class='collection'>
                            <div>
                                <img style="height:54px" src="${collection[i].course.img4}">
                            </div>
                            <div>
                                <h5>${collection[i].course.courseName}</h5>
                                <span>${collection[i].course.collectionNum}人收藏</span> `;
                        console.log(isCooperation);
                        if (isTeacher === 1) {
                            collectionDetails += `<p>${collection[i].course.teacherPrice}堡币</p>`;
                        } else if (isCooperation === 1) {
                            collectionDetails += `<p>${collection[i].course.principalPrice}堡币</p>`;
                        } else if (collection[i].course.price) {
                            collectionDetails += `<p>${collection[i].course.price}堡币</p>`;
                        }
                        if(collection[i].course.status == 1){
                            collectionDetails += `
                                </div>
                                <div>
                                    <button class='moreBtn' onclick='handleCourseDetals(${collection[i].course.id})'>查看更多</button>
                                </div>
                                </div>`
                        }else if(collection[i].course.status == 2){
                            collectionDetails += `
                                </div>
                                <div>
                                    <button class='moreBtn' onclick='handleCourseDetals(${collection[i].course.id})'>查看更多</button>
                                </div>
                                </div>`
                        }
                    }
                    $("#collection").html( collectionDetails)
                    $("#OrderBox1").hide();
                }else{
                    $("#collection").hide();
                    $("#OrderBox1").show();
                }
            }
        },
        error: function(error){
            console.log(error);
        }
    })
});
function handleCourseDetals(id){
    console.log(id);
    window.location.href = 'courseDetails.html?courseId='+id
}