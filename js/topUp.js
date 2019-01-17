var payType = 0;  //获取支付类型 3微信支付 0未选择支付类型

    $(function(){
        var isChecked = true;
        $("#btnRadio").click(function(){
            if(isChecked){
                isChecked = false;
                $('#showBox').addClass('active');
                $('#showBox #imgShow3').hide();
                $('#showBox #imgShow4').show();
                payType = 3;    // 选择微信支付
        }else{
                isChecked = true
                $('#showBox1').addClass('active');
                $('#showBox #imgShow3').show();
                $('#showBox #imgShow4').hide();
                payType = 0;// 未选择支付类型
            }
        })
        // 点击立即充值
        $("#btn1").click(function(){
            var contentInput = $("#getcontent").val();
            console.log(contentInput)
            if (contentInput <= 0) { //判断是否选择了充值价格 没有
                layer.msg('请选择充值金额');
                return
            }
            if (payType === 0) {
                layer.msg('请选择支付类型');
                return 
            }
            $.ajax({// 调用微信支付 充值堡币
                url:rechargeFormWxSave,
                type:'post',
                data:{
                    "userId":getUserId(),
                    "money":contentInput,
                },
                success:function(res){
                    console.log(res);
                    if (res.status === 200) { 
                        location.href=res.data;//唤起微信支付
                    }
                },
                error:function (error) {
                    console.log(error)
                }
            })
        })
        $("#row1").click(function(){
                $('#row1').addClass('active');
                $('#row1').siblings('li').removeClass('active');
                content = $('#row1').html();
                content = content.substring(1,);
                $("#getcontent").val(content);
                $("#showContent").html("要充值"+content+"堡币")
        });
        $("#row2").click(function(){
                $('#row2').addClass('active');
                $('#row2').siblings('li').removeClass('active');
                content = $('#row2').html();
                content = content.substring(1,);
                $("#getcontent").val(content);
                $("#showContent").html("要充值"+content+"堡币")
        });
        $("#row3").click(function(){
                $('#row3').addClass('active');
                $('#row3').siblings('li').removeClass('active');
                content = $('#row3').html();
                content = content.substring(1,);
                $("#getcontent").val(content);
                $("#showContent").html("要充值"+content+"堡币")
        });
        $("#row4").click(function(){
                $('#row4').addClass('active');
                $('#row4').siblings('li').removeClass('active');
                content = $('#row4').html();
                content = content.substring(1,);
                $("#getcontent").val(content);
                $("#showContent").html("要充值"+content+"堡币")
        });
        $("#row5").click(function(){
                $('#row5').addClass('active');
                $('#row5').siblings('li').removeClass('active');
                content = $('#row5').html();
                content = content.substring(1,);
                $("#getcontent").val(content);
                $("#showContent").html("要充值"+content+"堡币")
        });
        $("#row6").click(function(){
                $('#row6').addClass('active');
                $('#row6').siblings('li').removeClass('active');
                content = $('#row6').html();
                content = content.substring(1,);
                $("#getcontent").val(content);
                $("#showContent").html("要充值"+content+"堡币")
        });
    })