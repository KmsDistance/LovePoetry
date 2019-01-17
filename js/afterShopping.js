function goTopup() {
    window.location='topUp.html'
}
$(function () {
    if (!getUserId()) { 
        location.href = 'shoppingCenter.html';
        return 
    }
    var user1 = sessionStorage.getItem("userId")
    $.ajax({
        url:baseURL + 'system/customer/getById',
        type:'post',
        data:{"id":user1},
        success:function(res){
            console.log(res);
            var changeMoney = `
                <img src="img/qian.png">
                <span>堡币剩余:${res.rows.rechargePrice}</span>
                <p>
                    <span style="margin-left: .7rem">赠送堡币:${res.rows.givePrice}</span>
                </p>`;
            $('#changeMoney').html(changeMoney)
        },
        error:function(error){
            console.log(error)
        },
    })
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
        url:baseURL + 'mall/goods/goodsGroup',
        type:'post',
        success:function(res){
            console.log(res);
            if(res.status==200){
                dataTeach=res.teachList.data;
                var dataSelfRes=res.selfResList.data;
                var dataService=res.serviceList.data;
                dataLesson=res.courseList.data;
                console.log(dataSelfRes);
                var teachItem = '';//教具教材
                var lessonItem = ''//课程
                var serviceItem = ''//行业服务
                var selfResItem = '';// 自研项目
                for(i=0;i<dataTeach.length;i++){
                    console.log(dataTeach[i].type);
                    var mark = dataTeach[i].intro
                    if(mark.length>15){
                        mark = mark.substr(0,15)+ "..." ;
                    }else{
                        mark=mark;
                    }
                    teachItem += `<div  onclick="handleDetails(${dataTeach[i].id})">
                            <div>
                                <img src="${dataTeach[i].cover}">
                            </div>
                            <h5>${dataTeach[i].name}</h5>
                            <p>${mark}</p>
                            <div>
                                <span>￥${dataTeach[i].price}</span>
                                <span>￥${dataTeach[i].originalPrice}</span>
                            </div>
                         </div>`
                }
                // 行业服务
                for(i=0;i<dataService.length;i++){
                    console.log(dataService[i].type);
                    var mark = dataService[i].intro
                    if(mark.length>15){
                        mark = mark.substr(0,15)+ "..." ;
                    }else{
                        mark=mark;
                    }
                    serviceItem += `<div  onclick="handleDetails(${dataService[i].id})">
                            <div>
                                <img src="${dataService[i].cover}">
                            </div>
                            <h5>${dataService[i].name}</h5>
                            <p>${mark}</p>
                            <div>
                                <span>￥${dataService[i].price}</span>
                                <span>￥${dataService[i].originalPrice}</span>
                            </div>
                         </div>`
                }
                //课程
                for(i=0;i<dataLesson.length;i++){
                    console.log(dataLesson[i].type);
                    var mark = dataLesson[i].intro
                    if(mark.length>20){
                        mark = mark.substr(0,20)+ "..." ;
                    }else{
                        mark=mark;
                    }
                    lessonItem += `
                        <div onclick="handleDetails(${dataLesson[i].id})">
                            <div>
                                <img src="${dataLesson[i].cover}">
                            </div>
                            <h5>${dataLesson[i].name}</h5>
                            <p>${mark}</p>
                            <div>
                                <span>￥${dataLesson[i].price}</span>
                                <span>￥${dataLesson[i].originalPrice}</span>
                            </div>
                        </div>`
                }
                // 教具教材
                for(i=0;i<dataSelfRes.length;i++){
                    // console.log(dataSelfRes[i].type);
                    var mark = dataSelfRes[i].intro
                    if(mark.length>20){
                        mark = mark.substr(0,20)+ "..." ;
                    }else{
                        mark=mark;
                    }
                    selfResItem += `
                        <div onclick="handleDetails(${dataSelfRes[i].id})">
                            <div>
                                <img src="${dataSelfRes[i].cover}">
                            </div>
                            <h5>${dataSelfRes[i].name}</h5>
                            <p>${mark}</p>
                            <div>
                                <span>￥${dataSelfRes[i].price}</span>
                                <span>￥${dataSelfRes[i].originalPrice}</span>
                            </div>
                        </div>`
                }
                $("#teach").html(teachItem);
                $("#lesson").html(lessonItem);
                $("#selfRes").html(selfResItem);
                $("#service").html(serviceItem);
            }else{
                layer.msg("出故障了")
            }
        },
        error:function(error){
            console.log(error)
        }
    })
})
var teachListNumber = 2;
var courseListNumber = 2;
function handleAddContent(type){//1-教育教材，2-自研，3-课程  4-行业服务， 5-自营， 加载更多
    console.log(dataLesson)
    var page;
    console.log(page)
    if (type==2){
        page = teachListNumber++;
    }
    else if (type==3){
        page = courseListNumber++;
    }

    console.log(page)
    $.ajax({
        url:baseURL + 'mall/goods/goodsList?rows=2&page='+page+'&type='+type,
        type:'post',
        success:function(res){
            console.log(page)
            // console.log(res);
            var moreLoad = res.rows;
            var teachItem = '';//教具教材
            var lessonItem = '';//课程
            console.log(moreLoad);
            for(i=0;i<moreLoad.length;i++){
                type1=moreLoad[0].type;
                console.log(type1)
                var mark = moreLoad[i].intro
                if(mark.length>20){
                    mark = mark.substr(0,20)+ "..." ;
                }else{
                    mark=mark;
                }
                if(moreLoad[i].type==3){
                    lessonItem += `
                        <div onclick="handleDetails(${moreLoad[i].id})">
                            <div>
                                <img src="${moreLoad[i].cover}">
                            </div>
                            <h5>${moreLoad[i].name}</h5>
                            <p>${mark}</p>
                            <div>
                                <span>￥${moreLoad[i].price}</span>
                                <span>￥${moreLoad[i].originalPrice}</span>
                            </div>
                        </div>`;
                }
                if(moreLoad[i].type==2){
                    teachItem  += `
                        <div onclick="handleDetails(${moreLoad[i].id})">
                            <div>
                                <img src="${moreLoad[i].cover}">
                            </div>
                            <h5>${moreLoad[i].name}</h5>
                            <p>${mark}</p>
                            <div>
                                <span>￥${moreLoad[i].price}</span>
                                <span>￥${moreLoad[i].originalPrice}</span>
                            </div>
                        </div>`;
                }
            }
            $("#teach").append(teachItem);
            $("#lesson").append(lessonItem);
            if(res.rows.length!==0 && res.rows[0].type==3){
                dataLesson = dataLesson.concat(res.rows);
                page = courseListNumber++;
                console.log(dataLesson);
            }else if(res.rows.length!==0 && res.rows[0].type==2){
                dataTeach  = dataTeach.concat(res.rows);
                page = teachListNumber++;
                console.log(dataTeach);
            }else{
                layer.msg("没有更多了！")
            }
        },
        error:function(error){
            console.log(error)
        }
    })
}
function handleDetails(productId){
    window.location='afterProductDrtails.html?id='+productId
}