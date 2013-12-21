<?php
error_reporting(7);
date_default_timezone_set("Asia/Shanghai");

?>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
 <head runat="server">
  <TITLE>51主图处理</TITLE>
  <meta name="Author" content="SeekEver">
  <meta name="Keywords" content="">
  <meta name="Description" content="">
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
  <script src="./js/jquery.min.js" type="text/javascript"></script>
  <script src="./js/jquery.Jcrop.js" type="text/javascript"></script>
  <link rel="stylesheet" href="./css/jquery.Jcrop.css" type="text/css" />
  <style>
.btnarea{border:1px solid #ccc; padding:5px; margin-bottom:10px;}
.ajaxload { background:#fff url(ajax-loader.gif) no-repeat center center; width:16px; height:26px; margin:0px 0px 0px 5px; color:red; }
#target{ /*width:800px;expression(document.body.offsetWidth -200+"px");*/}
   </style>
<script type="text/javascript">
	 jQuery(function($){   
	     
	     var myPics = new Array();
		 myArgs = window.dialogArguments;
		 $.each(myArgs[2],function(i,n){
		    if($.inArray(n,myPics) < 0)
			   myPics.push(n);
		  });    
		
	    //not img params
		$("#txtName1").val(myArgs[0].toString());
	  $("#txtAge1").attr("src",myArgs[1].toString());
		//init img src
		$("#target").attr("src",myPics[0].toString());
		$("#preview2").attr("src",myPics[0].toString());
	  
	  
      // Create variables (in this scope) to hold the API and image size
      var jcrop_api, boundx, boundy;
      
      $('#target').Jcrop({
		minSize: [160,160],
		setSelect: [0,0,310,310],
        onChange: updatePreview,
        onSelect: updatePreview,
		onSelect: updateCoords,
        aspectRatio: 1
      },
		function(){
			// Use the API to get the real image size
			var bounds = this.getBounds();
			boundx = bounds[0];
			boundy = bounds[1];
			// Store the API in the jcrop_api variable
			jcrop_api = this;
		});
		
		function updateCoords(c)
		{
			$('#x').val(c.x);
			$('#y').val(c.y);
			$('#w').val(c.w);
			$('#h').val(c.h);
		};
		
		function checkCoords()
		{
			if (parseInt($('#w').val())) return true;
			alert('请选择一个裁剪区域');
			return false;
		};
		
		  function updatePreview(c){
			if (parseInt(c.w) > 0)			
			{
			  var rx = 310 / c.w;		//大头像预览Div的大小
			  var ry = 310 / c.h;
			  $('#preview2').css({
				width: Math.round(rx * boundx) + 'px',
				height: Math.round(ry * boundy) + 'px',
				marginLeft: '-' + Math.round(rx * c.x) + 'px',
				marginTop: '-' + Math.round(ry * c.y) + 'px'
			  });
			}
		  };
	  
	 
	  
	  $("#cutpic").click(function(){
	     if( checkCoords() == false)
	     {
	     	  return false;
	     }
		 $("#tips").show().html("正在裁剪,请稍候……");
		 $.ajax({
		   type:"POST",
		   url:"cropajax.php?act=cut",
		   dataType: "json",
		   data:{x:$('#x').val(),y:$('#y').val(),w:$('#w').val(),h:$('#h').val(),targetImgSrc:$('#target').attr("src")},
		   success:function(data,textStatus){
		      if(data.result == 1){			    
			    $("#tips").removeClass().html("裁剪成功");
				$("#cropresult").val(data.src);
			  }
			  if(data.result == 0)
			    $("#tips").removeClass().html("裁剪失败");
		   }
		 
		 });	  
	  });
	  
	  $("#prepic").click(function(){
	    var pos = $.inArray($('#target').attr("src"),myPics);
		if(pos==0)
		{
		  alert("没有了哦！");
		  return false;
		}		
		if(pos > 0 && pos < myPics.length)
		{		
		    var imgtmpsrc = myPics[pos-1].toString();
		
			$("#divid1").html("<img src='"+imgtmpsrc+"' id='target' />");
			$("#divid3").html("<img src='"+imgtmpsrc+"' id='preview2' />");
		
			$('#target').Jcrop({
			minSize: [160,160],
			setSelect: [0,0,310,310],
			onChange: updatePreview,
			onSelect: updatePreview,
			onSelect: updateCoords,
			aspectRatio: 1
		  },
			function(){
				// Use the API to get the real image size
				var bounds = this.getBounds();
				boundx = bounds[0];
				boundy = bounds[1];
				// Store the API in the jcrop_api variable
				jcrop_api = this;
			});	 
		}//end if 
	  });	 
	  $("#nextpic").click(function(){
	    var pos = $.inArray($('#target').attr("src"),myPics);
		if(pos==myPics.length-1)
		{
		  alert("没有了哦！");
		  return false;
		}
		if(pos >= 0 && pos < myPics.length-1)
		{
		    var imgtmpsrc = myPics[pos+1].toString();
		
			$("#divid1").html("<img src='"+imgtmpsrc+"' id='target' />");
			$("#divid3").html("<img src='"+imgtmpsrc+"' id='preview2' />");
		
			$('#target').Jcrop({
			minSize: [160,160],
			setSelect: [0,0,310,310],
			onChange: updatePreview,
			onSelect: updatePreview,
			onSelect: updateCoords,
			aspectRatio: 1
		  },
			function(){
				// Use the API to get the real image size
				var bounds = this.getBounds();
				boundx = bounds[0];
				boundy = bounds[1];
				// Store the API in the jcrop_api variable
				jcrop_api = this;
			});	 
		}		
		//end if 
	  });	 
	  
	  $("#updatepic").click(function(){
	     
			var name = $("#txtName1").val();
			var age =  $("#txtAge1").val();
			var pic = $("#cropresult").val();
	      if($("#cropresult").val() == ""){
		     $("#tips").show().html("正在下载");
			 $.ajax({
			   type:"POST",
			   url:"cropajax.php?act=update",
			   dataType: "json",
			   data:{targetImgSrc:$('#target').attr("src")},
			   async:false,
			   success:function(data,textStatus){
				  if(data.result == 1){			    
					$("#tips").removeClass().html("下载成功");					
					$("#cropresult").val(data.src);
				  }
				  if(data.result == 0)
					$("#tips").removeClass().html("下载失败");
			   }			 
			 }); 
			}
			
			
			var name = $("#txtName1").val();
			var age =  $("#txtAge1").val();
			var pic = $("#cropresult").val();
			
			pic = "picdemo1/"+pic.replace("./","");
			var arrArgs = new Array(name, age, pic);
			window.returnValue = arrArgs;
			window.close();
	  });
	  
    });
</script>
 </head>
 <body>
   <div class="btnarea">
     <button id="prepic">上一张</button>
     <button id="nextpic">下一张</button>
     <button id="cutpic">裁剪</button>
     <span id="tips" class="ajaxload" style="display:none;color:red;"></span>  
     <button id="updatepic">更新主图</button>
   </div>
   <table>     
     <tr>
       <td>款 名：</td>
       <td><input type="text" size=60 value="" id="txtName1" readonly /></td>
     </tr>
     <tr>
       <td>原 图：</td>
       <td><img src="" id="txtAge1"  width=80 height=80  /></td>
     </tr>
     <tr valign="top">
       <td>描 述：</td>
       <td>
         <div id="divid1"><img id="target" src="" /></div>	
       </td>
       <td>
         <div style="width:310px;height:310px;overflow:hidden;" id="divid3">
            <img id="preview2" src="" />
          </div>
       </td>
     </tr>
    </table>
    <!-- fox ajax params -->
	<form id="cropform" action="propic.php?act=update" method="post">
		<input type="hidden" id="x" name="x" />
		<input type="hidden" id="y" name="y" />
		<input type="hidden" id="w" name="w" />
		<input type="hidden" id="h" name="h" />
        <input type="hidden" id="targetImgSrc" name="targetImgSrc"/>
	</form>
    <!-- fox crop result src -->
    <input type="hidden" id="cropresult" name="cropresult"/>
 </body>
</html>