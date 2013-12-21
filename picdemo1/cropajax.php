<?php
error_reporting(7);
date_default_timezone_set("Asia/Shanghai");
header("Content-type:text/html; Charset=utf-8");
require_once("./image.class.php");
$images = new Images("file");
?>

<?php
	function retrieve($url) { 
		preg_match('/\/([^\/]+\.[a-z]+)[^\/]*$/',$url,$match); 
		return $match[1]; 
	} 


 if ($_GET['act'] == 'cut'){    
	//如果需要剪切，则对于网络图先下载为原图，再处理

	$pic_url = $_POST['targetImgSrc'];
	//获取文件名，下载网络图片保存为该文件名，修改image的值
	$image = retrieve($pic_url);
	$csv_path="./uploads/".date("Ymd")."/"; 
	if(!file_exists($csv_path))
	{
	  mkdir($csv_path);
	}
		
	$imageOtherSavePath = $csv_path.md5(uniqid()).".".pathinfo($image,PATHINFO_EXTENSION);//$image ;	
	//mb_substr($image,mb_strrpos($image,'.'));	
	//echo "imageOtherSavePath:".$imageOtherSavePath;
	$data = file_get_contents(iconv("utf-8","gbk",$pic_url));
    file_put_contents($imageOtherSavePath,$data);
	
	$res = $images->thumb($imageOtherSavePath,false,1);
	if($res == false){
	    $json = array(result=>0);
		$encoded = json_encode($json);
	    echo $encoded;
	    unset($encoded);
	}elseif(is_array($res)){
	    $json = array(result=>1,src=>$res['big']);
		$encoded = json_encode($json);
	    echo $encoded;
	    unset($encoded);
	   
	}elseif(is_string($res)){
		$json = array(result=>1,src=>$res);
		$encoded = json_encode($json);
	    echo $encoded;
	    unset($encoded);
	}
		
}

 if ($_GET['act'] == 'update'){ 
  
    $pic_url = $_POST['targetImgSrc'];
	//获取文件名，下载网络图片保存为该文件名，修改image的值
	$image = retrieve($pic_url);
	$csv_path="./uploads/".date("Ymd")."/"; 
	if(!file_exists($csv_path))
	{
	  mkdir($csv_path);
	}
	$imageOtherSavePath = $csv_path.md5(uniqid()).".".pathinfo($image,PATHINFO_EXTENSION);//$image ;	
	
	//echo "imageOtherSavePath:".$imageOtherSavePath;
    $data = file_get_contents(iconv("utf-8","gbk",$pic_url));
    file_put_contents($imageOtherSavePath,$data);
	
	$json = array(result=>1,src=>$imageOtherSavePath);
		$encoded = json_encode($json);
	    echo $encoded;
	    unset($encoded);
	
}
	 
 ?>
  
