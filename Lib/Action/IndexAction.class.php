<?php

import('@.Util.Util');
import('@.Util.OpenAPI');

class IndexAction extends Action {

    public function index() {
        $this->display();
    }

    public function auth() {
        session('paipai_current_taobao_id', I('taobaoItemId'));
        if (!session('?paipai_access_token')) {
            header('location: http://fuwu.paipai.com/my/app/authorizeGetAccessToken.xhtml?responseType=access_token&appOAuthID='.C('appOAuthId'));
        } else {
            U('Index/authBack', array(), true, true, false);
        }
    }

    public function authBack() {
        if (!session('?paipai_access_token')) {
            session('paipai_access_token', I('?access_token'));
            session('uin', I('useruin'));
            session('sign', I('sign'));
        }

        $taobaoItemId = session('paipai_current_taobao_id');
        $taobaoItem = OpenAPI::getTaobaoItem($taobaoItemId);

        $this->assign(array(
            'basepath' => str_replace('index.php', 'Public', __APP__),
            'memberId' => session('uin'),
            'taobaoItemId' => $taobaoItemId,
            'taobaoItemTitle' => $taobaoItem->title
        ));

        $this->display();
    }

    public function searchCategory() {
        $navigationId = I('navigationId');
        $navigationList = OpenAPI::getNavigationChildList($navigationId);
        $this->ajaxReturn($navigationList, 'JSON');
    }

    public function editPage() {
        $navigationId = I('navigationId');
        $taobaoItem = OpenAPI::getTaobaoItem(I('taobaoItemId'));

        $this->assign(array(
            'memberId' => session('uin'),
            'basepath' => str_replace('index.php', 'Public', __APP__),
            'navigationId' => $navigationId,
            'infoTitle' => $taobaoItem->title,
            'offerWeight' => '0.2',
            'picUrl' => $taobaoItem->pic_url,
            'offerDetail' => $taobaoItem->desc,
            'stockPrice' => $taobaoItem->price
        ));

        $this->display();
    }

    public function getAttributeList() {
        $navigationId = I('navigationId');
        $attributeList = OpenAPI::getAttributeList($navigationId);

        $this->ajaxReturn($attributeList, 'JSON');
    }

    public function addItem() {
        $itemAttrs = array();

        $itemAttrs['sellerUin'] = session('uin');
        $itemAttrs['itemName'] = I('subject');
        $itemAttrs['attr'] = I('attr'); // '31:80020504|30:800|2ef4:3|2ef9:2|516:2|7a4:2|2ee2:3|7a0:2|2b0:2|93b5:3|2ed6:2|93bf:3|79d:2|37:20b|38:f';
        $itemAttrs['classId'] = I('navigationId');
        $itemAttrs['validDuration'] = 1209600;
        $itemAttrs['itemState'] = 'IS_FOR_SALE';
        $itemAttrs['detailInfo'] = $_REQUEST['details'];
        $itemAttrs['sellerPayFreight'] = 1;
        $itemAttrs['freightId'] = 0;
        $itemAttrs['stockPrice'] = I('stockPrice') * 100;
        $itemAttrs['stockCount'] = 100;

        /* auto off */
        $autoOff = I('autoOff');
        if ($autoOff == 'on') {
            $encNumIid = '51chk'.base64_encode(session('paipai_current_taobao_id'));
            $autoOffJpg = 'http://51wangpi.com/'.$encNumIid.'.jpg';
            $autoOffWarnHtml = '<img align="middle" src="'.$autoOffJpg.'"/><br/>';
            $itemAttrs['detailInfo'] = $autoOffWarnHtml.$itemAttrs['detailInfo'];
        }
        /* end */

        $response = OpenAPI::addItem($itemAttrs);
        if ($response->errorCode == 0) {
            /* download image */
            $picUrl = $_REQUEST['picUrl'];
            $localImageFile = '@'.OpenAPI::downloadImage($picUrl);
            $uploadResult = OpenAPI::modifyItemPic(session('uin'), $response->itemCode, $localImageFile);
            unlink(substr($localImageFile,1));
            /* end */

            if ($uploadResult->errorCode == 0) {
                $itemUrl = 'http://auction1.paipai.com/'.$response->itemCode;
                $this->assign(array(
                    'result' => '发布成功啦！',
                    'message' => '宝贝已顺利上架哦！祝生意欣荣，财源广进！',
                    'itemUrl' => '<li><a href="'.$itemUrl.'">来看看刚上架的宝贝吧！</a></li>'
                ));
            } else {
                $this->assign(array(
                    'result' => '商品发布成功，但图片上传失败！ errorCode:'.$uploadResult->errorCode.', errorMessage:'.$uploadResult->errorMessage,
                    'message' => '宝贝没有顺利上架，请不要泄气哦，换个宝贝试试吧！祝生意欣荣，财源广进！',
                    'itemUrl' => ''
                ));
            }
        } else {
            $this->assign(array(
                'result' => '发布失败！ errorCode:'.$response->errorCode.', errorMessage:'.$response->errorMessage,
                'message' => '宝贝没有顺利上架，请不要泄气哦，换个宝贝试试吧！祝生意欣荣，财源广进！',
                'itemUrl' => ''
            ));
        }

        $this->display();
    }

    // 登出
    public function signOut() {
        session(null);
        cookie(null);
        U('Index/index', '', true, true, false);
    }

}