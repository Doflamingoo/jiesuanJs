$(function () {

    /*添加功能*/
    var contain = $('#popupdiv');
    var temp = $('#temp');
    var temp1 = $('#temp1'); //模板1
    $('#settlement-method').change(function () {
        temp.empty();
        var choice = $(this).val();
        if (choice == '1') {
            temp1.removeClass('no');
            temp.html(temp1);
        }
    })




    /*核算区间*/
    var section = $('select[name="accountingInterval"]');

    /*结算方式*/
    var method = $('select[name="settleType"]');

    /*差异核算*/
    var different = $('select[name="accountingDiffMode"]');

    /*年基数*/
    var year = $('select[name="yearDays"]');



    method.change(function () {
        var choise = $(this).val();

        if (choise.length == 0) {
            section.empty();
            var option = '<option value="">请选择</option><option value="1">按日核算</option><option value="2">按月核算</option><option value="">按季核算</option><option value="">按年核算</option>';
            section.html(option);
        }
        if (choise == "1" || choise == "2") {
            section.empty();
            var option = '<option value="">请选择</option><option value="1">按日核算</option><option value="2">按月核算</option>';
            section.html(option);
        }
        if (choise == "3" || choise == "4") {
            section.empty();
            var option = '<option value="">请选择</option><option value="1">按日核算</option><option value="2">按月核算</option><option value="">按季核算</option>';
            section.html(option);
        }
        if (choise == "5" || choise == "6") {
            section.empty();
            var option = '<option value="">请选择</option><option value="1">按日核算</option><option value="2">按月核算</option><option value="">按季核算</option><option value="">按年核算</option>';
            section.html(option);
        }
        if (choise == "2" || choise == "4" || choise == "6") {
            different.val("0");
            different.attr("disabled", "disabled");
        } else {
            different.removeAttr("disabled");
        }
    })

    section.change(function () {
        var choise = $(this).val();
        if (choise == "1") {
            year.val('');
            $('.ctr').children().eq(1).removeClass('no');
        } else {
            year.val('');
            $('.ctr').children().eq(1).addClass('no');
        }
    })

/*起息日正则判断*/
/*$('#cbeginInterestDate').blur(function(){
	var reg=/^(-)?[0-7]*$/;
	var val=$('#cbeginInterestDate').val();
	if(!reg.test(val)){
		$('.tips').css('display','block');
	}else{
		$('.tips').css('display','none');
	}
})*/	

    




})


/*增加还款利率*/
function add(id,className) {
    var html = '';
    var re = $(id);
    html += '<div class="'+className+'"><input class="input v" type="text"><span class="fix-w">期</span><input class="input v wid-input" type="text"><span class="fix-w">%</span><a href="javascript:void(0)" class="del" onclick="cli(this)" >删除</a></div>';
    re.append(html);
}




