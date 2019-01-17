$(function () { 
    var shoppingId = search().shoppingId;
    pay.orderFormById(shoppingId)
        .then(res => { 
            console.log(res);
            var url = location.href.substring(0, location.href.lastIndexOf('/')) + '/personalMsg.html?shoppingId=' + search().shoppingId //跳转到二维码页面
            console.log(url);
            $('#code').qrcode({
                width: 190,
                height: 190,
                correctLevel: 0,
                render: "table",
                text: url,
            });
            
        })
        .catch(error => { 
            console.log(error)
        })
        //  location.href = location.href.substring(0, location.href.lastIndexOf('/')) + '/personalMsg.html?shoppingId=' + search().shoppingId //跳转到二维码页面
})
