
====================当前版本信息====================
当前版本：V1.0.1

发布日期：2012-09-10

文件大小：419 K


====================修改历史====================
V1.0.1  2012-09-10, 腾讯QQ网购开放平台V1版OpenAPI的PHP SDK，1.0表示OpenAPI版本，后一位0表示SDK版本。
        本SDK基于V1版OpenAPI，适用于腾讯QQ网购开放平台上所有应用接入时使用：
        本版本主要在1.0.0基础上修改了部分bug。此版本中将charset固定在url中，格式为： http://www.example.com?charset=utf-8&others...
        解决了传参过程中中文字符出错的问题

V1.0.0  2012-08-21, 腾讯QQ网购开放平台V1版OpenAPI的PHP SDK，1.0表示OpenAPI版本，后一位0表示SDK版本。
        本SDK基于V1版OpenAPI，适用于腾讯QQ网购开放平台上所有应用接入时使用：



====================文件结构信息====================
lib文件夹： 外部库文件，使用的是 php版本的 HttpClient库

src文件夹：OpenAPI访问类
--PaiPaiOpenApiOauth.php文件   :PaiPaiOpenApiOauth类
--index.php文件                :外部访问此程序的入口文件，同时也是示例文件


====================联系作者====================
本PHP SDK由腾讯内部人员编写，如有问题，请随时反馈。
Email:  feihong.zhu@foxmail.com
QQ:     441782353


====================使用说明====================

index.php 是入口文件，用户需要安装Apache+php环境，支持php5.2+版本

具体使用方式请参看 index.php的注释说明