/*添加资产计划中资产计划列表获取*/
function addAsetPlanChange(type,val,url){
	if (val == '' || val == 0 || val == null) {
        return;
    }
	$.ajax({
        type: "post",
        url: url,
        data: {
            planId: val,
            type:type
        },
        dataType: "json",
        success: function (data) {
            if(data.ok){
            	var repayPlatformName=data.result.repayPlatformName;
                var receivePlatformName=data.result.receivePlatformName;
            	$('#addRepayment').html(repayPlatformName);
            	$('#addReceiving').html(receivePlatformName);
            }else{
            	if(data.excpDesc!=''){
            		layer.alert(data.excpDesc);
            	}else{
            		layer.alert('出错');
            	}
            	
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}
/*修改配置弹窗*/
function editSettleConfig(url,id){
	$('#ReviseConfigure')[0].reset();
	$.ajax({
        type: "post",
        url: url,
        data: {
            id: id
        },
        dataType: "json",
        success: function (data) {
        	$('#itemId').val(data.result.id);
            var obj=data.result.configure;
            var option1="<option value=" + data.result.planId + ">" + data.result.planName + "</option>";
            var option2="<option value=" + data.result.modeId + ">资产撮合模式</option>";
            var option3="<option value=" + data.result.receivePlatformName + ">" + data.result.receivePlatformName + "</option>";
            var option4="<option value=" + data.result.repayPlatformName + ">" + data.result.repayPlatformName + "</option>";
            $('#rePlanId').html(option1);
            $('#reModeId').html(option2);
            $('#reReceive').html(option3);
            $('#reRepay').html(option4);
            
            $('#crepayType').val(obj.repayType);
            $('#csettleType').val(obj.settleType);
            $('#caccountingInterval').val(obj.accountingInterval);
            $('#cprecisionDigit').val(obj.precisionDigit);
            $('#cprecisionMode').val(obj.precisionMode);
            if(obj.accountingDiffMode!=''){
            	$('#caccountingDiffMode').val(obj.accountingDiffMode)
            }
            if(obj.yearDays!=''){
            	$('#cyearDays').val(obj.yearDays);
            	$('.ctr').children().eq(1).removeClass('no');
            }
            
            var repayRate=obj.repayRate;
            var cont='';
            $.each(repayRate,function(key,val){
            	cont+='<div class="rateDiv"><input class="input v" type="text" value="'+key+'" readonly= "true"><span class="fix-w">期</span><input class="input v wid-input" type="text" value="'+val+'" readonly= "true"><span class="fix-w mark">%</span></div>';
            })
            $('#re').html(cont);
            $('#re').find("div").eq(0).find("a").remove();
            $('#re').find("div").eq(0).append('<span class="add" onclick="add(re,\'rateDiv\')"></span>');
 	
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
	show('popupdiv2');
	
	
}








/*删除还款利率*/
function cli(now) {
    $(now).parent().remove();
}

/*添加资产计划结算弹窗*/
function addAssets(url) {
	$.ajax({
        type: "post",
        url: url,
        dataType: "json",
        success: function (data) {
        	if(data.ok){
        		var options = "<option value=0 >全部</option>";
                var value = data.result;
                $.each(value, function (key, val) {
                    options += "<option value=" + val.planId + ">" + val.planName + "</option>";
                });
                $('#addAsetPlan').html(options);
        	}else{
        		layer.alert("获取数据出错");
        	}
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    show('popupdiv');
}




/*添加资产计划结算配置提交*/
function addSub(url) {
	/*Ac开关--还款利率正则验证*/
	var Ac=true;
	/*利率期数正则：大于0且小于100的正整数*/
	var reg1=/^(([1-9][0-9]{0,1})?)$/;
	
	/*利率百分比正则：大于等于1且小于100，支持1~2位小数*/
	var reg2=/^(([1-9][0-9]{0,1})?(\.\d{1,2})?)$/;
	
	var regRate=$('.addRateDiv');
	
	$.each(regRate,function(index,value){
		var regRateVal=$(value).find('input').eq(0).val();
		var regPerVal=$(value).find('input').eq(1).val();
		if(regRateVal==''||regPerVal==''){
			layer.alert("还款利率不能为空！");
			Ac=false;
			return false;
		}else{
			if(!reg1.test(regRateVal)&&reg2.test(regPerVal)){
				$('.tipsB').css('display','none');
				$('.tipsA').css('display','none');
				$('.tipsQ').css('display','block');
				Ac=false;
				return false;
			}else if(!reg2.test(regPerVal)&&reg1.test(regRateVal)){
					$('.tipsQ').css('display','none');
					$('.tipsA').css('display','none');
					$('.tipsB').css('display','block');
					Ac=false;
					return false;
				}else if(!reg1.test(regRateVal)&&!reg2.test(regPerVal)){
					$('.tipsQ').css('display','none');
					$('.tipsB').css('display','none');
					$('.tipsA').css('display','block');
					Ac=false;
					return false;
				}else{
					$('.tipsQ').css('display','none');
					$('.tipsB').css('display','none');
					$('.tipsA').css('display','none');
				}

		}
		
	})
	
	if(Ac){
		var planId=$('#addAsetPlan').val();
		var modeId=$('#settlement-method').val();
		
		/*还款方式*/
		var repayType=$('#repayType').val();
		
		/*结算方式*/
		var settleType=$('#settleType').val();
		
		/*差异核算*/
		var accountingDiffMode=$('#accountingDiffMode').val();
		
		/*核算区间*/
		var accountingInterval=$('#accountingInterval').val();
		
		/*年基数*/
		var yearDays=$('#yearDays').val();
		
		/*小数保留位数*/
		var precisionDigit=$('#precisionDigit').val();
		
		/*小数保留模式*/
		var precisionMode=$('#precisionMode').val();
		
		/*还款利率*/
		var repayRate=reRate('addRateDiv');
		/*验证还款利率*/
		if(repayRate==false){
			return;
		}
		
		/*以下只粗略验证---资产计划/结算模式/还款方式/结算方式/核算区间/小数保留位数/小数保留模式 是否已选择*/
		if(planId==''|modeId==''|repayType==''|settleType==''|accountingInterval==''|precisionDigit==''|precisionMode==''){
			layer.alert("请填写完全再提交");
			return;
		}
		
		var dataJson = {
					"planId": Number(planId),
		            "modeId": Number(modeId),
		            "repayType": Number(repayType),
		            "settleType": Number(settleType),
		            "accountingDiffMode": Number(accountingDiffMode),
		            "accountingInterval": Number(accountingInterval),
		            "yearDays": Number(yearDays),
		            "precisionDigit": Number(precisionDigit),
		            "precisionMode": Number(precisionMode),
		            "repayRate":repayRate
		}
		
		
		
		
		/*结算方式选择按月到期付息还本，差异核算不可以向后端传值*/
		if(settleType=='2'){
			delete dataJson.accountingDiffMode;
		}else{
			/*再次判断是否漏选差异核算*/
			if(accountingDiffMode==''){
				layer.alert("请选择差异核算方式");
				return;
			}
		}
		/*核算区间如果选择按月核算，年基数不可以向后端传值*/
		if(accountingInterval=='2'){
			delete dataJson.yearDays;
		}else{
			if(yearDays==''){
				/*再次判断是否漏选年基数*/
				layer.alert("请选择年基数");
				return;
			}
		}
		
		
		

		$.ajax({
	        type: "post",
	        url: url,
	        data:{"data":JSON.stringify(dataJson)},
	        dataType: "json",
	        success: function (data) {
	            if(data.ok){
	            	closeDiv('popupdiv');
	            	layer.alert("添加配置成功!", 9, function() {
                        location.reload();
                    });
	            }else{
	            	if(data.excpDesc!=''){
	            		layer.alert(data.excpDesc);
	            	}else{
	            		layer.alert('添加配置失败');
	            	}
	            	
	            }
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log(errorThrown);
	        }
	    });
	}
	
}

/*修改资产计划结算配置提交*/
function reSub(url){
	/*Ac开关--还款利率正则验证*/
	var Ac=true;
	/*利率期数正则：大于0且小于100的正整数*/
	var reg1=/^(([1-9][0-9]{0,1})?)$/;
	
	/*利率百分比正则：大于等于1且小于100，支持1~2位小数*/
	var reg2=/^(([1-9][0-9]{0,1})?(\.\d{1,2})?)$/;
	
	var regRate=$('.rateDiv');
	
	$.each(regRate,function(index,value){
		var regRateVal=$(value).find('input').eq(0).val();
		var regPerVal=$(value).find('input').eq(1).val();
		if(regRateVal==''||regPerVal==''){
			layer.alert("还款利率不能为空！");
			Ac=false;
			return false;
		}else{
			if(!reg1.test(regRateVal)&&reg2.test(regPerVal)){
				$('.tipsB').css('display','none');
				$('.tipsA').css('display','none');
				$('.tipsQ').css('display','block');
				Ac=false;
				return false;
			}else if(!reg2.test(regPerVal)&&reg1.test(regRateVal)){
					$('.tipsQ').css('display','none');
					$('.tipsA').css('display','none');
					$('.tipsB').css('display','block');
					Ac=false;
					return false;
				}else if(!reg1.test(regRateVal)&&!reg2.test(regPerVal)){
					$('.tipsQ').css('display','none');
					$('.tipsB').css('display','none');
					$('.tipsA').css('display','block');
					Ac=false;
					return false;
				}else{
					$('.tipsQ').css('display','none');
					$('.tipsB').css('display','none');
					$('.tipsA').css('display','none');
				}
		}
		
	})
	
	
	if(Ac){
		var repayRate=reRate('rateDiv');
		/*验证还款利率*/
		if(repayRate==false){
			return;
		}
		
		var itemId=$('#itemId').val();
		var dataJson = {
	            "id": Number(itemId),
	            "repayRate":repayRate
	}
		

		
		$.ajax({
	        type: "post",
	        url: url,
	        data: {"data":JSON.stringify(dataJson)},
	        dataType: "json",
	        success: function (data) {
	            if(data.ok){
	            	closeDiv('popupdiv2');
                    layer.alert("修改成功!", 9, function() {
                        location.reload();
                    });
	            }else{
	            	layer.alert(data.excpDesc);
	            }
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) {
	            console.log(errorThrown);
	        }
	    })
		
		
	}
	
	
	
	
	
	
	
	
	
	
	
}


/*还款利率处理*/
function reRate(className){
	var rateDiv=$('.'+className);
	var arr=new Array();
	var sameArr=new Array();
	var str=new String();
	$.each(rateDiv,function(index,value){
		var key=$(value).children('input').eq(0).val();
		sameArr.push(key);
		var val=$(value).children('input').eq(1).val();
		if(key==''||val==''){
			layer.alert("还款利率不能为空！");
			str='';//输入的还款利率有留空白，则提醒还款利率不能为空，并且将对象内容全部清空，以防报错!
			return false;
		}else{
			if(index==rateDiv.length-1){
				str+='"'+key+'":'+val;
			}else{
				str+='"'+key+'":'+val+',';
			}
		}
	})
	str='{'+str+'}';
	var obj=JSON.parse(str);
	/*判断还款利率期数输入是否有相同值*/
	var isSameArr=checkArrayRepeat(sameArr);
	if(!isSameArr){
		layer.alert("还款利率期数不能相同！");
		return false;
	}else{
		return obj;
	}
	
}


/*判断是否有相同的数组元素*/
function checkArrayRepeat(array) {
	var nary = array.sort();
    for (var i = 0; i < array.length; i++) {
        if (nary[i] == nary[i + 1]) {
            return false;
        }
    }
    return true;
}




