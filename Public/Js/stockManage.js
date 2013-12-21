window['PP.c2cPub.stockManage.time'] && window['PP.c2cPub.stockManage.time'].push(new Date());
function $addToken(url, type) {
    var token = $getToken();
    if (url == "" || (url.indexOf("://") < 0 ? location.href : url).indexOf("http") != 0) {
        return url;
    }
    if (url.indexOf("#")!=-1) {
        var f1 = url.match(/\?.+\#/);
        if (f1) {
            var t = f1[0].split("#"), newPara = [t[0], "&g_tk=", token, "&g_ty=", type, "#", t[1]].join("");
            return url.replace(f1[0], newPara);
        } else {
            var t = url.split("#");
            return [t[0], "?g_tk=", token, "&g_ty=", type, "#", t[1]].join("");
        }
    }
    return token == "" ? (url + (url.indexOf("?")!=-1 ? "&" : "?") + "g_ty=" + type) : (url + (url.indexOf("?")!=-1 ? "&" : "?") + "g_tk=" + token + "&g_ty=" + type);
};
function $addUniq(arr, obj) {
    if (!arr) {
        arr = [obj];
        return arr;
    }
    for (var i = arr.length; i--;) {
        if (arr[i] === obj) {
            return arr;
        }
    }
    arr.push(obj);
    return arr;
};
function $attr(attr, val, node) {
    var results = [], node = node || document.body;
    walk(node, function(n) {
        if (window.__skipHidden && n.type == "hidden" && n.tagName == "INPUT") {
            return false;
        }
        var actual = n.nodeType === 1 && (attr === "class" ? n.className : (n.getAttribute && n.getAttribute(attr)));
        if (typeof actual === 'string' && (actual === val || typeof val !== 'string')) {
            results.push(n);
        }
    });
    return results;
    function walk(n, func) {
        func(n);
        n = n.firstChild;
        while (n) {
            walk(n, func);
            n = n.nextSibling;
        }
    }
};
function $display(ids, state) {
    if (!ids) {
        return;
    }
    var state = state || '';
    if (typeof(ids) == "string") {
        var arr = ids.split(',');
        for (var i = 0, len = arr.length; i < len; i++) {
            var o = $id(arr[i]);
            o && (o.style.display = state);
        }
    } else if (ids.nodeType) {
        ids.style.display = state;
    } else if (ids.length) {
        for (var i = 0, len = ids.length; i < len; i++) {
            $display(ids[i], state)
        }
    } else {
        ids.style.display = state;
    }
};
function $displayHide(ids) {
    $display(ids, 'none');
};
function $empty() {
    return function() {
        return true;
    }
};
function $extend() {
    var target = arguments[0] || {}, i = 1, length = arguments.length, options;
    if (typeof target != "object" && typeof target != "function")
        target = {};
    for (; i < length; i++)
        if ((options = arguments[i]) != null)
            for (var name in options) {
                var copy = options[name];
                if (target === copy)
                    continue;
                    if (copy !== undefined)
                        target[name] = copy;
            }
    return target;
};
function $fireEvent(dom, type, eType) {
    var dom = $id(dom), type = type || "click", eType = eType || "MouseEvents";
    if (dom == document && document.createEvent&&!dom.dispatchEvent) {
        dom = document.documentElement;
    }
    var e;
    if (document.createEvent) {
        e = document.createEvent(eType);
        e.initEvent(type, true, true);
        dom.dispatchEvent(e);
    } else {
        e = document.createEventObject();
        e.eventType = "on" + type;
        dom.fireEvent(e.eventType, event);
    }
};
function $float(opt) {
    var option = {
        id: "",
        left: 0,
        top: 0,
        width: 400,
        height: 0,
        title: "",
        html: "",
        leaver: 2,
        zindex: 255,
        autoResize: false,
        cover: true,
        dragble: false,
        fix: false,
        titleId: "",
        showClose: true,
        closeId: "",
        bgframeLeft: -2,
        bgframeTop: -2,
        cName: "module_box_normal vt_float",
        style: "stand",
        contentStyle: "",
        cssUrl: window.config_float_css || "http://static.paipaiimg.com/module/module_box.css",
        onInit: $empty(),
        onClose: $empty()
    };
    for (var i in opt) {
        option[i] = opt[i];
    }
    var that = arguments.callee;
    var _host = window.location.hostname, _isQQ = _host.indexOf("qq.com")!=-1, _isBBC = _host.indexOf("buy.qq.com")!=-1, _isPP = _host.indexOf("paipai.com")!=-1;
    if (_isPP) {
        option.bgframeLeft = 0;
        option.bgframeTop = 0;
    }
    that.data ? "" : init(option.cssUrl);
    option.id = option.id ? option.id : ++that.data.zIndex;
    option.close = closeFloat;
    option.destruct = destructFloat;
    option.closeOther = closeOther;
    option.keepBoxFix = keepBoxFix;
    option.resize = resize;
    option.show = showBox;
    option.setPos = setPos;
    option.closeOther();
    option.show();
    that.data.list.push(option);
    if (option.dragble) {
        $initDragItem({
            barDom: option.boxTitleHandle,
            targetDom: option.boxHandle
        });
    }
    return option;
    function closeFloat() {
        if (!option.onClose(option)) {
            return;
        }
        option.closeOther();
        option.destruct();
    }
    function destructFloat() {
        var _this = this;
        _this.cover ? that.data.closeCover() : "";
        if (_this.sizeTimer) {
            clearInterval(_this.sizeTimer);
        }
        if (_this.fixTimer) {
            clearInterval(_this.fixTimer);
        }
        _this.boxHandle ? document.body.removeChild(_this.boxHandle) : "";
        _this.boxHandel = _this.boxHandle = null;
        for (var i = 0, l = that.data.list.length; i < l; i++) {
            if (!that.data.list[i]) {
                continue;
            }
            if (_this.id == that.data.list[i].id) {
                that.data.list[i] = null;
            }
        }
        if (_this.closeId) {
            var arrClose = _this.closeId.split(",");
            for (var l = arrClose.length; l--;) {
                var _el = $id(arrClose[l]);
                if (_el) {
                    _el.onclick = null;
                    _el = null;
                }
            }
        }
    }
    function closeOther() {
        for (var i = 0, l = that.data.list.length; i < l; i++) {
            if (!that.data.list[i]) {
                continue;
            }
            if (that.data.list[i].leaver >= this.leaver && this.id != that.data.list[i].id) {
                that.data.list[i].destruct();
            }
        }
    }
    function showBox() {
        this.cover ? that.data.showCover() : "";
        var c = document.createElement("div"), content = "", _style = option.contentStyle ? (' style="' + option.contentStyle + '" '): "";
        c.id = this.boxId = 'float_box_' + this.id;
        c.style.position = "absolute";
        if ($isBrowser("ie6")) {
            content = '<iframe frameBorder="0" style="position:absolute;left:' + option.bgframeLeft + 'px;top:' + option.bgframeTop + 'px;z-index:-1;border:none;" id="float_iframe_' + this.id + '"></iframe>';
        }
        switch (option.style + "") {
        case"stand":
            c.className = option.cName;
            c.innerHTML = content + '<div class="box_title" id="float_title_' + this.id + '"><a href="javascript:;" style="display:' + (this.showClose ? '' : 'none') + ';"  class="bt_close" id="float_closer_' + this.id + '">×</a><h4>' + this.title + '</h4></div><div class="box_content" ' + _style + '>' + this.html + '</div>';
            break;
        case"":
            c.className = option.cName;
            c.innerHTML = content + '<div class="box_content" ' + _style + ' id="float_title_' + this.id + '">' + this.html + '</div>';
            break;
        case"none":
            c.className = "";
            c.innerHTML = content + '<div class="box_content" ' + _style + ' id="float_title_' + this.id + '">' + this.html + '</div>';
            break;
        case"new":
            c.className = option.cName;
            c.innerHTML = content + '<div class="layer_inner"><div class="layer_hd" ' + _style + ' id="float_title_' + this.id + '"><div class="layer_hd_title">' + this.title + '</div><a href="javascript:void(0);" class="layer_hd_close" id="float_closer_' + this.id + '">close</a></div><div class="layer_bd">' + this.html + '</div></div></div>';
            break;
        }
        document.body.appendChild(c);
        c = null;
        this.boxHandel = this.boxHandle = $id('float_box_' + this.id);
        if ($isBrowser("ie6")) {
            this.boxIframeHandle = $id('float_iframe_' + this.id);
        }
        this.boxTitleHandle = $id(option.titleId || ('float_title_' + this.id));
        this.boxCloseHandle = $id('float_closer_' + this.id);
        this.height ? (this.boxHandle.style.height = (option.height == "auto" ? option.height : option.height + "px")) : "";
        this.width ? (this.boxHandle.style.width = (option.width == "auto" ? option.width : option.width + "px")) : "";
        this.boxHandle.style.zIndex = that.data.zIndex;
        this.sw = parseInt(this.boxHandle.offsetWidth);
        this.sh = parseInt(this.boxHandle.offsetHeight);
        this.setPos();
        var _this = this;
        _this.boxCloseHandle ? _this.boxCloseHandle.onclick = function() {
            _this.close();
            return false;
        } : "";
        if (_this.closeId) {
            var arrClose = _this.closeId.split(",");
            for (var l = arrClose.length; l--;) {
                var _el = $id(arrClose[l]);
                if (_el) {
                    _el.onclick = function() {
                        _this.close();
                        return false;
                    };
                    _el = null;
                }
            }
        }
        _this.keepBoxFix();
        if (!_this.onInit(option)) {
            return;
        }
    }
    function setPos(left, top) {
        var psw = $getPageScrollWidth(), ww = $getWindowWidth(), psh = $getPageScrollHeight(), wh = $getWindowHeight();
        var p = [0, 0];
        left && (this.left = left);
        top && (this.top = top);
        p[0] = parseInt(this.left ? this.left : (psw + (ww - this.sw) / 2));
        p[1] = parseInt(this.top ? this.top : (psh + (wh - this.sh) / 2));
        (p[0] + this.sw) > (psw + ww) ? (p[0] = psw + ww - this.sw-10) : "";
        (p[1] + this.sh) > (psh + wh) ? (p[1] = psh + wh - this.sh-10) : "";
        p[1] < psh ? p[1] = psh : "";
        p[0] < psw ? p[0] = psw : "";
        if ($isBrowser("ie6")) {
            this.boxIframeHandle.height = (this.sh-2) + "px";
            this.boxIframeHandle.width = (this.sw-2) + "px";
        }
        this.boxHandle.style.left = p[0] + "px";
        this.boxHandle.style.top = p[1] + "px";
        this.keepBoxFix();
    }
    function resize(w, h) {
        if (w && w.constructor === Number) {
            this.sw = w;
            this.boxHandle.style.width = this.sw + "px";
            if ($isBrowser("ie6")) {
                this.boxIframeHandle.width = (this.sw-2) + "px";
            }
        }
        if (h && h.constructor === Number) {
            this.sh = h;
            this.boxHandle.style.height = this.sh + "px";
            if ($isBrowser("ie6")) {
                this.boxIframeHandle.height = (this.sh-2) + "px";
            }
        }
        this.setPos();
    }
    function keepBoxFix() {
        if (this.fix) {
            var _this = this;
            if ($isBrowser("ie6")) {
                !_this.fixTimer && (_this.fixTimer = setInterval(function() {
                    _this.boxHandle.style.left = (_this.left ? _this.left : ($getPageScrollWidth() + ($getWindowWidth() - _this.sw) / 2)) + "px";
                    _this.boxHandle.style.top = (_this.top ? _this.top : ($getPageScrollHeight() + ($getWindowHeight() - _this.sh) / 2)) + "px";
                }, 30));
            } else {
                _this.boxHandle.style.position = "fixed";
                _this.boxHandle.style.left = (_this.left ? _this.left : ($getWindowWidth() - _this.sw) / 2) + "px";
                _this.boxHandle.style.top = (_this.top ? _this.top : ($getWindowHeight() - _this.sh) / 2) + "px";
            }
        }
    }
    function autoResize() {
        if (this.autoResize) {
            var _this = this;
            _this.sizeTimer = setInterval(function() {
                _this.sw = _this.boxHandle.offsetWidth;
                _this.sh = _this.boxHandle.offsetHeight;
                if ($isBrowser("ie6")) {
                    _this.boxIframeHandle.height = (_this.sh-2) + "px";
                    _this.boxIframeHandle.width = (_this.sw-2) + "px";
                }
            }, 50);
        }
    }
    function init(cssUrl) {
        if (cssUrl) {
            $loadCss(cssUrl);
        }
        that.data = {};
        that.data.zIndex = option.zindex;
        that.data.list = [];
        createCover();
        that.data.showCover = showCover;
        that.data.closeCover = closeCover;
        function createCover() {
            var c = document.createElement("div");
            c.id = "float_cover";
            c.style.display = "none";
            c.style.width = "0px";
            c.style.height = "0px";
            c.style.backgroundColor = "#cccccc";
            c.style.zIndex = 250;
            c.style.position = "fixed";
            c.style.hasLayout =- 1;
            c.style.left = "0px";
            c.style.top = "0px";
            c.style.filter = "alpha(opacity=50);";
            c.style.opacity = "0.5";
            document.body.appendChild(c);
            if ($isBrowser("ie6")) {
                c.innerHTML = '<iframe frameBorder="0" style="position:absolute;left:0;top:0;width:100%;z-index:-1;border:none;" id="float_cover_iframe"></iframe>';
                c.style.position = "absolute";
            }
            that.data.cover = $id("float_cover");
            that.data.coverIframe = $id("float_cover_iframe");
            that.data.coverIsShow = false;
            that.data.coverSize = [0, 0];
            c = null;
        }
        function showCover() {
            that.data.cover.style.display = "block";
            that.data.coverIsShow = true;
            keepCoverShow();
            that.data.coverTimer = setInterval(function() {
                keepCoverShow();
            }, 50);
            function keepCoverShow() {
                var _d = that.data;
                if (_d.coverIsShow) {
                    var ch = $getContentHeight(), wh = $getWindowHeight(), cw = $getContentWidth(), ww = $getWindowWidth(), ns = [wh, ww];
                    if ($isBrowser("ie6")) {
                        _d.cover.style.top = $getPageScrollHeight() + "px";
                    }
                    if (ns.toString() != that.data.coverSize.toString()) {
                        _d.coverSize = ns;
                        _d.cover.style.height = ns[0].toFixed(0) + "px";
                        _d.cover.style.width = ns[1].toFixed(0) + "px";
                        if (_d.coverIframe) {
                            _d.coverIframe.style.height = ns[0].toFixed(0) + "px";
                            _d.coverIframe.style.width = ns[1].toFixed(0) + "px";
                        }
                    }
                }
            }
        }
        function closeCover() {
            that.data.cover.style.display = "none";
            that.data.coverIsShow = false;
            clearInterval(that.data.coverTimer);
        }
    }
};
function $getContentHeight() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox')==-1) ? bodyCath.scrollHeight : doeCath.scrollHeight;
};
function $getContentWidth() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox')==-1) ? bodyCath.scrollWidth : doeCath.scrollWidth;
};
function $getCookie(name) {
    var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
    return val ? (val[2] ? unescape(val[2]) : "") : null;
};
function $getFirst(elem) {
    elem = elem.firstChild;
    return elem && elem.nodeType != 1 ? $getNext(elem) : elem;
};
function $getLast(elem) {
    elem = elem.lastChild;
    return elem && elem.nodeType != 1 ? $getPrev(elem) : elem;
};
function $getMousePosition(e) {
    var e = window.event ? window.event: e;
    if (e.evt)
        e = e.evt;
    var pos = [];
    if (typeof e.pageX != "undefined") {
        pos = [e.pageX, e.pageY];
    } else if (typeof e.clientX != "undefined") {
        pos = [e.clientX + $getScrollPosition()[0], e.clientY + $getScrollPosition()[1]];
    }
    return pos;
};
function $getNext(elem) {
    do {
        elem = elem.nextSibling;
    }
    while (elem && elem.nodeType != 1);
    return elem;
};
function $getPageScrollHeight() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    var ua = navigator.userAgent.toLowerCase();
    return (window.MessageEvent && ua.indexOf('firefox')==-1 && ua.indexOf('opera')==-1 && ua.indexOf('msie')==-1) ? bodyCath.scrollTop : doeCath.scrollTop;
};
function $getPageScrollWidth() {
    var bodyCath = document.body;
    var doeCath = document.compatMode == 'BackCompat' ? bodyCath: document.documentElement;
    return (window.MessageEvent && navigator.userAgent.toLowerCase().indexOf('firefox')==-1) ? bodyCath.scrollLeft : doeCath.scrollLeft;
};
function $getPrev(elem) {
    do {
        elem = elem.previousSibling;
    }
    while (elem && elem.nodeType != 1);
    return elem;
};
function $getScrollPosition() {
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
    return [scrollLeft ? scrollLeft: 0, scrollTop ? scrollTop: 0];
};
function $getTarget(e, parent, tag) {
    var e = window.event || e, tar = e.srcElement || e.target;
    if (parent && tag && tar.nodeName.toLowerCase() != tag) {
        while (tar = tar.parentNode) {
            if (tar == parent || tar == document.body || tar == document) {
                return null;
            } else if (tar.nodeName.toLowerCase() == tag) {
                break;
            }
        }
    };
    return tar;
};
function $getToken() {
    var skey = $getCookie("skey"), token = skey == null ? "": $time33(skey);
    return token;
};
function $getUin() {
    var uin = $getCookie("uin") || $getCookie('uin_cookie') || $getCookie('pt2gguin') || $getCookie('o_cookie') || $getCookie('luin') || $getCookie('buy_uin');
    return uin ? parseInt(uin.replace("o", ""), 10) : "";
};
function $getWindowHeight() {
    var bodyCath = document.body;
    return (document.compatMode == 'BackCompat' ? bodyCath : document.documentElement).clientHeight;
};
function $getWindowWidth() {
    var bodyCath = document.body;
    return (document.compatMode == 'BackCompat' ? bodyCath : document.documentElement).clientWidth;
};
function $getY(e) {
    var t = e.offsetTop || 0;
    while (e = e.offsetParent) {
        t += e.offsetTop;
    }
    return t;
};
function $getYP(e) {
    var t = $getY(e), e = e.parentNode;
    while (0 === t && document.body != e) {
        t = $getY(e);
        e = e.parentNode;
    }
    return t;
};
function $id(id) {
    return typeof(id) == "string" ? document.getElementById(id) : id;
};
function $inArray(t, arr) {
    if (arr.indexOf) {
        return arr.indexOf(t);
    }
    for (var i = arr.length; i--;) {
        if (arr[i] === t) {
            return i * 1;
        }
    };
    return -1;
};
function $initDragItem(opt) {
    var option = {
        barDom: "",
        targetDom: ""
    };
    for (var i in opt) {
        option[i] = opt[i];
    }
    var that = arguments.callee;
    that.option ? "" : that.option = {};
    option.barDom.style.cursor = 'move';
    option.targetDom.style.position = "absolute";
    option.barDom.onmousedown = function(e) {
        var e = window.event || e;
        that.option.barDom = this;
        that.option.targetDom = option.targetDom;
        var currPostion = [parseInt(option.targetDom.style.left) ? parseInt(option.targetDom.style.left): 0, parseInt(option.targetDom.style.top) ? parseInt(option.targetDom.style.top): 0];
        that.option.diffPostion = [$getMousePosition({
            evt: e
        })[0] - currPostion[0], $getMousePosition({
            evt: e
        })[1] - currPostion[1]];
        document.onselectstart = function() {
            return false;
        };
        window.onblur = window.onfocus = function() {
            document.onmouseup();
        };
        return false;
    };
    option.targetDom.onmouseup = document.onmouseup = function() {
        if (that.option.barDom) {
            that.option = {};
            document.onselectstart = window.onblur = window.onfocus = null;
        }
    };
    option.targetDom.onmousemove = document.onmousemove = function(e) {
        try {
            var e = window.event || e;
            if (that.option.barDom && that.option.targetDom) {
                that.option.targetDom.style.left = ($getMousePosition({
                    evt: e
                })[0] - that.option.diffPostion[0]) + "px";
                that.option.targetDom.style.top = ($getMousePosition({
                    evt: e
                })[1] - that.option.diffPostion[1]) + "px";
            }
        } catch (e) {}
    };
};
function $isBrowser(str) {
    str = str.toLowerCase();
    var b = navigator.userAgent.toLowerCase();
    var arrB = [];
    arrB['firefox'] = b.indexOf("firefox")!=-1;
    arrB['opera'] = b.indexOf("opera")!=-1;
    arrB['safari'] = b.indexOf("safari")!=-1;
    arrB['chrome'] = b.indexOf("chrome")!=-1;
    arrB['gecko']=!arrB['opera']&&!arrB['safari'] && b.indexOf("gecko")>-1;
    arrB['ie']=!arrB['opera'] && b.indexOf("msie")!=-1;
    arrB['ie6']=!arrB['opera'] && b.indexOf("msie 6")!=-1;
    arrB['ie7']=!arrB['opera'] && b.indexOf("msie 7")!=-1;
    arrB['ie8']=!arrB['opera'] && b.indexOf("msie 8")!=-1;
    arrB['ie9']=!arrB['opera'] && b.indexOf("msie 9")!=-1;
    arrB['ie10']=!arrB['opera'] && b.indexOf("msie 10")!=-1;
    return arrB[str];
};
function $isEmptyObj(obj) {
    if (!obj ||!(typeof obj == "object")) {
        return true;
    }
    for (var key in obj) {
        return false;
    }
    return true;
};
function $loadCss(path, callback) {
    if (!path) {
        return;
    }
    var l;
    if (!window["_loadCss"] || window["_loadCss"].indexOf(path) < 0) {
        l = document.createElement('link');
        l.setAttribute('type', 'text/css');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('href', path);
        l.setAttribute("id", "loadCss" + Math.random());
        document.getElementsByTagName("head")[0].appendChild(l);
        window["_loadCss"] ? (window["_loadCss"] += "|" + path) : (window["_loadCss"] = "|" + path);
    }
    l && (typeof callback == "function") && (l.onload = callback);
    return true;
};
function $loadScript(obj) {
    if (!$loadScript.counter) {
        $loadScript.counter = 1;
    }
    var isObj = typeof(obj) == "object", url = isObj ? obj.url: arguments[0], id = isObj ? obj.id: arguments[1], obj = isObj ? obj: arguments[2], _head = document.head || document.getElementsByTagName("head")[0] || document.documentElement, _script = document.createElement("script"), D = new Date(), _time = D.getTime(), _isCleared = false, _timer = null, o = obj || {}, data = o.data || '', charset = o.charset || "gb2312", isToken = o.isToken, timeout = o.timeout, isAutoReport = o.isAutoReport || false, reportOptions = o.reportOptions || {}, reportType = o.reportType || 'current', reportRetCodeName = o.reportRetCodeName, reportSuccessCode = typeof(o.reportSuccessCode) == "undefined" ? 200: o.reportSuccessCode, reportErrorCode = typeof(o.reportErrorCode) == "undefined" ? 500: o.reportErrorCode, reportTimeoutCode = typeof(o.reportTimeoutCode) == "undefined" ? 600: o.reportTimeoutCode, onload = o.onload, onsucc = o.onsucc, callbackName = o.callbackName || '', callback = o.callback, errorback = o.errorback, _jsonpLoadState = 'uninitialized';
    var complete = function(errCode) {
        if (!_script || _isCleared) {
            return;
        }
        _isCleared = true;
        if (_timer) {
            clearTimeout(_timer);
            _timer = null;
        }
        _script.onload = _script.onreadystatechange = _script.onerror = null;
        if (_head && _script.parentNode) {
            _head.removeChild(_script);
        }
        _script = null;
        if (callbackName) {
            if (callbackName.indexOf('.')==-1) {
                window[callbackName] = null;
                try {
                    delete window[callbackName];
                } catch (e) {}
            } else {
                var arrJ = callbackName.split("."), p = {};
                for (var j = 0, jLen = arrJ.length; j < jLen; j++) {
                    var n = arrJ[j];
                    if (j == 0) {
                        p = window[n];
                    } else {
                        if (j == jLen-1) {
                            try {
                                delete p[n];
                            } catch (e) {}
                        } else {
                            p = p[n];
                        }
                    }
                }
            }
        }
        if (_jsonpLoadState != "loaded" && typeof errorback == "function") {
            errorback(errCode);
        }
        if (isAutoReport && reportType != 'cross') {
            _retCoder.report(_jsonpLoadState == "loaded", errCode);
        }
    };
    var jsontostr = function(d) {
        var a = [];
        for (var k in d) {
            a.push(k + '=' + d[k]);
        }
        return a.join('&');
    };
    if (isAutoReport && reportOptions) {
        if (reportType == 'cross') {
            $returnCode(reportOptions).reg();
        } else {
            reportOptions.url = reportOptions.url || url.substr(0, url.indexOf('?')==-1 ? url.length : url.indexOf('?'));
            var _retCoder = $returnCode(reportOptions);
        }
    }
    if (data) {
        url += (url.indexOf("?")!=-1 ? "&" : "?") + (typeof data == 'string' ? data : jsontostr(data));
    }
    if (callbackName && typeof callback == "function") {
        var oldName = callbackName;
        if (callbackName.indexOf('.')==-1) {
            callbackName = window[callbackName] ? callbackName + $loadScript.counter++ : callbackName;
            window[callbackName] = function(jsonData) {
                _jsonpLoadState = 'loaded';
                if (isAutoReport && reportRetCodeName) {
                    reportSuccessCode = jsonData[reportRetCodeName];
                }
                callback.apply(null, arguments);
                onsucc && (onsucc());
            };
        } else {
            var arrJ = callbackName.split("."), p = {}, arrF = [];
            for (var j = 0, jLen = arrJ.length; j < jLen; j++) {
                var n = arrJ[j];
                if (j == 0) {
                    p = window[n];
                } else {
                    if (j == jLen-1) {
                        p[n] ? (n = n + $loadScript.counter++) : '';
                        p[n] = function(jsonData) {
                            _jsonpLoadState = 'loaded';
                            if (isAutoReport && reportRetCodeName) {
                                reportSuccessCode = jsonData[reportRetCodeName];
                            }
                            callback.apply(null, arguments);
                            onsucc && (onsucc());
                        };
                    } else {
                        p = p[n];
                    }
                }
                arrF.push(n);
            }
            callbackName = arrF.join('.');
        }
        url = url.replace('=' + oldName, '=' + callbackName);
    }
    _jsonpLoadState = 'loading';
    id = id ? (id + _time) : _time;
    url = (isToken !== false ? $addToken(url, "ls") : url);
    _script.charset = charset;
    _script.id = id;
    _script.onload = _script.onreadystatechange = function() {
        var uA = navigator.userAgent.toLowerCase();
        if (!(!(uA.indexOf("opera")!=-1) && uA.indexOf("msie")!=-1) || /loaded|complete/i.test(this.readyState)) {
            if (typeof onload == "function") {
                onload();
            }
            complete(_jsonpLoadState == "loaded" ? reportSuccessCode : reportErrorCode);
        }
    };
    _script.onerror = function() {
        complete(reportErrorCode);
    };
    if (timeout) {
        _timer = setTimeout(function() {
            complete(reportTimeoutCode);
        }, parseInt(timeout, 10));
    }
    setTimeout(function() {
        _script.src = url;
        try {
            _head.insertBefore(_script, _head.lastChild);
        } catch (e) {}
    }, 0);
};
function $loadUrl(o) {
    o.element = o.element || 'script';
    var el = document.createElement(o.element);
    el.charset = o.charset || 'utf-8';
    if (o.noCallback == true) {
        el.setAttribute("noCallback", "true");
    }
    el.onload = el.onreadystatechange = function() {
        if (/loaded|complete/i.test(this.readyState) || navigator.userAgent.toLowerCase().indexOf("msie")==-1) {
            clear();
        }
    };
    el.onerror = function() {
        clear();
    };
    el.src = o.url;
    document.getElementsByTagName('head')[0].appendChild(el);
    function clear() {
        if (!el) {
            return;
        }
        el.onload = el.onreadystatechange = el.onerror = null;
        el.parentNode && (el.parentNode.removeChild(el));
        el = null;
    }
};
function $report(url) {
    $loadUrl({
        'url': url + ((url.indexOf('?')==-1) ? '?' : '&') + Math.random(),
        'element': 'img'
    });
};
function $returnCode(opt) {
    var option = {
        url: "",
        action: "",
        sTime: "",
        eTime: "",
        retCode: "",
        errCode: "",
        frequence: 1,
        refer: location.href,
        uin: "",
        domain: "paipai.com",
        from: 1,
        report: report,
        isReport: false,
        timeout: 3000,
        timeoutCode: 444,
        formatUrl: true,
        reg: reg
    };
    for (var i in opt) {
        option[i] = opt[i];
    }
    if (option.url) {
        option.sTime = new Date();
    }
    if (option.timeout) {
        setTimeout(function() {
            if (!option.isReport) {
                option.report(false, option.timeoutCode);
            }
        }, option.timeout);
    }
    function reg() {
        this.sTime = new Date();
        if (!this.action) {
            return;
        }
        var rcookie = $getCookie("retcode"), cookie2 = [];
        rcookie = rcookie ? rcookie.split("|") : [];
        for (var i = 0; i < rcookie.length; i++) {
            if (rcookie[i].split(",")[0] != this.action) {
                cookie2.push(rcookie[i]);
            }
        }
        cookie2.push(this.action + "," + this.sTime.getTime());
        $setCookie("retcode", cookie2.join("|"), 60, "/", this.domain);
    }
    function report(ret, errid) {
        this.isReport = true;
        this.eTime = new Date();
        this.retCode = ret ? 1 : 2;
        this.errCode = isNaN(parseInt(errid)) ? "0" : parseInt(errid);
        if (this.action) {
            this.url = "http://retcode.paipai.com/" + this.action;
            var rcookie = $getCookie("retcode"), ret = "", ncookie = [];
            rcookie = rcookie ? rcookie.split("|") : [];
            for (var i = 0; i < rcookie.length; i++) {
                if (rcookie[i].split(",")[0] == this.action) {
                    ret = rcookie[i].split(",");
                } else {
                    ncookie.push(rcookie[i]);
                }
            }
            $setCookie("retcode", ncookie.join("|"), 60, "/", this.domain);
            if (!ret) {
                return;
            }
            this.sTime = new Date(parseInt(ret[1]));
        }
        if (!this.url) {
            return;
        }
        var domain = this.url.replace(/^.*\/\//, '').replace(/\/.*/, ''), timer = this.eTime - this.sTime, cgi = encodeURIComponent(this.formatUrl ? this.url.match(/^[\w|/ | . | : |-] * /)[0]:this.url);this.reportUrl="http:/ / c.isdspeed.qq.com / code.cgi ? domain = "+domain+" & cgi = "+cgi+" & type = "+this.retCode+" & code = "+this.errCode+" & time = "+timer+" & rate = "+this.frequence+(this.uin?(" & uin = "+this.uin):"");if(this.reportUrl&&Math.random()<(1/this.frequence)&&this.url){$report(this.reportUrl);}}
        return option;
    }; function $saleAttrsSelector(option) {
        var _AreaHTML = '<ul class="attr_list attr_list_compact"></ul>'; var _ListHTML = '\
        <% for(var i=0;i<attrs.length;i++){var attr=attrs[i];%>\
        <% if(attr.id=="42914"){%>\
        <li control="42914" style="display:none">\
        <div class="attr_tit"></div>\
        <div class="attr_cnt"><button onclick="$display($getNext(this.parentNode.parentNode));$displayHide(this.parentNode.parentNode);return false;" type="button">自定义库存</button></div>\
        </li>\
        <% }%>\
        <li>\
        <div class="attr_tit">\
        <% if(attr.isRequired){%>\
        <em class="asterisk">*</em>\
        <% }%>\
        <% if(attr.canRename){%>\
        <input type="text" class="input_new_attr" attrid="<%=attr.id%>" value="<%=(attr.customName||attr.name)%>">：\
        <% }else{%>\
        <%=attr.name%>：\
        <% }%>\
        </div>\
        <div class="attr_cnt" attrid="<%=attr.id%>"></div>\
        </li>\
        <% }%>\
        '; var _InVaildCustomNameReg = /[^\u4e00-\u9fa5\w\*\(\) （）\.\/\\\-%\@\+]/g; var opt = {
            dom : null, tmpl : {
                areaHTML : _AreaHTML, listHTML : _ListHTML
            }, attrs : [], vals : {}, isEditMode : true, customMaxLength : 20, customInVaildNameReg : _InVaildCustomNameReg, onChange : function() {}
        };
        $extend(opt, option);
        if (!opt.dom) {
            alert("不可用的dom节点，无法初始化");
            return false;
        }
        if (!opt.attrs.length) {
            alert("无销售属性,无法初始化");
            return false;
        }
        var Data = {
            vals: {},
            attrs: [],
            attrsMap: {},
            inVaildNameMap: {},
            nameCustomAttr: function(attrid, customName) {
                var attr = this.attrsMap[attrid];
                if (attr) {
                    var customName = customName.replace(opt.customInVaildNameReg || "", "").substr(0, opt.customMaxLength);
                    if (!customName)
                        return false;
                    if (attr.name != customName && attr.customName != customName) {
                        if (!this.inVaildNameMap[customName]) {
                            if (attr.customName) {
                                delete this.inVaildNameMap[attr.customName];
                            }
                            attr.customName = customName;
                            this.inVaildNameMap[customName] = 1;
                        } else {
                            return false;
                        }
                    } else if (attr.name == customName) {
                        if (attr.customName) {
                            delete this.inVaildNameMap[attr.customName];
                        }
                        delete attr.customName;
                    }
                    return customName;
                }
            },
            init: function() {
                this.vals = {};
                this.attrs = [];
                this.attrsMap = {};
                this.inVaildNameMap = {};
                for (var i = 0; i < opt.attrs.length; i++) {
                    var attr = opt.attrs[i];
                    var obj = {
                        id: attr.id,
                        name: attr.name,
                        children: attr.opList,
                        isRequired: !!(attr.property & 0x20000),
                        canModify: !!(attr.property & 0x4000),
                        canRemark: !!(attr.property & 0x4000 && attr.property & 0x10&&!(attr.property & 0x20)),
                        canRename: !!(attr.property & 0x2000)
                    };
                    if (!opt.isEditMode && obj.id == "42914"&&!obj.isRequired) {
                        continue;
                    }
                    if (obj.canRemark) {
                        obj.canModify = false;
                    }
                    if (obj.id == "42914") {
                        obj.canModify = true;
                        obj.canRemark = false;
                        obj.canRename = true;
                    } else if (obj.id == "49") {
                        obj.canModify = true;
                        obj.canRemark = false;
                        obj.canRename = false;
                    }
                    this.attrs.push(obj);
                    this.attrsMap[obj.id] = obj;
                    this.inVaildNameMap[obj.name] = 1;
                }
                for (var i in opt.vals) {
                    var ret = (i + "").match(/^(\d+)(\?[^#]+)?$/);
                    if (ret && ret.length == 3) {
                        var attr = this.attrsMap[ret[1]];
                        if (attr) {
                            if (ret[2]) {
                                var customName = ret[2].replace(opt.customInVaildNameReg || "", "").substr(0, opt.customMaxLength);
                                if (customName != attr.name&&!this.inVaildNameMap[customName]) {
                                    attr.customName = customName;
                                    this.inVaildNameMap[customName] = 1;
                                }
                            }
                            this.vals[attr.id] = opt.vals[i];
                        }
                    }
                }
            }
        };
        Data.init();
        var tempDom = document.createElement("div");
        tempDom.innerHTML = opt.tmpl.areaHTML;
        var areaDom = $getLast(tempDom);
        opt.dom.innerHTML = "";
        opt.dom.appendChild(areaDom);
        areaDom.flush = function() {
            this.innerHTML = $txTpl(opt.tmpl.listHTML, {
                attrs: Data.attrs
            });
            var that = this;
            var doms = $attr("attrid", true, this);
            for (var i = 0; i < doms.length; i++) {
                var dom = doms[i];
                var attrid = dom.getAttribute("attrid");
                var attr = Data.attrsMap[attrid];
                if (attr) {
                    if (dom.tagName == "INPUT") {
                        dom.onfocus = function() {
                            var attr = Data.attrsMap[this.getAttribute("attrid")];
                            if (attr.name == this.value) {
                                this.value = "";
                            }
                        };
                        dom.onblur = function() {
                            var attr = Data.attrsMap[this.getAttribute("attrid")];
                            var val = Data.nameCustomAttr(attr.id, $strTrim(this.value) || attr.name);
                            if (val === false) {
                                alert("不能使用已有属性名，且属性名不能重复！");
                            }
                            this.value = val || attr.customName || attr.name;
                            opt.change();
                        };
                    } else if (dom.tagName == "DIV") {
                        if (attr.id == "49") {
                            attr.selector = colorMultiSelector_sas({
                                dom: dom,
                                vals: Data.vals["49"],
                                canModify: opt.isEditMode,
                                canDefine: opt.isEditMode,
                                onChange: function() {
                                    opt.change();
                                }
                            });
                        } else {
                            attr.selector = attrMultiSelector_sas({
                                dom: dom,
                                vals: Data.vals[attr.id],
                                canModify: (attr.canModify & opt.isEditMode),
                                canRemark: (attr.canRemark & opt.isEditMode),
                                children: attr.children,
                                onChange: function() {
                                    opt.change();
                                }
                            });
                        }
                        if (attr.id == "42914" && (!Data.vals[attr.id] || Data.vals[attr.id].length == 0)) {
                            var controlDom = $attr("control", "42914", that)[0];
                            if (controlDom) {
                                $display(controlDom);
                                $displayHide($getNext(controlDom));
                            }
                        }
                    }
                }
            }
        }
        areaDom.flush();
        opt.check = function() {
            for (var i = 0; i < Data.attrs.length; i++) {
                var attr = Data.attrs[i];
                if (attr.isRequired) {
                    var attrval = attr.selector.getValue();
                    if (!attrval || attrval.length == 0) {
                        return false;
                    }
                }
            }
            return true;
        }
        opt.getValue = function() {
            var vals = [];
            for (var i = 0; i < Data.attrs.length; i++) {
                var attr = Data.attrs[i];
                var obj = {};
                obj.key = attr.id;
                if (attr.canRename && attr.customName && attr.customName != attr.name) {
                    obj.key += ("?" + attr.customName);
                }
                obj.val = attr.selector.getValue() || [];
                vals.push(obj);
            }
            return vals;
        }
        opt.getValueStr = function() {
            var vals = this.getValue();
            var str = [];
            for (var i = 0; i < vals.length; i++) {
                if (vals[i].val && vals[i].val.length > 0) {
                    str.push(vals[i].key + ":" + vals[i].val.join(","));
                }
            }
            return str.join("|");
        }
        opt.getMapValue = function() {
            var vals = {};
            for (var i in Data.attrsMap) {
                var attr = Data.attrsMap[i];
                var k = i;
                if (attr.canRename && attr.customName && attr.customName != attr.name) {
                    k += ("?" + attr.customName);
                }
                vals[k] = attr.selector.getValue() || [];
            }
            return vals;
        }
        opt.getTextValue = function() {
            var vals = [];
            for (var i = 0; i < Data.attrs.length; i++) {
                var attr = Data.attrs[i];
                var obj = {};
                if (attr.canRename && attr.customName && attr.customName != attr.name) {
                    obj.key = attr.customName;
                } else {
                    obj.key = attr.name;
                }
                obj.val = attr.selector.getTextValue() || [];
                vals.push(obj);
            }
            return vals;
        }
        opt.getTextValueStr = function() {
            var vals = this.getTextValue();
            var str = [];
            for (var i = 0; i < vals.length; i++) {
                if (vals[i].val && vals[i].val.length > 0) {
                    str.push(vals[i].key + ":" + vals[i].val.join(","));
                }
            }
            return str.join("|");
        }
        opt.getMapTextValue = function() {
            var vals = {};
            for (var i in Data.attrsMap) {
                var attr = Data.attrsMap[i];
                var k = "";
                if (attr.canRename && attr.customName && attr.customName != attr.name) {
                    k = attr.customName;
                } else {
                    k = attr.name;
                }
                vals[k] = attr.selector.getTextValue() || [];
            }
            return vals;
        }
        opt.setValue = function(vals) {
            opt.vals = vals;
            Data.init();
            areaDom.flush();
        }
        opt.textValStr = opt.getTextValueStr();
        opt.change = function() {
            var curValsStr = this.getTextValueStr();
            if (curValsStr != this.textValStr) {
                this.textValStr = curValsStr;
                this.onChange && this.onChange();
            }
        }
        return opt;
    }
    function colorMultiSelector_sas(option) {
        var _ColorSystem = [{
            id: "6",
            name: '黑色系',
            index: 0
        }, {
            id: "5",
            name: '白色系',
            index: 1
        }, {
            id: "11",
            name: '灰色系',
            index: 2
        }, {
            id: "14",
            name: '棕色系',
            index: 3
        }, {
            id: "2",
            name: '红色系',
            index: 4
        }, {
            id: "12",
            name: '橙色系',
            index: 5
        }, {
            id: "10",
            name: '黄色系',
            index: 6
        }, {
            id: "13",
            name: '紫色系',
            index: 7
        }, {
            id: "9",
            name: '蓝色系',
            index: 8
        }, {
            id: "1",
            name: '绿色系',
            index: 9
        }, {
            id: "3",
            name: '其他',
            index: 10
        }
        ];
        var _ColorDetail = [{
            id: '13',
            name: '黑色',
            csys: '6',
            rgb: '#000'
        }, {
            id: '1',
            name: '白色',
            csys: '5',
            rgb: '#FFF'
        }, {
            id: '44',
            name: '象牙白色',
            csys: '5',
            rgb: '#FFFFF0'
        }, {
            id: '332',
            name: '米白色',
            csys: '5',
            rgb: '#F5F5F0'
        }, {
            id: '15',
            name: '灰色',
            csys: '11',
            rgb: '#808080'
        }, {
            id: '24',
            name: '深灰色',
            csys: '11',
            rgb: '#555555'
        }, {
            id: '21',
            name: '浅灰色',
            csys: '11',
            rgb: '#C0C0C0'
        }, {
            id: '471',
            name: '冷灰色',
            csys: '11',
            rgb: '#808A87'
        }, {
            id: '14',
            name: '银色',
            csys: '11',
            rgb: '#E6E6D7'
        }, {
            id: '39',
            name: '棕褐色',
            csys: '14',
            rgb: '#5E2612'
        }, {
            id: '20',
            name: '巧克力色',
            csys: '14',
            rgb: '#A05C2D'
        }, {
            id: '49',
            name: '咖啡色',
            csys: '14',
            rgb: '#6A4B23'
        }, {
            id: '40',
            name: '深卡其布色',
            csys: '14',
            rgb: '#BDB76B'
        }, {
            id: '17',
            name: '驼色',
            csys: '14',
            rgb: '#B58453'
        }, {
            id: '5',
            name: '红色',
            csys: '2',
            rgb: '#FF0000'
        }, {
            id: '38',
            name: '粉红色',
            csys: '2',
            rgb: '#FFC0CB'
        }, {
            id: '52',
            name: '酒红色',
            csys: '2',
            rgb: '#821E32'
        }, {
            id: '144',
            name: '玫红色',
            csys: '2',
            rgb: '#FF215E'
        }, {
            id: '601',
            name: '肉粉色',
            csys: '2',
            rgb: '#FA8072'
        }, {
            id: '7',
            name: '橙色',
            csys: '12',
            rgb: '#FF8000'
        }, {
            id: '94',
            name: '橙红色',
            csys: '12',
            rgb: '#FF4500'
        }, {
            id: '108',
            name: '橙黄色',
            csys: '12',
            rgb: '#ED9121'
        }, {
            id: '715',
            name: '土黄色',
            csys: '12',
            rgb: '#D6A936'
        }, {
            id: '132',
            name: '香槟色',
            csys: '12',
            rgb: '#E2CE55'
        }, {
            id: '8',
            name: '黄色',
            csys: '10',
            rgb: '#FFFF00'
        }, {
            id: '671',
            name: '中黄色',
            csys: '10',
            rgb: '#FFD800'
        }, {
            id: '23',
            name: '淡黄色',
            csys: '10',
            rgb: '#FDFC82'
        }, {
            id: '34',
            name: '杏色',
            csys: '10',
            rgb: '#E6FC8F'
        }, {
            id: '9',
            name: '金色',
            csys: '10',
            rgb: '#F2C056'
        }, {
            id: '6',
            name: '紫色',
            csys: '13',
            rgb: '#800080'
        }, {
            id: '25',
            name: '深紫色',
            csys: '13',
            rgb: '#4B0082'
        }, {
            id: '107',
            name: '浅紫色',
            csys: '13',
            rgb: '#B280F7'
        }, {
            id: '27',
            name: '紫罗兰色',
            csys: '13',
            rgb: '#C71585'
        }, {
            id: '202',
            name: '紫红色',
            csys: '13',
            rgb: '#FF00FF'
        }, {
            id: '12',
            name: '蓝色',
            csys: '9',
            rgb: '#1E90FF'
        }, {
            id: '26',
            name: '深蓝色',
            csys: '9',
            rgb: '#00008B'
        }, {
            id: '68',
            name: '宝蓝色',
            csys: '9',
            rgb: '#0000FF'
        }, {
            id: '19',
            name: '天蓝色',
            csys: '9',
            rgb: '#00BFFF'
        }, {
            id: '57',
            name: '浅蓝色',
            csys: '9',
            rgb: '#A8CEFA'
        }, {
            id: '11',
            name: '绿色',
            csys: '1',
            rgb: '#228B22'
        }, {
            id: '48',
            name: '墨绿色',
            csys: '1',
            rgb: '#004630'
        }, {
            id: '18',
            name: '军绿色',
            csys: '1',
            rgb: '#556B2F'
        }, {
            id: '22',
            name: '浅绿色',
            csys: '1',
            rgb: '#90EE90'
        }, {
            id: '31',
            name: '抹茶绿色',
            csys: '1',
            rgb: '#C7FF2F'
        }, {
            id: '28',
            name: '花色',
            csys: '3',
            className: 'p_fancy'
        }, {
            id: '29',
            name: '透明',
            csys: '3',
            className: 'p_transparent'
        }, {
            id: '33',
            name: '荧光',
            csys: '3'
        }, {
            id: '753',
            name: '自定义颜色1',
            csys: null
        }, {
            id: '754',
            name: '自定义颜色2',
            csys: null
        }, {
            id: '755',
            name: '自定义颜色3',
            csys: null
        }, {
            id: '756',
            name: '自定义颜色4',
            csys: null
        }, {
            id: '757',
            name: '自定义颜色5',
            csys: null
        }, {
            id: '758',
            name: '自定义颜色6',
            csys: null
        }, {
            id: '759',
            name: '自定义颜色7',
            csys: null
        }, {
            id: '760',
            name: '自定义颜色8',
            csys: null
        }, {
            id: '761',
            name: '自定义颜色9',
            csys: null
        }, {
            id: '762',
            name: '自定义颜色10',
            csys: null
        }, {
            id: '763',
            name: '自定义颜色11',
            csys: null
        }, {
            id: '764',
            name: '自定义颜色12',
            csys: null
        }, {
            id: '765',
            name: '自定义颜色13',
            csys: null
        }, {
            id: '766',
            name: '自定义颜色14',
            csys: null
        }, {
            id: '767',
            name: '自定义颜色15',
            csys: null
        }, {
            id: '768',
            name: '自定义颜色16',
            csys: null
        }, {
            id: '769',
            name: '自定义颜色17',
            csys: null
        }, {
            id: '770',
            name: '自定义颜色18',
            csys: null
        }, {
            id: '771',
            name: '自定义颜色19',
            csys: null
        }, {
            id: '772',
            name: '自定义颜色20',
            csys: null
        }, {
            id: '773',
            name: '自定义颜色21',
            csys: null
        }, {
            id: '774',
            name: '自定义颜色22',
            csys: null
        }, {
            id: '775',
            name: '自定义颜色23',
            csys: null
        }, {
            id: '776',
            name: '自定义颜色24',
            csys: null
        }
        ];
        var _ColorSysTableHTML = '\
        <table class="tb_colors">\
        <colgroup><col style="width:20%;"><col style="width:20%;"><col style="width:20%;"><col style="width:20%;"><col style=""></colgroup>\
        <tbody>\
        <tr>\
        <td><div class="color_sys black_sys" csys="6"></div></td>\
        <td><div class="color_sys white_sys" csys="5"></div></td>\
        <td><div class="color_sys gray_sys"  csys="11"></div></td>\
        <td><div class="color_sys brown_sys" csys="14"></div></td>\
        <td><div class="color_sys red_sys"   csys="2"></div></td>\
        </tr>\
        <tr>\
        <td><div class="color_sys orange_sys" csys="12"></div></td>\
        <td><div class="color_sys yellow_sys" csys="10"></div></td>\
        <td><div class="color_sys purple_sys" csys="13"></div></td>\
        <td><div class="color_sys blue_sys"   csys="9"></div></td>\
        <td><div class="color_sys green_sys"  csys="1"></div></td>\
        </tr>\
        <tr>\
        <td colspan="5"><div class="else_sys" csys="3"><div class="name">其它：</div>{#sys3#}</div></td>\
        </tr>\
        </tbody>\
        </table>';
        var _ColorListHTML = '\
        <div class="name"><%=name%></div>\
        <ul class="clear">\
        <%  for(var i=0,l=colors.length;i<l;i++){ var color=colors[i];%>\
        <li>\
        <label style="margin:0">\
        <input type="checkbox" value="<%=color.id%>" act="chk" />\
        <%if(color.rgb||color.className){%>\
        <span class="preview <%=color.className||""%>" style="background-color:<%=color.rgb||""%>;"></span>\
        <%}%>\
        <span><%=color.name%></span>\
        </label>\
        <input type="text" class="input_memo" style="display:none" maxlength="20" value="<%=(color.customName||color.name)%>" colorid="<%=color.id%>"/>\
        </li>\
        <% }%>\
        </ul>\
        <%if(canDefine){%>\
        <a class="add_more" href="#add" act="add">添加颜色</a>\
        <%}%>';
        var _InVaildCustomNameReg = /[^\u4e00-\u9fa5\w\*\(\) （）\.\/\\\-%\@\+]/g;
        var opt = {
            dom: null,
            max: 50,
            vals: [],
            tmpl: {
                tableHTML: _ColorSysTableHTML,
                listHTML: _ColorListHTML
            },
            onChange: function() {},
            customColors: null,
            customMaxLength: 20,
            customInVaildNameReg: _InVaildCustomNameReg,
            canModify: true,
            canDefine: true,
            retColorSys: true,
            colorSysId: "39929"
        };
        $extend(opt, option);
        if (!opt.dom) {
            alert("不可用的dom节点");
            return false;
        }
        var Data = {
            valMap: {},
            valCount: 0,
            colorShow: [],
            colorHide: [],
            colorDetail: [],
            colorSysMap: {},
            inVaildNameMap: {},
            colorDetailMap: {},
            defaultColorMap: {},
            reset: function() {
                this.valMap = {};
                this.valCount = 0;
                this.colorShow = [];
                this.colorHide = [];
                this.colorDetail = [];
                this.colorSysMap = {};
                this.inVaildNameMap = {};
                this.colorDetailMap = {};
                this.defaultColorMap = {};
            },
            init: function() {
                this.reset();
                for (var i = 0; i < _ColorSystem.length; i++) {
                    var colorsys = _ColorSystem[i];
                    this.colorSysMap[colorsys.id] = colorsys;
                }
                for (var i = 0; i < _ColorDetail.length; i++) {
                    var defColor = _ColorDetail[i];
                    this.defaultColorMap[defColor.id] = defColor;
                    var color = {};
                    $extend(color, defColor);
                    this.colorDetail.push(color);
                    this.colorDetailMap[color.id] = color;
                    this.inVaildNameMap[color.name] = 1;
                }
                for (var i = 0; i < opt.vals.length; i++) {
                    var ret = (opt.vals[i] + "").match(/^(\d+)(\?[^#]+)?(#\d+)?$/);
                    if (ret && ret.length == 4) {
                        var color = this.colorDetailMap[ret[1]];
                        if (color && this.valCount < opt.max) {
                            if (ret[2]) {
                                var customName = ret[2].replace(opt.customInVaildNameReg || "", "").substr(0, opt.customMaxLength);
                                if (opt.canModify && customName != color.name&&!this.inVaildNameMap[customName]) {
                                    color.customName = customName;
                                    this.inVaildNameMap[customName] = 1;
                                }
                            }
                            if (!opt.canDefine&&!color.csys) {
                                continue;
                            }
                            if (!color.csys) {
                                if (ret[3]) {
                                    var csysid = ret[3].substr(1);
                                    color.csys = this.colorSysMap[csysid] ? csysid : "3";
                                } else {
                                    color.csys = "3";
                                }
                            }
                            if (color.csys&&!this.valMap[color.id]) {
                                this.valMap[color.id] = 1;
                                this.valCount++;
                            }
                        }
                    }
                }
                for (var i = 0; i < this.colorDetail.length; i++) {
                    var color = this.colorDetail[i];
                    if (color.csys) {
                        this.colorShow.push(color);
                    } else {
                        this.colorHide.push(color);
                    }
                }
            },
            getValMap: function() {
                return this.valMap;
            },
            checkVal: function(val) {
                return this.valMap[val];
            },
            insertVal: function(val) {
                if (!this.valMap[val]) {
                    if (this.valCount < opt.max) {
                        this.valMap[val] = 1;
                        this.valCount++;
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            },
            outVal: function(val) {
                if (this.valMap[val]) {
                    delete this.valMap[val];
                    this.valCount--;
                }
                var color = this.getColorById(val);
                if (color) {
                    delete color.customName;
                    this.genInVaildNameMap();
                }
            },
            genInVaildNameMap: function() {
                this.inVaildNameMap = {};
                for (var i in this.colorDetailMap) {
                    var color = this.colorDetailMap[i];
                    this.inVaildNameMap[color.name] = 1;
                    this.inVaildNameMap[color.customName || ""] = 1;
                }
            },
            getColorSysById: function(id) {
                var colorSys = {};
                $extend(colorSys, this.colorSysMap[id]);
                colorSys.canDefine = opt.canDefine;
                return colorSys;
            },
            getDefaultColorById: function(id) {
                var color = {};
                $extend(color, this.defaultColorMap[id]);
                return color;
            },
            getColorById: function(id) {
                return this.colorDetailMap[id];
            },
            getColorsByCsys: function(csys) {
                var retAr = [];
                for (var i = 0; i < this.colorShow.length; i++) {
                    if (this.colorShow[i].csys == csys) {
                        retAr.push(this.colorShow[i]);
                    }
                }
                return retAr;
            },
            getCustomColorByCsys: function(csys) {
                if (this.colorHide.length) {
                    var color = this.colorHide.shift();
                    color.csys = csys;
                    delete color.customName;
                    this.colorShow.push(color);
                    return color;
                }
                return false;
            },
            freeCustomColor: function(colorid) {
                var color = this.defaultColorMap[colorid];
                if (color&&!color.csys) {
                    for (var i = 0; i < this.colorShow.length; i++) {
                        if (this.colorShow[i].id == colorid) {
                            var freeColor = this.colorShow.splice(i, 1)[0];
                            delete freeColor.customName;
                            this.colorHide.push(freeColor);
                            this.colorHide.sort(function(a, b) {
                                return a.id - b.id;
                            });
                            this.genInVaildNameMap();
                            return true;
                        }
                    }
                    return false;
                }
                return false;
            },
            nameCustomColor: function(colorid, customName) {
                var color = this.colorDetailMap[colorid];
                if (color) {
                    var customName = customName.replace(opt.customInVaildNameReg || "", "").substr(0, opt.customMaxLength);
                    if (!customName)
                        return false;
                    if (color.name != customName && color.customName != customName) {
                        if (!this.inVaildNameMap[customName]) {
                            color.customName = customName;
                            this.genInVaildNameMap();
                        } else {
                            return false;
                        }
                    } else if (color.name == customName) {
                        delete color.customName;
                        this.genInVaildNameMap();
                    }
                    return customName;
                }
            }
        }
        Data.init();
        var tempDom = document.createElement("div");
        tempDom.innerHTML = opt.tmpl.tableHTML;
        var ctable = tempDom.getElementsByTagName("table")[0];
        ctable.flushByCsys = function(csys) {
            var dom = $attr("csys", csys + "", this)[0];
            if (dom) {
                var colorSys = Data.getColorSysById(csys);
                colorSys.colors = Data.getColorsByCsys(csys);
                dom.innerHTML = $txTpl(opt.tmpl.listHTML, colorSys);
                var ipts = dom.getElementsByTagName("input");
                for (var i = 0; i < ipts.length; i++) {
                    if (ipts[i].type == "text") {
                        ipts[i].onfocus = function() {
                            var colorid = this.getAttribute("colorid");
                            var color = Data.getColorById(colorid);
                            if (color.name == this.value) {
                                this.value = "";
                            }
                        };
                        ipts[i].onblur = function() {
                            var colorid = this.getAttribute("colorid");
                            var color = Data.getColorById(colorid);
                            var val = Data.nameCustomColor(colorid, $strTrim(this.value) || color.name);
                            if (val === false) {
                                alert("不能使用系统默认颜色名，且颜色名称不能重复！");
                            }
                            this.value = val || color.customName || color.name;
                            opt.change();
                        };
                    } else if (ipts[i].type == "checkbox") {
                        var colorid = ipts[i].value;
                        if (Data.checkVal(colorid)) {
                            (function(dom) {
                                setTimeout(function() {
                                    if (dom.click) {
                                        dom.click();
                                    } else {
                                        $fireEvent(dom, "click");
                                    }
                                }, 0);
                            })(ipts[i]);
                        }
                    }
                }
            }
        }
        ctable.onclick = function(e) {
            var t = $getTarget(e);
            var act = t.getAttribute("act");
            var that = this;
            if (act) {
                switch (act) {
                case"add":
                    var csys = t.parentNode.getAttribute("csys");
                    var color = Data.getCustomColorByCsys(csys);
                    if (!color) {
                        alert("自定义颜色个数已达上限！");
                    } else {
                        if (Data.insertVal(color.id)) {
                            opt.change();
                            this.flushByCsys(csys);
                            setTimeout(function() {
                                var ipt = $attr("colorid", color.id, that)[0];
                                if (ipt) {
                                    ipt.focus();
                                }
                            }, 0);
                        } else {
                            Data.freeCustomColor(color.id);
                            alert("最多只能选择" + opt.max + "种颜色！");
                        }
                    }
                    break;
                case"chk":
                    var colorid = t.value;
                    var color = Data.getDefaultColorById(colorid);
                    var csys = Data.getColorById(colorid).csys;
                    if (color) {
                        if (t.checked) {
                            if (Data.insertVal(color.id)) {
                                if (opt.canModify) {
                                    var txtDom = $getLast(t.parentNode);
                                    var iptDom = $getNext(t.parentNode);
                                    if (iptDom.value == "") {
                                        iptDom.value = color.name;
                                    }
                                    $display(txtDom, "none");
                                    $display(iptDom);
                                }
                            } else {
                                t.checked = false;
                                alert("最多只能选择" + opt.max + "种颜色！");
                            }
                        } else {
                            Data.outVal(color.id);
                            if (color.csys) {
                                var txtDom = $getLast(t.parentNode);
                                var iptDom = $getNext(t.parentNode);
                                iptDom.value = "";
                                $display(txtDom);
                                $display(iptDom, "none");
                            } else {
                                Data.freeCustomColor(color.id);
                                this.flushByCsys(csys);
                            }
                        }
                        opt.change();
                    }
                    break;
                default:
                    break;
                }
            }
        }
        opt.dom.innerHTML = "";
        opt.dom.appendChild(ctable);
        for (var i = 0; i < _ColorSystem.length; i++) {
            ctable.flushByCsys(_ColorSystem[i].id);
        }
        opt.getValue = function() {
            var vals = [];
            for (var i = 0; i < Data.colorShow.length; i++) {
                var color = Data.colorShow[i];
                if (Data.checkVal(color.id)) {
                    var csys = Data.getColorSysById(color.csys);
                    if (!vals[csys.index]) {
                        vals[csys.index] = [];
                    }
                    var val = color.id + "";
                    if (color.customName && color.customName != color.name) {
                        val += ("?" + color.customName);
                    }
                    val += ("#" + color.csys || "3");
                    vals[csys.index].push(val);
                }
            }
            var retVals = [];
            for (var i = 0; i < vals.length; i++) {
                if (vals[i]) {
                    retVals = retVals.concat(vals[i]);
                }
            }
            return retVals;
        }
        opt.getTextValue = function() {
            var vals = [];
            for (var i = 0; i < Data.colorShow.length; i++) {
                var color = Data.colorShow[i];
                if (Data.checkVal(color.id)) {
                    var csys = Data.getColorSysById(color.csys);
                    if (!vals[csys.index]) {
                        vals[csys.index] = [];
                    }
                    vals[csys.index].push(color.customName || color.name);
                }
            }
            var retVals = [];
            for (var i = 0; i < vals.length; i++) {
                if (vals[i]) {
                    retVals = retVals.concat(vals[i]);
                }
            }
            return retVals;
        }
        opt.setValue = function(vals) {
            opt.vals = vals;
            Data.init();
            for (var i = 0; i < _ColorSystem.length; i++) {
                ctable.flushByCsys(_ColorSystem[i].id);
            }
        }
        opt.valsStr = opt.getValue().join("|");
        opt.change = function() {
            var curValsStr = this.getValue().join("|");
            if (curValsStr != this.valsStr) {
                this.valsStr = curValsStr;
                this.onChange && this.onChange();
            }
        }
        return opt;
    }
    function attrMultiSelector_sas(option) {
        var _AreaHTML = "<div class='cts1'></div>";
        var _ListHTML = '\
        <% for(var i=0;i<children.length;i++){ var val=children[i];%>\
        <span class="label">\
        <label style="margin:0">\
        <input type="checkbox" value="<%=val.id%>"/>\
        <span><%=val.name%></span>\
        </label>\
        <% if(canModify){%>\
        <span style="display:none" ><input class="input_new_attr" childid="<%=val.id%>" type="text" value="<%=val.customName||val.name%>" maxlength="20"></span>\
        <% }else if(canRemark){%>\
        <span style="display:none">\
        <span style="background-color:white;border:solid 1px #ddd;color:gray;display:inline-block;display:-moz-inline-stack;">\
        <%=val.name%>(<input style="border:0 none;color:black;width:<%=(val.customName?"30":"10")%>px" class="input_new_attr" childid="<%=val.id%>" type="text" value="<%=val.customName||""%>" emptywidth="10" fullwidth="30" maxlength="20" />)\
        </span>\
        </span>\
        <% }%>\
        </span>\
        <% }%>\
        ';
        var _InVaildCustomNameReg = /[^\u4e00-\u9fa5\w\*\(\) （）\.\/\\\-%\@\+]/g;
        var opt = {
            dom: null,
            max: 50,
            vals: [],
            tmpl: {
                areaHTML: _AreaHTML,
                listHTML: _ListHTML
            },
            children: [],
            onChange: function() {},
            customMaxLength: 20,
            customInVaildNameReg: _InVaildCustomNameReg,
            canModify: false,
            canRemark: false
        }
        $extend(opt, option);
        if (!opt.dom) {
            alert("不可用的dom节点，无法初始化");
            return false;
        }
        if (!opt.children.length) {
            alert("无选项的属性,无法初始化");
            return false;
        }
        opt.canRemark && (opt.canModify = false);
        var Data = {
            valMap: {},
            valCount: 0,
            inVaildNameMap: {},
            children: [],
            childrenMap: {},
            init: function() {
                this.valMap = {};
                this.valCount = 0;
                this.inVaildNameMap = {};
                this.children = [];
                this.childrenMap = {};
                for (var i = 0; i < opt.children.length; i++) {
                    var child = opt.children[i];
                    var obj = {
                        id: child[0],
                        name: child[1]
                    };
                    this.children.push(obj);
                    this.childrenMap[obj.id] = obj;
                    this.inVaildNameMap[obj.name] = 1;
                }
                for (var i = 0; i < opt.vals.length; i++) {
                    var ret = (opt.vals[i] + "").match(/^(\d+)(\?[^#]+)?(#\d+)?$/);
                    if (ret && ret.length == 4) {
                        var child = this.childrenMap[ret[1]];
                        if (child && this.valCount < opt.max) {
                            if (ret[2] && (opt.canRemark || opt.canModify)) {
                                var customName = ret[2].replace(opt.customInVaildNameReg || "", "").substr(0, opt.customMaxLength);
                                if (opt.canRemark) {
                                    child.customName = customName.replace(/.*\(([^)]*)\)+/, "$1").replace(/\(|\)/g, "");
                                } else {
                                    if (customName != child.name&&!this.inVaildNameMap[customName]) {
                                        child.customName = customName;
                                        this.inVaildNameMap[customName] = 1;
                                    }
                                }
                            }
                            if (!this.valMap[child.id]) {
                                this.valMap[child.id] = 1;
                                this.valCount++;
                            }
                        }
                    }
                }
            },
            getValMap: function() {
                return this.valMap;
            },
            checkVal: function(val) {
                return this.valMap[val];
            },
            insertVal: function(val) {
                if (!this.valMap[val]) {
                    if (this.valCount < opt.max) {
                        this.valMap[val] = 1;
                        this.valCount++;
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            },
            outVal: function(val) {
                if (this.valMap[val]) {
                    delete this.valMap[val];
                    this.valCount--;
                }
                var child = this.getChildById(val);
                if (child) {
                    delete child.customName;
                    this.genInVaildNameMap();
                }
            },
            getChildById: function(id) {
                return this.childrenMap[id];
            },
            genInVaildNameMap: function() {
                this.inVaildNameMap = {};
                for (var i in this.childrenMap) {
                    var child = this.childrenMap[i];
                    this.inVaildNameMap[child.name] = 1;
                    if (opt.canRemark) {
                        var showName = child.name + "(" + child.customName + ")";
                        this.inVaildNameMap[showName] = 1;
                    } else {
                        this.inVaildNameMap[child.customName] = 1;
                    }
                }
            },
            nameCustomChild: function(cid, customName) {
                var child = this.childrenMap[cid];
                if (child) {
                    var customName = customName.replace(opt.customInVaildNameReg || "", "").substr(0, opt.customMaxLength);
                    if (opt.canRemark) {
                        if (!customName) {
                            delete child.customName;
                        } else {
                            customName = customName.replace(/.*\(([^)]*)\)+/, "$1").replace(/\(|\)/g, "");
                            child.customName = customName;
                        }
                        return customName;
                    } else {
                        if (!customName)
                            return false;
                        if (child.name != customName && child.customName != customName) {
                            if (!this.inVaildNameMap[customName]) {
                                child.customName = customName;
                                this.genInVaildNameMap();
                            } else {
                                return false;
                            }
                        } else if (child.name == customName) {
                            delete child.customName;
                            this.genInVaildNameMap();
                        }
                        return customName;
                    }
                }
                return false;
            }
        };
        Data.init();
        var tempDom = document.createElement("div");
        tempDom.innerHTML = opt.tmpl.areaHTML;
        var areaDom = $getLast(tempDom);
        opt.dom.innerHTML = "";
        opt.dom.appendChild(areaDom);
        areaDom.onclick = function(e) {
            var t = $getTarget(e);
            if (t.type == "checkbox") {
                var childid = t.value;
                var child = Data.getChildById(childid);
                if (child) {
                    if (t.checked) {
                        if (Data.insertVal(child.id)) {
                            if (opt.canModify || opt.canRemark) {
                                var txtDom = $getLast(t.parentNode);
                                var iptArea = $getNext(t.parentNode);
                                var iptDom = iptArea.getElementsByTagName("input")[0];
                                if (txtDom && iptArea && iptDom) {
                                    if (opt.canModify && iptDom.value == "") {
                                        iptDom.value = child.name;
                                    }
                                    $display(txtDom, "none");
                                    $display(iptArea);
                                }
                            }
                        } else {
                            t.checked = false;
                            alert("最多只能选择" + opt.max + "项！");
                        }
                    } else {
                        Data.outVal(child.id);
                        if (opt.canModify || opt.canRemark) {
                            var txtDom = $getLast(t.parentNode);
                            var iptArea = $getNext(t.parentNode);
                            var iptDom = iptArea.getElementsByTagName("input")[0];
                            if (txtDom && iptArea && iptDom) {
                                iptDom.value = "";
                                if (opt.canRemark) {
                                    if (iptDom.getAttribute("emptywidth")) {
                                        iptDom.style.width = iptDom.getAttribute("emptywidth") + "px";
                                    }
                                    iptDom.title = "";
                                }
                                $display(txtDom);
                                $display(iptArea, "none");
                            }
                        }
                    }
                    opt.change();
                }
            }
        }
        areaDom.flush = function() {
            this.innerHTML = $txTpl(opt.tmpl.listHTML, {
                children: Data.children,
                canModify: opt.canModify,
                canRemark: opt.canRemark
            });
            var ipts = this.getElementsByTagName("input");
            for (var i = 0, l = ipts.length; i < l; i++) {
                var ipt = ipts[i];
                if (ipt.type == "checkbox") {
                    if (Data.checkVal(ipt.value)) {
                        (function(dom) {
                            setTimeout(function() {
                                if (dom.click) {
                                    dom.click();
                                } else {
                                    $fireEvent(dom, "click");
                                }
                            }, 0);
                        })(ipt);
                    }
                } else if (ipt.type == "text") {
                    if (opt.canRemark) {
                        ipt.onfocus = function() {
                            if (this.getAttribute("fullwidth")) {
                                this.style.width = this.getAttribute("fullwidth") + "px";
                            }
                        };
                        ipt.onblur = function() {
                            var childid = this.getAttribute("childid");
                            var child = Data.getChildById(childid);
                            var val = Data.nameCustomChild(childid, $strTrim(this.value));
                            if (val === false) {
                                alert("不能使用已有属性值，且属性值不能重复！");
                            }
                            this.value = val || "";
                            if (!this.value) {
                                if (this.getAttribute("emptywidth")) {
                                    this.style.width = this.getAttribute("emptywidth") + "px";
                                }
                                this.title = "";
                            } else {
                                this.title = child.name + "(" + this.value + ")";
                            }
                            opt.change();
                        }
                    } else if (opt.canModify) {
                        ipt.onfocus = function() {
                            var childid = this.getAttribute("childid");
                            var child = Data.getChildById(childid);
                            if (child.name == this.value) {
                                this.value = "";
                            }
                        };
                        ipt.onblur = function() {
                            var childid = this.getAttribute("childid");
                            var child = Data.getChildById(childid);
                            var val = Data.nameCustomChild(childid, $strTrim(this.value) || child.name);
                            if (val === false) {
                                alert("不能使用已有属性值，且属性值不能重复！");
                            }
                            this.value = val || child.customName || child.name;
                            opt.change();
                        };
                    }
                }
            }
        }
        areaDom.flush();
        opt.getValue = function() {
            var valMap = Data.getValMap();
            var children = Data.children;
            var vals = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (valMap[child.id]) {
                    var val = child.id + "";
                    if ((this.canModify || this.canRemark) && child.customName) {
                        if (this.canRemark || child.customName != child.name) {
                            val += ("?" + child.customName);
                        }
                    }
                    vals.push(val);
                }
            }
            return vals;
        }
        opt.getTextValue = function() {
            var valMap = Data.getValMap();
            var children = Data.children;
            var vals = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (valMap[child.id]) {
                    var val = child.id + "";
                    if (this.canModify) {
                        vals.push(child.customName || child.name);
                    } else if (this.canRemark && child.customName) {
                        vals.push(child.name + "(" + child.customName + ")");
                    } else {
                        vals.push(child.name);
                    }
                }
            }
            return vals;
        }
        opt.setValue = function(vals) {
            opt.vals = vals;
            Data.init();
            areaDom.flush();
        }
        opt.valsStr = opt.getValue().join("|");
        opt.change = function() {
            var curValsStr = this.getValue().join("|");
            if (curValsStr != this.valsStr) {
                this.valsStr = curValsStr;
                this.onChange && this.onChange();
            }
        }
        return opt;
    };
    function $setCookie(name, value, expires, path, domain, secure) {
        var exp = new Date(), expires = arguments[2] || null, path = arguments[3] || "/", domain = arguments[4] || null, secure = arguments[5] || false;
        expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
        document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    };
    function $skuidTran(opt) {
        var app = {
            tpl: {
                stepFirst: '<div id="box_attr_filter_first" class="box_attr_filter"><p>亲爱的卖家：</p><ul><li>您好，为了促进交易，我们对商品库存系统进行了升级，详情请看<a href="http://bbs.paipai.com/thread-2576835-1-1.html" target="_blank">社区公告</a>。</li><li>点击“下一步”完成迁移操作后，即可使用新库存系统。</li><li>若关闭本页面，可在下次编辑商品时再进行迁移。</li><p style="color:red">（使用第三方库存同步软件可能导致升级失败，建议暂时停用，并与软件提供方联系升级软件。）</p></ul><h2>属性筛选</h2><p>请选择您想保留的属性项（最多{#maxAttr#}个）：</p><table id="attr_filter" class="tb_attr_filter"><colgroup><col><col><col style="width:300px;"><col></colgroup>{#attr#}</table><div class="al_right"><button id="step1_next">下一步</button></div></div>',
                stepFirstTr: '<tr><td><input type="checkbox" name="attr_cbox" tag="attr" key="{#key#}"/></td><td class="al_right">{#key#}：</td><td>{#value#}</td><td id="attr_type_{#key#}" style="display:none">属性类型：<select name="sel_attr_type" id="sel_attr_type_{#key#}" key="{#key#}"><option value="">请选择属性</option>{#newAttr#}</select><span class="msg1-icon-right" style="margin-left:5px;display:none"></span><span class="msg1-icon-warn" style="margin-left:5px;display:none"></span></td></tr>',
                attr: '<span class="tag">{#value#}</span>',
                option: '<option value="{#value#}">{#key#}</option>',
                stepMiddle: '<div id="box_attr_filter_{#oldAttrName#}" class="box_attr_filter"><h2>属性编辑-{#newAttrName#}</h2><table class="tb_attr_filter tb_box_border"><tr><td><p><strong>原有数据</strong></p>{#oldAttrName#}：{#oldAttrValue#}</td><td><p><strong>帮助说明</strong></p>{#transRule#}</td></tr><tr><td colspan="2"><p><strong>新数据</strong></p><div class="row" style="max-height: 360px;overflow-y: auto;"><div class="row_title">{#newAttrName#}：</div><div class="row_con"><ul class="filter_line">{#attrLi#}</ul></div></div></td></tr></table><div class="al_right"><button id="step_{#oldAttrName#}_prev" class="left">返回上一步</button><button id="step_{#oldAttrName#}_next">下一步</button></div></div>',
                stepMiddleLi: '<li><span class="tag">{#exAttr#}</span><select key="{#exAttr#}"><option value="">请选择{#saleAttr#}</option>{#attrList#}</select><span class="msg1-icon-right" style="margin-left:5px;display:none"></span><span class="msg1-icon-warn" style="margin-left:5px;display:none"></span></li>',
                transRuleColor: '<ul><li>新系统中，颜色属性是唯一支持上传图片的属性。</li><li>新系统使用色系进行颜色聚类管理，请准确选择色系，这将影响到商品在搜索结果中的展现。</li></ul>',
                transRuleNotColor: '<ul><li>新系统中，除颜色属性外，其余属性不再支持上传图片。</li><li>请在下拉列表中选择与旧属性名匹配的项目。</li></ul>',
                stepLast: '<div id="box_attr_filter_last" class="box_attr_filter"><h2>核对信息</h2><table class="tb_attr_filter tb_box_border"><tr><td><p><strong>原有数据</strong></p>{#oldRowList#}</td><td><p><strong>新数据</strong></p>{#newRowList#}</td></tr></table><div class="al_right"><button id="step_last_prev" class="left">返回上一步</button><button id="step_last_ok">确定</button></div></div>',
                rowDisplay: '<div class="row"><div class="row_title">{#name#}：</div><div class="row_con">{#list#}</div></div>'
            },
            colorInfo: {
                colorSeries: [[1, "绿色系", "lsx", 0], [2, "红色系", "hsx", 0], [3, "其他色系", "qtzs", 0], [5, "白色系", "bsx", 0], [6, "黑色系", "hsx", 0], [9, "蓝色系", "lsx", 0], [10, "黄色系", "hsx", 0], [11, "灰色系", "hsx", 0], [12, "橙色系", "csx", 0], [13, "紫色系", "zsx", 0], [14, "棕色系", "zsx", 0]],
                detail: [{
                    id: '13',
                    name: '黑色',
                    csys: '6',
                    desc: '#000'
                }, {
                    id: '1',
                    name: '白色',
                    csys: '5',
                    desc: '#fff'
                }, {
                    id: '44',
                    name: '象牙白色',
                    csys: '5',
                    desc: '#FFFFF0'
                }, {
                    id: '332',
                    name: '米白色',
                    csys: '5',
                    desc: '#F5F5F0'
                }, {
                    id: '15',
                    name: '灰色',
                    csys: '11',
                    desc: '#808080'
                }, {
                    id: '24',
                    name: '深灰色',
                    csys: '11',
                    desc: '#555555'
                }, {
                    id: '21',
                    name: '浅灰色',
                    csys: '11',
                    desc: '#C0C0C0'
                }, {
                    id: '471',
                    name: '冷灰色',
                    csys: '11',
                    desc: '#808A87'
                }, {
                    id: '14',
                    name: '银色',
                    csys: '11',
                    desc: '#E6E6D7'
                }, {
                    id: '39',
                    name: '棕褐色',
                    csys: '14',
                    desc: '#5E2612'
                }, {
                    id: '20',
                    name: '巧克力色',
                    csys: '14',
                    desc: '#A05C2D'
                }, {
                    id: '49',
                    name: '咖啡色',
                    csys: '14',
                    desc: '#6A4B23'
                }, {
                    id: '40',
                    name: '深卡其布色',
                    csys: '14',
                    desc: '#BDB76B'
                }, {
                    id: '17',
                    name: '驼色',
                    csys: '14',
                    desc: '#B58453'
                }, {
                    id: '5',
                    name: '红色',
                    csys: '2',
                    desc: '#FF0000'
                }, {
                    id: '38',
                    name: '粉红色',
                    csys: '2',
                    desc: '#FFC0CB'
                }, {
                    id: '52',
                    name: '酒红色',
                    csys: '2',
                    desc: '#821E32'
                }, {
                    id: '144',
                    name: '玫红色',
                    csys: '2',
                    desc: '#FF215E'
                }, {
                    id: '601',
                    name: '肉粉色',
                    csys: '2',
                    desc: '#FA8072'
                }, {
                    id: '7',
                    name: '橙色',
                    csys: '12',
                    desc: '#FF8000'
                }, {
                    id: '94',
                    name: '橙红色',
                    csys: '12',
                    desc: '#FF4500'
                }, {
                    id: '108',
                    name: '橙黄色',
                    csys: '12',
                    desc: '#ED9121'
                }, {
                    id: '715',
                    name: '土黄色',
                    csys: '12',
                    desc: '#D6A936'
                }, {
                    id: '132',
                    name: '香槟色',
                    csys: '12',
                    desc: '#E2CE55'
                }, {
                    id: '8',
                    name: '黄色',
                    csys: '10',
                    desc: '#FFFF00'
                }, {
                    id: '671',
                    name: '中黄色',
                    csys: '10',
                    desc: '#FFD800'
                }, {
                    id: '23',
                    name: '淡黄色',
                    csys: '10',
                    desc: '#FDFC82'
                }, {
                    id: '34',
                    name: '杏色',
                    csys: '10',
                    desc: '#E6FC8F'
                }, {
                    id: '9',
                    name: '金色',
                    csys: '10',
                    desc: '#F2C056'
                }, {
                    id: '6',
                    name: '紫色',
                    csys: '13',
                    desc: '#800080'
                }, {
                    id: '25',
                    name: '深紫色',
                    csys: '13',
                    desc: '#4B0082'
                }, {
                    id: '107',
                    name: '浅紫色',
                    csys: '13',
                    desc: '#B280F7'
                }, {
                    id: '27',
                    name: '紫罗兰色',
                    csys: '13',
                    desc: '#C71585'
                }, {
                    id: '202',
                    name: '紫红色',
                    csys: '13',
                    desc: '#FF00FF'
                }, {
                    id: '12',
                    name: '蓝色',
                    csys: '9',
                    desc: '#1E90FF'
                }, {
                    id: '26',
                    name: '深蓝色',
                    csys: '9',
                    desc: '#00008B'
                }, {
                    id: '68',
                    name: '宝蓝色',
                    csys: '9',
                    desc: '#0000FF'
                }, {
                    id: '19',
                    name: '天蓝色',
                    csys: '9',
                    desc: '#00BFFF'
                }, {
                    id: '57',
                    name: '浅蓝色',
                    csys: '9',
                    desc: '#A8CEFA'
                }, {
                    id: '11',
                    name: '绿色',
                    csys: '1',
                    desc: '#228B22'
                }, {
                    id: '48',
                    name: '墨绿色',
                    csys: '1',
                    desc: '#004630'
                }, {
                    id: '18',
                    name: '军绿色',
                    csys: '1',
                    desc: '#556B2F'
                }, {
                    id: '22',
                    name: '浅绿色',
                    csys: '1',
                    desc: '#90EE90'
                }, {
                    id: '31',
                    name: '抹茶绿色',
                    csys: '1',
                    desc: '#C7FF2F'
                }, {
                    id: '28',
                    name: '花色',
                    csys: '3',
                    desc: 'p_fancy'
                }, {
                    id: '29',
                    name: '透明',
                    csys: '3',
                    desc: 'p_transparent'
                }, {
                    id: '33',
                    name: '荧光',
                    csys: '3',
                    desc: null
                }
                ],
                customDetail: [{
                    id: '753',
                    name: '',
                    csys: null
                }, {
                    id: '754',
                    name: '',
                    csys: null
                }, {
                    id: '755',
                    name: '',
                    csys: null
                }, {
                    id: '756',
                    name: '',
                    csys: null
                }, {
                    id: '757',
                    name: '',
                    csys: null
                }, {
                    id: '758',
                    name: '',
                    csys: null
                }, {
                    id: '759',
                    name: '',
                    csys: null
                }, {
                    id: '760',
                    name: '',
                    csys: null
                }, {
                    id: '761',
                    name: '',
                    csys: null
                }, {
                    id: '762',
                    name: '',
                    csys: null
                }, {
                    id: '763',
                    name: '',
                    csys: null
                }, {
                    id: '764',
                    name: '',
                    csys: null
                }, {
                    id: '765',
                    name: '',
                    csys: null
                }, {
                    id: '766',
                    name: '',
                    csys: null
                }, {
                    id: '767',
                    name: '',
                    csys: null
                }, {
                    id: '768',
                    name: '',
                    csys: null
                }, {
                    id: '769',
                    name: '',
                    csys: null
                }, {
                    id: '770',
                    name: '',
                    csys: null
                }, {
                    id: '771',
                    name: '',
                    csys: null
                }, {
                    id: '772',
                    name: '',
                    csys: null
                }, {
                    id: '773',
                    name: '',
                    csys: null
                }, {
                    id: '774',
                    name: '',
                    csys: null
                }, {
                    id: '775',
                    name: '',
                    csys: null
                }, {
                    id: '776',
                    name: '',
                    csys: null
                }
                ],
                usedCustom: -1
            },
            map: function() {
                var attrIdMap = {}, idAttrMap = {}, idIndexMap = {}, attr = opt.saleAttr;
                for (var i = 0, l = attr.length; i < l; i++) {
                    attrIdMap[attr[i].name] = attr[i].id;
                    idAttrMap[attr[i].id] = attr[i].name;
                    idIndexMap[attr[i].id] = i;
                }
                return {
                    attrIdMap: attrIdMap,
                    idAttrMap: idAttrMap,
                    idIndexMap: idIndexMap
                };
            }(),
            each: function(array,
            callback) {
                for (var i = 0,
                l = array.length;
                i < l;
                i++) {
                    callback.call(array[i],
                    i,
                    array[i]);
                }
            }, check: function() {
                var l = 0, isFit = true, attr = opt.oldAttr, attrIdMap = app.map.attrIdMap;
                for (var i in attr) {
                    l++;
                    !attrIdMap[i] && (isFit = false);
                }
                if (l > opt.saleAttr.length ||!isFit) {
                    return false;
                }
                return true;
            }, isIE67: function() {
                return $isBrowser('ie6') || $isBrowser('ie7');
            }(), disable4IE6: function(container) {
                if (!app.isIE67) {
                    return;
                }
                $$(container).find('select').each(function() {
                    emulate(this);
                });
                function emulate(e) {
                    for (var i = 0, option; option = e.options[i]; i++) {
                        if (option.disabled) {
                            option.style.color = "#808080";
                        } else {
                            option.style.color = "#000000";
                        }
                    }
                }
            }, gotoNext: function() {
                var page = app.curPage, relation = app.relation, len = relation.length;
                if (page == 0) {
                    $id('box_attr_filter_first').style.display = 'none';
                } else {
                    var cur = $id('box_attr_filter_' + relation[page-1].key);
                    cur && (cur.style.display = 'none');
                }
                app.goAction = 'next';
                app.curPage++;
                if (page == len) {
                    app.showStepLast();
                } else {
                    app.showStepMiddle(relation, page);
                }
            }, gotoPrev: function() {
                var page = app.curPage, relation = app.relation, len = relation.length;
                if (page == len + 1) {
                    $id('box_attr_filter_last').style.display = 'none';
                } else {
                    var cur = $id('box_attr_filter_' + relation[page-1].key);
                    cur && (cur.style.display = 'none');
                }
                app.goAction = 'prev';
                app.curPage--;
                if (page == 1) {
                    app.showStepFirst();
                } else {
                    app.showStepMiddle(app.relation, page-2);
                }
            }, close: function() {
                app.float && app.float.close();
            }, getAttrList: function(list) {
                var _attr = [], tpl = app.tpl;
                for (var i = 0, l = list.length; i < l; i++) {
                    _attr.push(tpl.attr.replace(/{#value#}/, list[i]));
                }
                return _attr.join('\n');
            }, getAttrRow: function(name, list) {
                return this.tpl.rowDisplay.replace(/{#name#}/, name).replace(/{#list#}/, this.getAttrList(list));
            }, getColor: function(color) {
                var opList = app.colorInfo.detail;
                for (var i = 0, l = opList.length; i < l; i++) {
                    var op = opList[i];
                    if (color == op.name) {
                        return op;
                    }
                }
                return app.colorInfo.customDetail[++app.colorInfo.usedCustom];
            }, getMatchColor: function(color) {
                var opList = app.colorInfo.colorSeries;
                for (var i = 0, l = opList.length; i < l; i++) {
                    var op = opList[i];
                    if (color.indexOf(op[1].substring(0, 1))!=-1) {
                        return op[0];
                    }
                }
            }, getMatchAttr: function(attr, opList) {
                for (var i = 0, l = opList.length; i < l; i++) {
                    var op = opList[i];
                    if (attr.indexOf(op[1])!=-1) {
                        return op[0];
                    }
                }
            }, showStepFirst: function() {
                var container = $id('box_attr_filter_first');
                if (container) {
                    container.style.display = '';
                    return;
                }
                var tpl = this.tpl;
                var newAttr = (function() {
                    var o = [], attr = app.map.attrIdMap;
                    for (var i in attr) {
                        o.push(tpl.option.replace(/{#value#}/, attr[i]).replace(/{#key#}/, i));
                    }
                    return o.join('');
                })();
                var attrHtml = [], attr = opt.oldAttr, maxAttrLen = opt.saleAttr.length;
                for (var item in attr) {
                    attrHtml.push(tpl.stepFirstTr.replace(/{#key#}/g, item).replace(/{#value#}/, app.getAttrList(attr[item])));
                }
                var html = tpl.stepFirst.replace(/{#attr#}/, attrHtml.join('').replace(/{#newAttr#}/g, newAttr)).replace(/{#maxAttr#}/g, maxAttrLen);
                app.float = $float({
                    title: '商品库存系统升级',
                    width: 750,
                    html: html,
                    showClose: false,
                    top: 20
                });
                app.float.boxIframeHandle && (app.float.boxIframeHandle.style.display = 'none');
                $id('attr_filter').onclick = function(e) {
                    var t = $getTarget(e);
                    if (t.getAttribute('tag') === 'attr') {
                        var key = t.getAttribute('key');
                        $id('attr_type_' + key).style.display = (t.checked ? '' : 'none');
                        if (!t.checked) {
                            var sel = $id('sel_attr_type_' + key);
                            sel.value = '';
                            sel.onchange();
                        }
                        var k = 0, cboxs = document.getElementsByName('attr_cbox'), unchecked = [];
                        app.each(cboxs, function() {
                            this.checked ? k++ : unchecked.push(this);
                        });
                        app.each(unchecked, function() {
                            this.disabled = k >= maxAttrLen ? true : false;
                            this.title = k >= maxAttrLen ? '最多勾选' + maxAttrLen + '个属性' : '';
                        });
                    }
                }
                $id('step1_next').onclick = function() {
                    var k = 0, cboxs = document.getElementsByName('attr_cbox'), checked = [];
                    app.each(cboxs, function() {
                        this.checked && checked.push(this) && k++;
                    });
                    if (k > maxAttrLen) {
                        alert('最多勾选' + maxAttrLen + '个属性');
                        return false;
                    }
                    if (k == 0) {
                        alert('请选择一个属性');
                        return false;
                    }
                    var complete = true, relation = [];
                    app.each(checked, function() {
                        var key = this.getAttribute('key'), sel = $id('sel_attr_type_' + key);
                        if (sel.value == '') {
                            $$(sel).next().next('span.msg1-icon-warn').css('display', '');
                            complete = false;
                        } else {
                            relation.push({
                                key: key,
                                value: sel.value
                            });
                        }
                    });
                    if (!complete) {
                        return false;
                    }
                    if (app.relation) {
                        var isSame = true;
                        if (app.relation.length !== relation.length) {
                            isSame = false;
                        } else {
                            $$.each(app.relation, function(i, v) {
                                var vv = relation[i];
                                if (v.key != vv.key || v.value != vv.value) {
                                    isSame = false;
                                    return false;
                                }
                            });
                        }
                        !isSame && $$('#box_attr_filter_first').siblings('div.box_attr_filter').remove();
                    }
                    app.curPage = 0;
                    app.colorInfo.usedCustom =- 1;
                    app.relation = relation;
                    app.transInfo = [];
                    app.gotoNext();
                };
                app.each(document.getElementsByName('sel_attr_type'), function() {
                    this.onchange = function() {
                        var selected = this.value, last = this.getAttribute('last');
                        if (app.isIE67) {
                            if (this.options[this.selectedIndex].disabled) {
                                this.value = last || '';
                                return false;
                            }
                        }
                        $$('[name=sel_attr_type]').not(this).each(function() {
                            selected && $$(this).find('option[value=' + selected + ']').attr('disabled', true);
                            last && $$(this).find('option[value=' + last + ']').attr('disabled', false);
                        });
                        this.setAttribute('last', selected);
                        var tips = $$(this).next('span.msg1-icon-right');
                        selected === '' ? tips.hide() : tips.show();
                        tips.next('span.msg1-icon-warn').hide();
                        app.disable4IE6('#attr_filter');
                    }
                });
                if (app.check()) {
                    $$('[name=attr_cbox]').attr('checked', true);
                    var attrIdMap = app.map.attrIdMap;
                    $$('[name=sel_attr_type]').each(function() {
                        this.value = attrIdMap[this.getAttribute('key')];
                    });
                    $$('#box_attr_filter_first > ul').nextAll(':not(.al_right)').hide();
                }
            }, showStepMiddle: function(relation, index) {
                var key = relation[index].key, value = relation[index].value, oldAttr = opt.oldAttr[key], saleAttr = opt.saleAttr[app.map.idIndexMap[value]], prop = saleAttr.prop, container = $id('box_attr_filter_' + key);
                if (value != 49) {
                    var newLen = saleAttr.opList.length;
                    oldAttr.length > newLen && (oldAttr = oldAttr.slice(0, newLen));
                }
                if (value != 49 && prop == 'edit') {
                    if (!app.transInfo[index]) {
                        var attr = saleAttr.opList, trans = [], usedList = {};
                        var _getAttr = function(name) {
                            var l = attr.length;
                            for (var i = 0; i < l; i++) {
                                if (attr[i][1] == name&&!usedList[i]) {
                                    usedList[i] = true;
                                    return attr[i];
                                }
                            }
                            for (var i = 0; i < l; i++) {
                                if (!usedList[i]) {
                                    usedList[i] = true;
                                    return attr[i];
                                }
                            }
                        };
                        app.each(oldAttr, function(i, v) {
                            var _attr = _getAttr(v), code = [_attr[0], v].join('?');
                            trans.push({
                                ori: v,
                                tran: {
                                    name: _attr[1],
                                    code: code
                                }
                            });
                        });
                        app.transInfo[index] = [key, value, saleAttr.name, trans, prop];
                    }
                    app.goAction == 'next' ? app.gotoNext() : app.gotoPrev();
                    return;
                }
                if (container) {
                    container.style.display = '';
                    return;
                }
                var tpl = this.tpl;
                var attrList = (function() {
                    var o = [], attr = saleAttr.opList;
                    if (value == 49) {
                        attr = app.colorInfo.colorSeries;
                    }
                    app.each(attr, function(i, v) {
                        o.push(tpl.option.replace(/{#value#}/, v[0]).replace(/{#key#}/, v[1]));
                    });
                    return o.join('');
                })();
                var stepMiddleLi = [];
                app.each(oldAttr, function(i, v) {
                    stepMiddleLi.push(tpl.stepMiddleLi.replace(/{#exAttr#}/g, v).replace(/{#attrList#}/, attrList));
                });
                $$('#box_attr_filter_first').after(app.tpl.stepMiddle.replace(/{#oldAttrName#}/g, key).replace(/{#oldAttrValue#}/, app.getAttrList(opt.oldAttr[key])).replace(/{#transRule#}/, value == 49 ? app.tpl.transRuleColor : app.tpl.transRuleNotColor).replace(/{#newAttrName#}/g, app.map.idAttrMap[value]).replace(/{#attrLi#}/g, stepMiddleLi.join('')).replace(/{#saleAttr#}/g, value == 49 ? '色系' : saleAttr.name));
                $id('step_' + key + '_next').onclick = function() {
                    var trans = [], isAllOk = true;
                    $$($id('box_attr_filter_' + key)).find('select').each(function() {
                        if (this.value === '') {
                            isAllOk = false;
                            $$(this).next().next('span.msg1-icon-warn').css('display', '');
                        } else {
                            var code, oriAttr = this.getAttribute('key'), selText = this.options[this.selectedIndex].innerHTML;
                            if (value == 49) {
                                code = [this.getAttribute('code'), this.value].join('#');
                            } else {
                                code = this.value + (prop == 'mark' && oriAttr != selText ? '?' + oriAttr : '');
                            }
                            trans.push({
                                ori: oriAttr,
                                tran: {
                                    name: selText,
                                    code: code
                                }
                            });
                        }
                    });
                    if (!isAllOk) {
                        return false;
                    }
                    app.transInfo[index] = [key, value, saleAttr.name, trans, prop];
                    app.gotoNext();
                }
                $id('step_' + key + '_prev').onclick = function() {
                    app.gotoPrev();
                }
                var attrSelect = $$($id('box_attr_filter_' + key)).find('select');
                attrSelect.change(function() {
                    var last = this.getAttribute('last');
                    if (app.isIE67) {
                        if (this.options[this.selectedIndex].disabled) {
                            this.value = last || '';
                            return false;
                        }
                    }
                    var tips = $$(this).next('span.msg1-icon-right');
                    this.value === '' ? tips.hide() : tips.show();
                    tips.next('span.msg1-icon-warn').hide();
                });
                if (value != 49) {
                    attrSelect.change(function() {
                        var selected = this.value, last = this.getAttribute('last');
                        attrSelect.not(this).each(function() {
                            selected && $$(this).find('option[value=' + selected + ']').attr('disabled', true);
                            last && $$(this).find('option[value=' + last + ']').attr('disabled', false);
                        });
                        this.setAttribute('last', selected);
                        app.disable4IE6('#box_attr_filter_' + key);
                    });
                }
                if (value == 49) {
                    app.each(oldAttr, function(i, v) {
                        var color = app.getColor(v), code = [color.id, v].join('?'), sel = attrSelect.filter('[key=' + v + ']');
                        sel.attr('code', code);
                        var op;
                        if (color.csys) {
                            op = color.csys;
                            sel.attr('disabled', true);
                        } else {
                            op = app.getMatchColor(v);
                        }
                        op && sel.val(op).change();
                    });
                } else {
                    var opList = saleAttr.opList, opRet = {};
                    app.each(oldAttr, function(i, v) {
                        var op = app.getMatchAttr(v, opList);
                        op&&!opRet[op] && attrSelect.filter('[key=' + v + ']').val(op).change() && (opRet[op] = true);
                    });
                }
            }, showStepLast: function() {
                var container = $id('box_attr_filter_last');
                container && $$(container).remove();
                var attrHtml = [], attr = opt.oldAttr;
                for (var item in attr) {
                    attrHtml.push(app.getAttrRow(item, attr[item]));
                }
                var saleAttrHtml = [];
                app.each(app.transInfo, function(i, v) {
                    var trans = v[3], saleAttr = [];
                    if (v[1] == 49) {
                        app.each(trans, function(i, k) {
                            saleAttr.push(k.ori);
                        });
                    } else {
                        app.each(trans, function(i, k) {
                            saleAttr.push(v[4] == 'edit' ? k.ori : (k.tran.name + (v[4] == 'mark' ? '(' + k.ori + ')' : '')));
                        });
                    }
                    saleAttrHtml.push(app.getAttrRow(v[2], saleAttr));
                });
                $$('#box_attr_filter_first').after(app.tpl.stepLast.replace(/{#oldRowList#}/, attrHtml.join('')).replace(/{#newRowList#}/, saleAttrHtml.join('')));
                $id('step_last_prev').onclick = function() {
                    app.gotoPrev();
                }
                $id('step_last_ok').onclick = function() {
                    var rel = {}, attr = {};
                    app.each(app.transInfo, function(i, v) {
                        var code = [];
                        rel[v[1]] = v[0];
                        app.each(v[3], function() {
                            code.push(this.tran.code);
                        });
                        attr[v[1]] = code;
                    });
                    opt.relation = rel;
                    opt.attr = attr;
                    opt.close = app.close;
                    opt.callback(opt) && app.close();
                }
            }
        };
        app.showStepFirst();
        return {
            close: app.close
        };
    };
    function $stockManageNew(option) {
        var _AreaHTML = '\
        <div class="attr_des" id="divStockColorTipArea"><img class="upload_tips_icon" src="http://static.paipaiimg.com/module/b.png">\
        <span style="color:#FF5500">请选择正确色系，色系将影响商品在搜索结果中的表现。</span>\
        具体颜色选项如不能满足需要，可在勾选后进行修改。\
        </div>\
        <div class="attr_form" id="divSaleAttrSelectorArea"></div>\
        <div class="attr-add" style="margin-right:20px;" id="divAttrPreviewArea"></div>\
        <div style="display:none;margin-top:10px;margin-right:20px;" class="upload_tips" id="divStockMiddleTipArea"></div>\
        <div class="item-list" id="divStockTableArea"></div>';
        var opt = {
            dom: null,
            tmpl: {
                areaHTML: _AreaHTML
            },
            metaId: 0,
            saleKeyReg: /[?#][^:|,]*/g,
            tranName: "stockTransfer",
            saleAttrs: null,
            saleAttrStr: "",
            stockList: null,
            stockImgStr: "",
            middleTip: "",
            isAttrMode: false,
            onChange: function() {}
        };
        $extend(opt, option);
        if (!opt.dom) {
            alert("不可用的dom节点，无法初始化");
            return false;
        }
        if (!opt.stockList) {
            opt.stockList = [];
        }
        if (window[opt.tranName]) {
            window[opt.tranName].close();
        }
        var Data = {
            saleValsMap: {},
            stockValsMap: {},
            saleAttrs: [],
            stocks: [],
            stocksMap: {},
            sortAttrAndTransOldData: function(func) {
                var that = this;
                that.saleAttrs.sort(function(a, b) {
                    if (a.id == "49")
                        return -1;
                    if (b.id == "49")
                        return 1;
                    if (a.id == "42914")
                        return 1;
                    if (b.id == "42914")
                        return -1;
                    return 0;
                });
                if (!opt.isAttrMode && that.saleAttrs.length && that.stocks.length && $isEmptyObj(that.saleValsMap)&&!$isEmptyObj(that.stockValsMap)) {
                    window[opt.tranName] = $skuidTran({
                        oldAttr: that.stockValsMap,
                        saleAttr: that.saleAttrs,
                        callback: function() {
                            var vals = [];
                            var valsMap = {};
                            var txtvals = [];
                            for (var i = 0; i < this.saleAttr.length; i++) {
                                var attr = this.saleAttr[i];
                                var val = this.attr[attr.id];
                                if (val && val.length) {
                                    var oldName = this.relation[attr.id];
                                    var oldVal = this.oldAttr[oldName];
                                    if (oldVal && oldVal.length >= val.length) {
                                        vals.push({
                                            key: attr.id,
                                            val: val
                                        });
                                        txtvals.push({
                                            key: oldName,
                                            val: oldVal
                                        });
                                        valsMap[attr.id] = val;
                                    } else {
                                        alert("转换数据出错了[新老数据不一致]！请尝试重新转换");
                                        return false;
                                    }
                                }
                            }
                            var dcarVals = [[]];
                            var dcarOVals = [[]];
                            for (var i = 0; i < vals.length; i++) {
                                var v = vals[i];
                                var tv = txtvals[i];
                                if (v.val && v.val.length) {
                                    var old = dcarVals.concat();
                                    var told = dcarOVals.concat();
                                    dcarVals = [];
                                    dcarOVals = [];
                                    for (var j = 0; j < old.length; j++) {
                                        for (var k = 0; k < v.val.length; k++) {
                                            dcarVals.push(old[j].concat(v.key + ":" + v.val[k]));
                                            dcarOVals.push(told[j].concat(tv.key + ":" + tv.val[k]));
                                        }
                                    }
                                }
                            }
                            if (dcarVals[0] && dcarVals[0].length) {
                                var stocks = [];
                                var stocksMap = {};
                                for (var i = 0; i < dcarVals.length; i++) {
                                    var saleAttr = dcarVals[i].join("|");
                                    var obj = {};
                                    for (var k = 0; k < that.stocks.length; k++) {
                                        var stock = that.stocks[k];
                                        var isMatch = true;
                                        for (var m = 0; m < dcarOVals[i].length; m++) {
                                            var stockText = dcarOVals[i][m];
                                            if ((stock.attr + "|").indexOf((stockText + "|")) < 0) {
                                                isMatch = false;
                                                break;
                                            }
                                        }
                                        if (isMatch) {
                                            if ($isEmptyObj(obj)) {
                                                $extend(obj, stock);
                                            } else {
                                                obj.num = obj.num * 1 + stock.num * 1;
                                                obj.price = Math.max(obj.price, stock.price);
                                            }
                                        }
                                    }
                                    if ($isEmptyObj(obj)) {
                                        obj.stockId = "";
                                        obj.price = "";
                                        obj.num = "";
                                        obj.desc = "";
                                        obj.skuId = "";
                                    }
                                    var csysMatch = saleAttr.match(/#[^|]*/);
                                    if (csysMatch) {
                                        saleAttr = saleAttr.replace(csysMatch[0], "");
                                        obj.specAttr = csysMatch[0].replace(/[^\d]/g, "");
                                    }
                                    obj.saleAttr = saleAttr;
                                    stocksMap[saleAttr.replace(opt.saleKeyReg, "")] = obj;
                                    stocks.push(obj);
                                }
                                that.stocks = stocks;
                                that.stocksMap = stocksMap;
                                that.saleValsMap = valsMap;
                                if (func.call) {
                                    setTimeout(function() {
                                        func.call(that);
                                    }, 0);
                                }
                                return true;
                            } else {
                                alert("转换数据出错了[数据为空]！请尝试重新转换");
                                return false;
                            }
                        }
                    });
                } else {
                    if (func.call) {
                        setTimeout(function() {
                            func.call(that);
                        }, 0);
                    }
                }
            },
            init: function(func) {
                var that = this;
                this.saleValsMap = {};
                this.stockValsMap = {};
                this.saleAttrs = [];
                this.stocks = [];
                this.stocksMap = {};
                if (opt.stockList.length != 0) {
                    for (var i = 0; i < opt.stockList.length; i++) {
                        var stock = opt.stockList[i];
                        if (stock.saleAttr) {
                            var vals = stock.saleAttr.split("|");
                            for (var j = 0; j < vals.length; j++) {
                                var val = vals[j].split(":");
                                if (val[1]) {
                                    if (!this.saleValsMap[val[0]]) {
                                        this.saleValsMap[val[0]] = [];
                                    }
                                    var valIn = "";
                                    if (val[0] == "49") {
                                        varIn = val[1] + (stock.specAttr ? ("#" + stock.specAttr) : "");
                                    } else {
                                        varIn = val[1];
                                    }
                                    $addUniq(this.saleValsMap[val[0]], varIn);
                                }
                            }
                        }
                        if (stock.attr) {
                            var vals = stock.attr.split("|");
                            for (var j = 0; j < vals.length; j++) {
                                var val = vals[j].split(":");
                                if (val[1]) {
                                    if (!this.stockValsMap[val[0]]) {
                                        this.stockValsMap[val[0]] = [];
                                    }
                                    $addUniq(this.stockValsMap[val[0]], val[1]);
                                }
                            }
                        }
                        this.stocks.push(stock);
                        this.stocksMap[(stock.saleAttr.replace(opt.saleKeyReg, "")) || stock.skuId] = stock;
                    }
                } else if (opt.saleAttrStr && /^[\da-f|:,]+$/.test(opt.saleAttrStr)) {
                    var saleAttrStr = opt.saleAttrStr.replace(/[\da-f]+/g, function(hex) {
                        return parseInt(hex, 16) + "";
                    });
                    var attrPairs = saleAttrStr.split("|");
                    for (var i = 0; i < attrPairs.length; i++) {
                        var attrPair = attrPairs[i].split(":");
                        if (attrPair.length == 2) {
                            this.saleValsMap[attrPair[0]] = attrPair[1].split(",");
                        }
                    }
                }
                if (!opt.saleAttrs) {
                    if (opt.metaId) {
                        window.classAttrCallBack = function(obj) {
                            if (that.saleAttrs.length) {
                                return;
                            }
                            if (obj.errcode == "0" && obj.attrList && obj.attrList.length) {
                                for (var i = 0; i < obj.attrList.length; i++) {
                                    var attr = obj.attrList[i];
                                    if (attr.property & 0x10000 || attr.id == "42914") {
                                        if (attr.property & 0x4000 && attr.property & 0x10&&!(attr.property & 0x20)) {
                                            attr.prop = "mark";
                                        } else if (attr.property & 0x4000) {
                                            attr.prop = "edit";
                                        } else {
                                            attr.prop = "read";
                                        }
                                        that.saleAttrs.push(attr);
                                    }
                                }
                            }
                            that.sortAttrAndTransOldData(func);
                        }
                        $loadScript("http://my.paipai.com/cgi-bin/commoditypublishPP/genjsdata?classid=1&mc=" + opt.metaId + "&tagid=" + new Date().getTime());
                    } else {
                        if (func.call) {
                            func.call(that);
                        }
                    }
                } else {
                    that.saleAttrs = opt.saleAttrs;
                    that.sortAttrAndTransOldData(func);
                }
            }
        };
        Data.init(function() {
            opt.dom.innerHTML = opt.tmpl.areaHTML;
            var colorTipArea = $id("divStockColorTipArea");
            var selectArea = $id("divSaleAttrSelectorArea");
            var previewArea = $id("divAttrPreviewArea");
            var stockTableArea = $id("divStockTableArea");
            var stockMiddleTip = $id("divStockMiddleTipArea");
            var that = this;
            if (opt.isAttrMode) {
                if (selectArea && this.saleAttrs && this.saleAttrs.length) {
                    opt.saleSelector = $saleAttrsSelector({
                        dom: selectArea,
                        attrs: this.saleAttrs,
                        vals: this.saleValsMap,
                        isEditMode: false,
                        onChange: function() {
                            if (opt.onChange) {
                                opt.onChange();
                            }
                            return;
                        }
                    });
                    opt.saleSelector.onChange();
                    colorTipArea && $display(colorTipArea, "none");
                    previewArea && $display(previewArea, "none");
                    stockTableArea && $display(stockTableArea, "none");
                    stockMiddleTip && $display(stockMiddleTip, "none");
                } else {
                    opt.dom.innerHTML = "";
                    if (opt.onChange) {
                        opt.onChange();
                    }
                }
            } else {
                if (opt.middleTip) {
                    stockMiddleTip.innerHTML = opt.middleTip;
                    $display(stockMiddleTip);
                } else {
                    stockMiddleTip.innerHTML = "";
                    $display(stockMiddleTip, "none");
                }
                if (colorTipArea) {
                    $display(colorTipArea, "none");
                    for (var i = 0; i < this.saleAttrs.length; i++) {
                        var attr = this.saleAttrs[i];
                        if (attr.id == "49") {
                            $display(colorTipArea);
                            break;
                        }
                    }
                }
                if (selectArea && this.saleAttrs && this.saleAttrs.length) {
                    opt.saleSelector = $saleAttrsSelector({
                        dom: selectArea,
                        attrs: this.saleAttrs,
                        vals: this.saleValsMap,
                        onChange: function() {
                            var mstocks = that.stocks.concat();
                            var mstocksMap = {};
                            for (var i = 0; i < mstocks.length; i++) {
                                var stock = mstocks[i];
                                var saleKey = stock.saleAttr.replace(opt.saleKeyReg, "");
                                mstocksMap[saleKey] = stock;
                            }
                            var stocks = [];
                            if (opt.stockTable) {
                                stocks = opt.stockTable.getValue();
                            }
                            for (var i = 0; i < stocks.length; i++) {
                                var stock = stocks[i];
                                var saleKey = stock.saleAttr.replace(opt.saleKeyReg, "");
                                if (mstocksMap[saleKey]) {
                                    $extend(mstocksMap[saleKey], stock);
                                } else {
                                    mstocks.push(stock);
                                    mstocksMap[saleKey] = stock;
                                }
                            }
                            var vals = this.getValue();
                            var txtvals = this.getTextValue();
                            var dcteTmp = [""];
                            var dcteTxtTmp = [""];
                            for (var i = 0; i < vals.length; i++) {
                                var v = vals[i];
                                var tv = txtvals[i];
                                if (v.val && v.val.length) {
                                    var old = dcteTmp.concat();
                                    var told = dcteTxtTmp.concat();
                                    dcteTmp = [];
                                    dcteTxtTmp = [];
                                    for (var j = 0; j < old.length; j++) {
                                        for (var k = 0; k < v.val.length; k++) {
                                            dcteTmp.push(old[j] + (old[j] ? "|" : "") + v.key + ":" + v.val[k]);
                                            dcteTxtTmp.push(told[j] + (told[j] ? "|" : "") + tv.key + ":" + tv.val[k]);
                                        }
                                    }
                                }
                            }
                            if (!dcteTmp[0]) {
                                dcteTmp = [];
                            }
                            if (dcteTmp.length > 200) {
                                alert("温馨提示:\n\n" + "当前生成的库存(" + dcteTmp.length + ")条，超过200条将无法正常保存，请取消部分库存！");
                            }
                            var newStockList = [];
                            for (var i = 0; i < dcteTmp.length; i++) {
                                var saleAttr = dcteTmp[i];
                                var saleAttrText = dcteTxtTmp[i];
                                var saleKey = saleAttr.replace(opt.saleKeyReg, "");
                                var newStock = {};
                                if (mstocksMap[saleKey]) {
                                    $extend(newStock, mstocksMap[saleKey]);
                                } else {
                                    newStock.stockId = "";
                                    newStock.price = "";
                                    newStock.num = "";
                                    newStock.desc = "";
                                    newStock.skuId = "";
                                }
                                var csysMatch = saleAttr.match(/#[^|]*/);
                                if (csysMatch) {
                                    saleAttr = saleAttr.replace(csysMatch[0], "");
                                    newStock.specAttr = csysMatch[0].replace(/[^\d]/g, "");
                                }
                                newStock.saleAttr = saleAttr;
                                newStock.attr = saleAttrText;
                                newStockList.push(newStock);
                            }
                            if (opt.stockTable) {
                                opt.stockTable.setValue(newStockList);
                            } else {
                                if (stockTableArea) {
                                    opt.stockTable = $stockTableNew({
                                        dom: stockTableArea,
                                        stockList: newStockList,
                                        onChange: function() {
                                            if (opt.onChange) {
                                                opt.onChange();
                                            }
                                        }
                                    });
                                    opt.stockTable.onChange();
                                }
                            }
                            if (opt.stockPreview) {
                                opt.stockPreview.setValue(txtvals);
                            } else {
                                if (previewArea) {
                                    opt.stockPreview = $stockPreview({
                                        dom: previewArea,
                                        vals: txtvals,
                                        stockImgStr: opt.stockImgStr
                                    });
                                }
                            }
                        }
                    });
                    opt.saleSelector.onChange();
                } else if (this.stocks && this.stocks.length) {
                    if (previewArea) {
                        var previewVals = [];
                        for (var i in Data.stockValsMap) {
                            previewVals.push({
                                key: i,
                                val: Data.stockValsMap[i]
                            });
                        }
                        opt.stockPreview = $stockPreview({
                            dom: previewArea,
                            vals: previewVals
                        });
                    }
                    if (stockTableArea) {
                        opt.stockTable = $stockTableNew({
                            dom: stockTableArea,
                            stockList: this.stocks,
                            onChange: function() {
                                if (opt.onChange) {
                                    opt.onChange();
                                }
                            }
                        });
                        opt.stockTable.onChange();
                    }
                } else {
                    opt.dom.innerHTML = '<div class="attr_des"><img class="upload_tips_icon" src="http://static.paipaiimg.com/module/b.png"><span style="color:#FF5500">无销售属性，无法启用多库存模式！</span></div>';
                    if (opt.onChange) {
                        opt.onChange();
                    }
                }
            }
        });
        opt.getStockList = function() {
            if (this.stockTable) {
                return this.stockTable.getValue();
            } else {
                return null;
            }
        }
        opt.getMaxPrice = function() {
            if (this.stockTable && this.stockTable.getMaxPrice) {
                return this.stockTable.getMaxPrice();
            } else {
                return 0;
            }
        }
        opt.getMinPrice = function() {
            if (this.stockTable && this.stockTable.getMinPrice) {
                return this.stockTable.getMinPrice();
            } else {
                return 0;
            }
        }
        opt.getTotalNum = function() {
            if (this.stockTable && this.stockTable.getTotalNum) {
                return this.stockTable.getTotalNum();
            } else {
                return 0;
            }
        }
        opt.check = function() {
            if (this.isAttrMode) {
                if (this.saleSelector) {
                    if (!this.saleSelector.check()) {
                        return {
                            err: true,
                            errMsg: "带*号的销售属性项必须选择！"
                        };
                    }
                }
                return {
                    err: false,
                    errMsg: ""
                };
            } else {
                if (this.saleSelector) {
                    if (!this.saleSelector.check()) {
                        return {
                            err: true,
                            errMsg: "带*号的销售属性项必须选择！"
                        };
                    }
                }
                if (this.stockTable) {
                    return this.stockTable.check();
                } else {
                    return {
                        err: 2,
                        errMsg: "无销售属性，无法启用库存！"
                    };
                }
            }
        }
        opt.getStockPicStr = function() {
            if (this.stockPreview) {
                return this.stockPreview.getValue();
            } else {
                return "";
            }
        }
        opt.getSaleAttrStr = function() {
            if (this.saleSelector) {
                return this.saleSelector.getValueStr().replace(this.saleKeyReg, "").replace(/\d+/g, function(num) {
                    return parseInt(num, 10).toString(16)
                });
            } else {
                return "";
            }
        }
        return opt;
    };
    function $stockPreview(option) {
        var _AreaHTML = "<div style='position:relative'></div>";
        var _ListHTML = '\
        <p><strong>属性预览</strong></p>\
        <dl>\
        <% for(var i=0;i<vals.length;i++){var val=vals[i];%>\
        <dt><%=val.key%>：</dt>\
        <dd>\
        <% for(var k=0;k<val.val.length;k++){var attr=val.val[k];%>\
        <% if(isLogin && picAttrMap[val.key]){%>\
        <% if(!attrPicMap[attr]){%>\
        <div class="stk_pic">\
        <span title="<%=attr%>"><%=attr%></span>\
        <p><button type="button" class="attr_upload">上传</button></p>\
        </div>\
        <% }else{%>\
        <div class="stk_pic">\
        <span title="<%=attr%>"><img src="<%=attrPicMap[attr]%>" alt="<%=attr%>" width="30" height="30" /></span>\
        <p><button type="button" class="attr_delete">删除</button></p>\
        </div>\
        <% }%>\
        <% }else{%>\
        <div class="stk_pic"><span><%=attr%></span></div>\
        <% }%>\
        <% }%>\
        </dd>\
        <% }%>\
        </dl>\
        <span id="<%=flashPlaceHolderId%>"></span>';
        var opt = {
            dom: null,
            vals: [],
            tmpl: {
                areaHTML: _AreaHTML,
                listHTML: _ListHTML
            },
            flashPlaceHolderId: "stockAttrPicUploader",
            stockImgStr: ""
        }
        $extend(opt, option);
        if (!opt.dom) {
            alert("不可用的dom节点，无法初始化");
            return false;
        }
        var Data = {
            vals: [],
            valsMap: {},
            attrPicMap: {},
            picAttrMap: {
                "颜色": 1
            },
            flashPlaceHolderId: "",
            isLogin: false,
            init: function() {
                this.flashPlaceHolderId = opt.flashPlaceHolderId;
                this.initVals();
                this.initAttrPic();
                if (($getCookie("p_uin") && $getCookie("p_skey")) || ($getUin() && $getCookie("skey"))) {
                    this.isLogin = true;
                }
            },
            initVals: function() {
                this.vals = [];
                this.valsMap = {};
                for (var i = 0; i < opt.vals.length; i++) {
                    var val = opt.vals[i];
                    if (val.val.length) {
                        this.vals.push(val);
                        this.valsMap[val.key] = val.val;
                    }
                }
            },
            initAttrPic: function() {
                this.attrPicMap = {};
                var strReg = /(.+:.+\|.+;?)+/g;
                if (strReg.test(opt.stockImgStr)) {
                    var attrImgAr = opt.stockImgStr.split(";");
                    if (attrImgAr.length) {
                        for (var i = 0, l = attrImgAr.length; i < l; i++) {
                            var info = attrImgAr[i].split(/[|\u7D74]/);
                            var attrValue = info[0].split(":")[1];
                            this.attrPicMap[attrValue] = info[1];
                        }
                    }
                }
            }
        };
        Data.init();
        var tempDom = document.createElement("div");
        tempDom.innerHTML = opt.tmpl.areaHTML;
        var areaDom = $getFirst(tempDom);
        opt.dom.innerHTML = "";
        opt.dom.appendChild(areaDom);
        areaDom.onclick = function(e) {
            var t = $getTarget(e);
            if (t.innerHTML == "删除") {
                var container = $getPrev(t.parentNode);
                var imgDom = $getLast(container);
                if (imgDom) {
                    delete Data.attrPicMap[imgDom.alt];
                }
                container.innerHTML = imgDom.alt;
                t.className = "attr_upload";
                t.innerHTML = "上传";
                t.disabled = false;
                $fireEvent(t, "mouseover");
            }
        }
        areaDom.onmouseover = function(e) {
            var t = $getTarget(e);
            var that = this;
            if (t.tagName == "BUTTON" && t.innerHTML == "上传"&&!t.disabled) {
                if (this.flashDom) {
                    this.flashDom.style.top = ($getYP(t.parentNode) - $getYP(this)) + "px";
                    this.flashDom.style.left = (t.parentNode.getBoundingClientRect().left - this.getBoundingClientRect().left) + "px";
                    $display(this.flashDom);
                    try {
                        window.SWFUpload.instances[this.flashDom.id].setButtonDisabled(false);
                    } catch (e) {}
                }
                that.currentDom = t;
            }
        }
        var retCodeForUpload = {
            d: null,
            init: function() {
                try {
                    this.d = $returnCode({
                        url: "http://my.paipai.com/cgi-bin/item_mgn/tempimg",
                        frequence: 1
                    });
                } catch (e) {}
            },
            report: function(b, d) {
                this.d && (this.d.report(b, d));
            }
        };
        var targetImgs = [];
        var _FlashInitParam = {
            upload_url: "http://my.paipai.com/cgi-bin/item_mgn/tempimg",
            file_post_name: "strTempFile",
            post_params: {
                "dwUin": (($getCookie("p_uin") || $getUin() || "") + "").replace("o0", ""),
                "strSkey": encodeURIComponent($getCookie("p_skey") || $getCookie("skey") || "")
            },
            file_size_limit: "990KB",
            file_types: "*.jpg;*.gif",
            file_types_description: "Web Image Files",
            file_upload_limit: 0,
            file_queue_limit: 5,
            file_queue_error_handler: function(file, errorCode, message) {
                switch (errorCode) {
                case window.SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                    alert("文件" + file.name + "为无效的图片文件");
                    break;
                case window.SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    alert("图片文件" + file.name + "大小为"+~~(file.size / 1024) + "kb,超过了990kb的大小限制");
                    break;
                case window.SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                    alert("图片文件" + file.name + "类型无效");
                    break;
                case window.SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                    alert("上传的文件过多，最多可以同时上传5张图片");
                    break;
                default:
                    alert("文件检测时发生错误,错误代码:'" + errorCode + "',错误信息:'" + message + "'");
                    break;
                }
            },
            file_dialog_complete_handler: function(numFilesSelected, numFilesQueued) {
                if (numFilesQueued == 1) {
                    var cdom = areaDom.currentDom;
                    var container = $getPrev(cdom.parentNode);
                    container.innerHTML = "<img src='http://static.paipaiimg.com/assets/common/loading2.gif' alt='" + container.innerHTML + "' width='30' height='30' />";
                    targetImgs.push(container.lastChild);
                    cdom.className = "attr_upload_disable";
                    cdom.disabled = true;
                    retCodeForUpload.init();
                    this.setButtonDisabled(true);
                    this.startUpload();
                } else {
                    while (this.getStats().files_queued > 0) {
                        this.cancelUpload(null, false);
                    }
                }
            },
            upload_progress_handler: function(file, bytesLoaded) {
                var percent = Math.ceil((bytesLoaded / file.size) * 100);
                if (percent < 100) {}
            },
            upload_error_handler: function(file, errorCode, message) {
                retCodeForUpload.report(false, errorCode);
                if (errorCode === window.SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED) {
                    alert("图片文件超过了990kb的大小限制");
                } else {
                    alert("上传图片发生错误");
                }
                var img = targetImgs.shift();
                var container = img.parentNode;
                var btnDom = $getLast($getNext(container));
                container.innerHTML = img.alt;
                btnDom.className = "attr_upload";
                btnDom.disabled = false;
                if (areaDom.currentDom == btnDom) {
                    this.setButtonDisabled(false);
                    this.getMovieElement().style.display = "none";
                }
            },
            upload_success_handler: function(file, serverData) {
                var _this = this;
                var d = eval("(" + serverData + ")");
                retCodeForUpload.report(d.RetCode == 0 ? true : false, d.RetCode);
                var img = targetImgs.shift();
                if (d.RetCode == 0) {
                    setTimeout(function() {
                        img.onload = function() {
                            var btnDom = $getLast($getNext(this.parentNode));
                            this.onload = null;
                            btnDom.className = "attr_delete";
                            btnDom.disabled = false;
                            btnDom.innerHTML = "删除";
                            Data.attrPicMap[this.alt] = this.src;
                            if (areaDom.currentDom == btnDom) {
                                _this.setButtonDisabled(false);
                                _this.getMovieElement().style.display = "none";
                            }
                        }
                        img.src = d.RetUrl;
                    }, 1000);
                } else {
                    var container = img.parentNode;
                    var btnDom = $getLast($getNext(container));
                    container.innerHTML = img.alt;
                    btnDom.disabled = false;
                    btnDom.className = "attr_upload";
                    if (areaDom.currentDom == btnDom) {
                        this.setButtonDisabled(false);
                        this.getMovieElement().style.display = "none";
                    }
                    if (d.RetCode == 1) {
                        alert("未登录,请重新登录");
                    } else if (d.RetCode == 2) {
                        alert("图片太大或者不合法");
                    } else {
                        alert("上传失败");
                    }
                }
            },
            upload_complete_handler: function(file) {
                if (this.getStats() && this.getStats().files_queued > 0) {
                    if (targetImgs.length > 0) {
                        retCodeForUpload.init();
                        this.startUpload();
                    } else {
                        while (this.getStats().files_queued > 0) {
                            this.cancelUpload(null, false);
                        }
                    }
                }
            },
            button_image_url: "http://static.paipaiimg.com/upload/attr_upload_btn_xp.png",
            button_width: 40,
            button_height: 22,
            button_text_top_padding: 1,
            button_text_left_padding: 5,
            button_cursor: -2,
            button_text: "上传",
            flash_url: "http://my.paipai.com/swfupload.swf"
        }
        areaDom.flush = function() {
            if (!Data.vals.length) {
                this.innerHTML = "";
                $display(opt.dom, "none");
                return;
            }
            $display(opt.dom);
            this.innerHTML = $txTpl(opt.tmpl.listHTML, Data);
            if (Data.isLogin) {
                _FlashInitParam.button_placeholder_id = Data.flashPlaceHolderId;
                $SWFUpload(_FlashInitParam);
                this.flashDom = this.getElementsByTagName("object")[0];
                if (this.flashDom) {
                    $display(this.flashDom, "none");
                }
            } else {
                $display(Data.flashPlaceHolderId, "none");
            }
        }
        areaDom.flush();
        opt.getValue = function() {
            var retStr = [];
            for (var i = 0; i < Data.vals.length; i++) {
                var val = Data.vals[i];
                if (Data.picAttrMap[val.key]) {
                    for (var j = 0; j < val.val.length; j++) {
                        var attrval = val.val[j];
                        if (Data.attrPicMap[attrval]) {
                            retStr.push(val.key + ":" + attrval + "|" + Data.attrPicMap[attrval]);
                        }
                    }
                }
            }
            return retStr.join(";");
        }
        opt.setValue = function(vals) {
            this.vals = vals;
            Data.initVals();
            areaDom.flush();
        }
        return opt;
    };
    function $stockTableNew(option) {
        var _InvaildTextRegMap = {
            stockId: /[^\u4e00-\u9fa5\w-\/\.]/g,
            desc: /[^\u4e00-\u9fa5\w-\/\.]/g,
            price: /[^\d\.]/g,
            num: /[^\d]/g
        }
        var _AreaHTML = '<div></div>';
        var _TableHTML = '\
        <% if(stocks.length){ %>\
        <% if(window.clipboardData){ %>\
        <p class="stock_tips">小提示：复制excel表格里的内容，粘贴到下面的列表中试试？ <a href="#copyExcel" action="copyExcel">复制下图表为Excel表格格式</a></p>\
        <% }%>\
        <table class="stock_tb">\
        <colgroup>\
        <% for(var i=0;i<saleAttrs.length;i++){ %>\
        <col>\
        <% }%>\
        <col width="160">\
        <col width="90">\
        <col width="90">\
        <col width="95">\
        </colgroup>\
        <thead>\
        <tr>\
        <% for(var i=0;i<saleAttrs.length;i++){ var attr = saleAttrs[i];%>\
        <th title="<%=attr%>"><%=$strSubGB(attr,0,24)%></th>\
        <% }%>\
        <th>库存编码</th>\
        <th><label><input type="checkbox" dtype="price" action="allAsFirst" style="display:none">价格(元)</label></th>\
        <th><label><input type="checkbox" dtype="num"  action="allAsFirst" style="display:none">数量(件)</label></th>\
        <th>备注</th>\
        </tr>\
        </thead>\
        <tbody>\
        <% for(var i=0;i<stocks.length;i++){ var stock=stocks[i];%>\
        <tr class="<%=(((stock.num+"") && (stock.num*1)<=0)?"out_stock":"")%>">\
        <% for(var k=0;k<saleAttrs.length;k++){ var attr = saleAttrs[k];%>\
        <td class="col0"><%=(stock[attr]||"无")%></td>\
        <% }%>\
        <td class="col1" nowrap="">\
        <input maxlength="20" class="inp-01" type="text" stype="stockId" value="<%=stock.stockId%>" saleattr="<%=stock.saleAttr%>" />\
        </td>\
        <td class="col2" nowrap="">\
        <input maxlength="20" class="inp-02" type="text" stype="price" value="<%=stock.price%>" saleattr="<%=stock.saleAttr%>" />\
        <a class="batch_icon" title="复制该[价格]到…" href="#batchDeal" action="batchDeal" ></a>\
        </td>\
        <td class="col3" nowrap="">\
        <input maxlength="20" class="inp-02" type="text" stype="num" value="<%=stock.num%>" saleattr="<%=stock.saleAttr%>" />\
        <a class="batch_icon" title="复制该[数量]到…" href="#batchDeal" action="batchDeal"></a>\
        </td>\
        <td class="col4" nowrap="">\
        <input maxlength="20" class="inp-01" type="text" stype="desc" value="<%=stock.desc%>" saleattr="<%=stock.saleAttr%>" />\
        </td>\
        </tr>\
        <% }%>\
        </tbody>\
        </table>\
        <% }%>\
        ';
        var _BatchFloatHTML = '\
        <div tag="batchDeal" style="position:relative;z-index:100;display:inline">\
        <ul class="optlist">\
        <% if(saleAttrs.length>1){\
        for(var i=0;i<saleAttrs.length;i++){var attr=saleAttrs[i];%>\
        <li><a href="#deal" action="deal" attr="<%=attr%>" attrval="<%=stock[attr]%>"><%=$strSubGB(attr,0,6)%>相同项目</a></li>\
        <% }\
        }%>\
        <li><a href="#deal" action="deal" attr="">所有项目</a></li>\
        </ul>\
        </div>';
        var opt = {
            dom: null,
            tmpl: {
                areaHTML: _AreaHTML,
                tableHTML: _TableHTML,
                batchFloatHTML: _BatchFloatHTML
            },
            textInvaildRegMap: _InvaildTextRegMap,
            textMaxLength: 20,
            stockList: []
        };
        $extend(opt, option);
        if (!opt.dom) {
            alert("不可用的dom节点，无法初始化");
            return false;
        }
        if (!opt.stockList) {
            opt.stockList = [];
        }
        var Data = {
            stocks: [],
            stocksMap: {},
            saleAttrs: [],
            dataAttrs: ["stockId", "price", "num", "desc"],
            minPrice: 0,
            maxPrice: 0,
            totalNum: 0,
            init: function() {
                this.stocks = [];
                this.stocksMap = {};
                this.saleAttrs = [];
                this.dataAttrs = ["stockId", "price", "num", "desc"];
                for (var i = 0; i < opt.stockList.length; i++) {
                    var stock = {};
                    $extend(stock, opt.stockList[i]);
                    for (var k in opt.textInvaildRegMap) {
                        if (stock[k]) {
                            stock[k] = (stock[k] + "").replace(opt.textInvaildRegMap[k], "").substr(0, opt.textMaxLength);
                        }
                    }
                    if (isNaN(stock.num))
                        stock.num = "";
                    if (isNaN(stock.price))
                        stock.price = "";
                    stock.num = stock.num ? (stock.num + "") : "";
                    stock.price = stock.price ? (stock.price + "") : "";
                    stock.stockId = stock.stockId ? (stock.stockId + "") : "";
                    stock.desc = stock.desc ? (stock.desc + "") : "";
                    if (!stock.saleAttr)
                        stock.saleAttr = stock.attr;
                    var attrs = stock.attr.split("|");
                    for (var j = 0; j < attrs.length; j++) {
                        var attr = attrs[j].split(":");
                        if (attr.length == 2) {
                            if ($inArray(attr[0], this.saleAttrs)==-1) {
                                this.saleAttrs.push(attr[0]);
                            }
                            stock[attr[0]] = attr[1];
                        }
                    }
                    this.stocks.push(stock);
                    this.stocksMap[stock.saleAttr] = stock;
                }
                this.statistic();
            },
            modifyStockInfo: function(saleattr, stype, val) {
                var stock = this.stocksMap[saleattr];
                if (stock && stock[stype] !== undefined) {
                    val = (val + "").replace(opt.textInvaildRegMap[stype], "").substr(0, opt.textMaxLength);
                    if (stype == "num") {
                        if (isNaN(val) ||!val) {
                            val = "";
                        } else {
                            val = parseInt(val, 10);
                            if (val > 1000000) {
                                val = 1000000;
                            }
                        }
                    } else if (stype == "price") {
                        if (isNaN(val) ||!val) {
                            val = "";
                        } else {
                            if (parseFloat(val, 10) >= 5000000) {
                                val = 5000000;
                            } else {
                                if (parseInt(val, 10) == parseFloat(val, 10)) {
                                    val = parseInt(val, 10);
                                } else {
                                    val = parseFloat(val, 10).toFixed(2);
                                }
                                if (parseFloat(val, 10) < 0.01) {
                                    val = "";
                                }
                            }
                        }
                    }
                    stock[stype] = (val + "");
                    this.statistic();
                    return stock[stype];
                }
                return false;
            },
            statistic: function() {
                this.minPrice = 0;
                this.maxPrice = 0;
                this.totalNum = 0;
                for (var i = 0; i < this.stocks.length; i++) {
                    var stock = this.stocks[i];
                    this.minPrice = Math.min(this.minPrice || 5000000, stock.price);
                    this.maxPrice = Math.max(this.maxPrice, stock.price);
                    this.totalNum += (stock.num * 1);
                }
            }
        }
        Data.init();
        var tempDom = document.createElement("div");
        tempDom.innerHTML = opt.tmpl.areaHTML;
        var areaDom = $getLast(tempDom);
        opt.dom.innerHTML = "";
        opt.dom.appendChild(areaDom);
        opt.getMaxPrice = function() {
            return Data.maxPrice;
        }
        opt.getMinPrice = function() {
            return Data.minPrice;
        }
        opt.getTotalNum = function() {
            return Data.totalNum;
        }
        areaDom.flush = function() {
            areaDom.innerHTML = $txTpl(opt.tmpl.tableHTML, Data);
            var ipts = this.getElementsByTagName("input");
            for (var i = 0, l = ipts.length; i < l; i++) {
                var ipt = ipts[i];
                if (ipt.type == "text") {
                    ipt.onfocus = function() {};
                    ipt.checkAndChange = function() {
                        var saleAttr = this.getAttribute("saleattr");
                        var stype = this.getAttribute("stype");
                        var val = $strTrim(this.value);
                        val = Data.modifyStockInfo(saleAttr, stype, val);
                        this.value = val || "";
                        if (stype == "num") {
                            if (this.value && this.value * 1 == 0) {
                                this.parentNode.parentNode.className = "out_stock";
                            } else {
                                this.parentNode.parentNode.className = "";
                            }
                        }
                        if (opt.onChange) {
                            opt.onChange();
                        }
                    }
                    ipt.onblur = function() {
                        this.checkAndChange();
                    }
                }
            }
            if (opt.onChange) {
                opt.onChange();
            }
        }
        areaDom.onclick = function(e) {
            var t = $getTarget(e);
            var action = t.getAttribute("action");
            var that = this;
            if (action) {
                switch (action) {
                case"copyExcel":
                    if (window.clipboardData) {
                        var t = [];
                        for (var i = 0; i < Data.stocks.length; i++) {
                            var stock = Data.stocks[i];
                            t.push([stock.stockId, stock.price, stock.num, stock.desc].join("\t"));
                        }
                        t = t.join("\r\n");
                        window.clipboardData.setData("text", t);
                        alert("温馨提示:\n\n" + "数据已复制，请直接粘贴在Excel表格中。");
                    }
                    break;
                case"allAsFirst":
                    var dtype = t.getAttribute("dtype");
                    var domList = $attr("stype", dtype, this);
                    var checked = t.checked;
                    var firstVal = Data.stocks[0][dtype];
                    for (var i = 0, l = domList.length; i < l; i++) {
                        var dom = domList[i];
                        if (dom.tagName == "INPUT" && dom.type == "text") {
                            dom.value = checked ? firstVal : "";
                            dom.checkAndChange();
                        }
                    }
                    break;
                case"batchDeal":
                    var iptDom = $getPrev(t);
                    if (!iptDom.value) {
                        iptDom.focus();
                        return;
                    }
                    var stock = Data.stocksMap[iptDom.getAttribute("saleattr")];
                    if (!stock)
                        return;
                    var existDom = $attr("tag", "batchDeal", t.parentNode)[0];
                    if (existDom) {
                        existDom.parentNode.removeChild(existDom);
                        delete t.parentNode.onmouseout;
                        delete t.parentNode.onmouseover;
                        return;
                    }
                    var tempDom = document.createElement("div");
                    tempDom.innerHTML = $txTpl(opt.tmpl.batchFloatHTML, {
                        saleAttrs: Data.saleAttrs,
                        stock: stock
                    });
                    var batchDom = $getLast(tempDom);
                    batchDom.onclick = function(e) {
                        var t = $getTarget(e);
                        var action = t.getAttribute("action");
                        if (action == "deal") {
                            var batchVal = iptDom.value;
                            var stype = iptDom.getAttribute("stype");
                            var attr = t.getAttribute("attr");
                            var attrval = t.getAttribute("attrval");
                            var domList = $attr("stype", stype, that);
                            for (var i = 0, l = domList.length; i < l; i++) {
                                var dom = domList[i];
                                if (dom.tagName == "INPUT" && dom.type == "text") {
                                    if (attr && attrval) {
                                        var domSaleAttr = dom.getAttribute("saleattr");
                                        var stock = Data.stocksMap[domSaleAttr];
                                        if (stock[attr] != attrval) {
                                            continue;
                                        }
                                    }
                                    dom.value = batchVal;
                                    dom.checkAndChange();
                                }
                            }
                            batchDom.parentNode.removeChild(batchDom);
                        }
                    }
                    t.parentNode.appendChild(batchDom);
                    t.parentNode.onmouseout = function() {
                        var that = this;
                        this.closeTimer = setTimeout(function() {
                            var batchDom = $attr("tag", "batchDeal", that)[0];
                            if (batchDom) {
                                batchDom.parentNode.removeChild(batchDom);
                            }
                            delete that.onmouseout;
                            delete that.onmouseover;
                        }, 200);
                    }
                    t.parentNode.onmouseover = function() {
                        clearTimeout(this.closeTimer);
                    }
                    break;
                default:
                    break;
                }
            }
        }
        if (window.clipboardData) {
            areaDom.onpaste = function(e) {
                var t = $getTarget(e);
                if (t && t.tagName == "INPUT" && t.type == "text") {
                    var txt = window.clipboardData.getData("text");
                    if (txt && txt.length && /(.*\n.*){2,}/.test(txt)) {
                        txt = txt.replace(/^\n|\n$/, "").split("\r\n");
                        var crtIndex = 0;
                        var crtRow = t.parentNode.parentNode;
                        var inputIndex = 0;
                        (function() {
                            var doms = crtRow.getElementsByTagName("input");
                            for (var i = 0, l = doms.length; i < l; i++) {
                                if (doms[i] == t) {
                                    inputIndex = i;
                                    break;
                                }
                            }
                        })();
                        while (crtRow && txt[crtIndex]) {
                            var inputs = crtRow.getElementsByTagName("input");
                            var values = txt[crtIndex].split("\t");
                            for (var i = 0, l = (inputs.length - inputIndex); i < l; i++) {
                                if (values[i]) {
                                    inputs[i + inputIndex].value = values[i];
                                    inputs[i + inputIndex].checkAndChange();
                                } else {
                                    break;
                                }
                            }
                            crtRow = crtRow.nextSibling;
                            crtIndex++;
                        }
                        return false;
                    }
                    return true;
                }
            }
        }
        areaDom.flush();
        opt.check = function() {
            if (document.activeElement && document.activeElement.checkAndChange) {
                document.activeElement.checkAndChange();
            }
            if (Data.stocks.length == 0) {
                return {
                    err: true,
                    errMsg: "请设置库存后再提交！"
                };
            }
            if (Data.stocks.length > 200) {
                return {
                    err: true,
                    errMsg: "库存不能超过200条，请删除部分后再提交！"
                };
            }
            for (var i = 0; i < Data.stocks.length; i++) {
                var stock = Data.stocks[i];
                if (!stock.price || stock.price * 1 <= 0 || stock.price * 1 > 5000000) {
                    return {
                        err: true,
                        errMsg: "库存价格[0.01-500W]设置不正确，请修改后再提交！"
                    };
                }
                if ((stock.num + "") == "") {
                    return {
                        err: true,
                        errMsg: "请设置库存数量！"
                    };
                }
                if (stock.num * 1 < 0 || stock.num * 1 > 1000000) {
                    return {
                        err: true,
                        errMsg: "库存数量[0-100W]设置不正确，请修改后再提交！"
                    };
                }
            }
            return {
                err: false,
                errMsg: ""
            };
        }
        opt.getValue = function() {
            var vals = [];
            for (var i = 0; i < Data.stocks.length; i++) {
                var stock = Data.stocks[i];
                vals.push({
                    "saleAttr": stock.saleAttr + "",
                    "stockId": stock.stockId + "",
                    "price": stock.price + "",
                    "num": stock.num + "",
                    "desc": stock.desc + "",
                    "attr": stock.attr + "",
                    "specAttr": stock.specAttr + "",
                    "skuId": (stock.skuId || "0")
                });
            }
            return vals;
        }
        opt.setValue = function(stockList) {
            this.stockList = stockList;
            Data.init();
            areaDom.flush();
        }
        return opt;
    };
    function $strLenGB(v) {
        return v.replace(/[\u00FF-\uFFFF]/g, "  ").length;
    };
    function $strSubGB(str, start, len, flag) {
        var total = $strLenGB(str);
        if (total > (len - start)) {
            var flag = flag || "";
            var strTemp = str.replace(/[\u00FF-\uFFFF]/g, "@-").substr(start, len);
            var subLen = strTemp.match(/@-/g) ? strTemp.match(/@-/g).length: 0;
            return str.substring(0, len - subLen) + flag;
        }
        return str;
    };
    function $strTrim(str, code) {
        var argus = code || "\\s";
        var temp = new RegExp("(^" + argus + "*)|(" + argus + "*$)", "g");
        return str.replace(temp, "");
    };
    function $SWFUpload(option) {
        if (window.SWFUpload) {
            return new window.SWFUpload(option);
        }
        var SWFUpload;
        if (SWFUpload == undefined) {
            SWFUpload = function(settings) {
                this.initSWFUpload(settings);
            };
        }
        SWFUpload.prototype.initSWFUpload = function(settings) {
            try {
                this.customSettings = {};
                this.settings = settings;
                this.eventQueue = [];
                this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
                this.movieElement = null;
                SWFUpload.instances[this.movieName] = this;
                this.initSettings();
                this.loadFlash();
                this.displayDebugInfo();
            } catch (ex) {
                delete SWFUpload.instances[this.movieName];
                throw ex;
            }
        };
        SWFUpload.copyRight = ["SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com", "SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz? and Mammon Media and is released under the MIT License:", "http://www.opensource.org/licenses/mit-license.php", "SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz? and Mammon Media and is released under the MIT License:", "http://www.opensource.org/licenses/mit-license.php", "SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:", "http://www.opensource.org/licenses/mit-license.php"];
        SWFUpload.instances = {};
        SWFUpload.movieCount = 0;
        SWFUpload.version = "2.2.0 2009-03-25";
        SWFUpload.QUEUE_ERROR = {
            QUEUE_LIMIT_EXCEEDED: -100,
            FILE_EXCEEDS_SIZE_LIMIT: -110,
            ZERO_BYTE_FILE: -120,
            INVALID_FILETYPE: -130
        };
        SWFUpload.UPLOAD_ERROR = {
            HTTP_ERROR: -200,
            MISSING_UPLOAD_URL: -210,
            IO_ERROR: -220,
            SECURITY_ERROR: -230,
            UPLOAD_LIMIT_EXCEEDED: -240,
            UPLOAD_FAILED: -250,
            SPECIFIED_FILE_ID_NOT_FOUND: -260,
            FILE_VALIDATION_FAILED: -270,
            FILE_CANCELLED: -280,
            UPLOAD_STOPPED: -290
        };
        SWFUpload.FILE_STATUS = {
            QUEUED: -1,
            IN_PROGRESS: -2,
            ERROR: -3,
            COMPLETE: -4,
            CANCELLED: -5
        };
        SWFUpload.BUTTON_ACTION = {
            SELECT_FILE: -100,
            SELECT_FILES: -110,
            START_UPLOAD: -120
        };
        SWFUpload.CURSOR = {
            ARROW: -1,
            HAND: -2
        };
        SWFUpload.WINDOW_MODE = {
            WINDOW: "window",
            TRANSPARENT: "transparent",
            OPAQUE: "opaque"
        };
        SWFUpload.completeURL = function(url) {
            if (typeof(url) !== "string" || url.match(/^https?:\/\//i) || url.match(/^\//)) {
                return url;
            }
            var currentURL = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
            var indexSlash = window.location.pathname.lastIndexOf("/");
            if (indexSlash <= 0) {
                path = "/";
            } else {
                path = window.location.pathname.substr(0, indexSlash) + "/";
            }
            return path + url;
        };
        SWFUpload.prototype.initSettings = function() {
            this.ensureDefault = function(settingName, defaultValue) {
                this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
            };
            this.ensureDefault("upload_url", "");
            this.ensureDefault("preserve_relative_urls", false);
            this.ensureDefault("file_post_name", "Filedata");
            this.ensureDefault("post_params", {});
            this.ensureDefault("use_query_string", false);
            this.ensureDefault("requeue_on_error", false);
            this.ensureDefault("http_success", []);
            this.ensureDefault("assume_success_timeout", 0);
            this.ensureDefault("file_types", "*.*");
            this.ensureDefault("file_types_description", "All Files");
            this.ensureDefault("file_size_limit", 0);
            this.ensureDefault("file_upload_limit", 0);
            this.ensureDefault("file_queue_limit", 0);
            this.ensureDefault("flash_url", "swfupload.swf");
            this.ensureDefault("prevent_swf_caching", true);
            this.ensureDefault("button_image_url", "");
            this.ensureDefault("button_width", 1);
            this.ensureDefault("button_height", 1);
            this.ensureDefault("button_text", "");
            this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
            this.ensureDefault("button_text_top_padding", 0);
            this.ensureDefault("button_text_left_padding", 0);
            this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
            this.ensureDefault("button_disabled", false);
            this.ensureDefault("button_placeholder_id", "");
            this.ensureDefault("button_placeholder", null);
            this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
            this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);
            this.ensureDefault("debug", false);
            this.settings.debug_enabled = this.settings.debug;
            this.settings.return_upload_start_handler = this.returnUploadStart;
            this.ensureDefault("swfupload_loaded_handler", null);
            this.ensureDefault("file_dialog_start_handler", null);
            this.ensureDefault("file_queued_handler", null);
            this.ensureDefault("file_queue_error_handler", null);
            this.ensureDefault("file_dialog_complete_handler", null);
            this.ensureDefault("upload_start_handler", null);
            this.ensureDefault("upload_progress_handler", null);
            this.ensureDefault("upload_error_handler", null);
            this.ensureDefault("upload_success_handler", null);
            this.ensureDefault("upload_complete_handler", null);
            this.ensureDefault("debug_handler", this.debugMessage);
            this.ensureDefault("custom_settings", {});
            this.customSettings = this.settings.custom_settings;
            if (!!this.settings.prevent_swf_caching) {
                this.settings.flash_url = this.settings.flash_url + (this.settings.flash_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime();
            }
            if (!this.settings.preserve_relative_urls) {
                this.settings.upload_url = SWFUpload.completeURL(this.settings.upload_url);
                this.settings.button_image_url = SWFUpload.completeURL(this.settings.button_image_url);
            }
            delete this.ensureDefault;
        };
        SWFUpload.prototype.loadFlash = function() {
            var targetElement, tempParent;
            if (document.getElementById(this.movieName) !== null) {
                throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
            }
            targetElement = document.getElementById(this.settings.button_placeholder_id) || this.settings.button_placeholder;
            if (targetElement == undefined) {
                throw "Could not find the placeholder element: " + this.settings.button_placeholder_id;
            }
            tempParent = document.createElement("div");
            tempParent.innerHTML = this.getFlashHTML();
            targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);
            if (window[this.movieName] == undefined) {
                window[this.movieName] = this.getMovieElement();
            }
        };
        SWFUpload.prototype.getFlashHTML = function() {
            return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">', '<param name="wmode" value="', this.settings.button_window_mode, '" />', '<param name="movie" value="', this.settings.flash_url, '" />', '<param name="quality" value="high" />', '<param name="menu" value="false" />', '<param name="allowScriptAccess" value="always" />', '<param name="flashvars" value="' + this.getFlashVars() + '" />', '</object>'].join("");
        };
        SWFUpload.prototype.getFlashVars = function() {
            var paramString = this.buildParamString();
            var httpSuccessString = this.settings.http_success.join(",");
            return ["movieName=", encodeURIComponent(this.movieName), "&amp;uploadURL=", encodeURIComponent(this.settings.upload_url), "&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string), "&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error), "&amp;httpSuccess=", encodeURIComponent(httpSuccessString), "&amp;assumeSuccessTimeout=", encodeURIComponent(this.settings.assume_success_timeout), "&amp;params=", encodeURIComponent(paramString), "&amp;filePostName=", encodeURIComponent(this.settings.file_post_name), "&amp;fileTypes=", encodeURIComponent(this.settings.file_types), "&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description), "&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit), "&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit), "&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit), "&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled), "&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url), "&amp;buttonWidth=", encodeURIComponent(this.settings.button_width), "&amp;buttonHeight=", encodeURIComponent(this.settings.button_height), "&amp;buttonText=", encodeURIComponent(this.settings.button_text), "&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding), "&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding), "&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style), "&amp;buttonAction=", encodeURIComponent(this.settings.button_action), "&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled), "&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)].join("");
        };
        SWFUpload.prototype.getMovieElement = function() {
            if (this.movieElement == undefined) {
                this.movieElement = document.getElementById(this.movieName);
            }
            if (this.movieElement === null) {
                throw "Could not find Flash element";
            }
            return this.movieElement;
        };
        SWFUpload.prototype.buildParamString = function() {
            var postParams = this.settings.post_params;
            var paramStringPairs = [];
            if (typeof(postParams) === "object") {
                for (var name in postParams) {
                    if (postParams.hasOwnProperty(name)) {
                        paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
                    }
                }
            }
            return paramStringPairs.join("&amp;");
        };
        SWFUpload.prototype.destroy = function() {
            try {
                this.cancelUpload(null, false);
                var movieElement = null;
                movieElement = this.getMovieElement();
                if (movieElement && typeof(movieElement.CallFunction) === "unknown") {
                    for (var i in movieElement) {
                        try {
                            if (typeof(movieElement[i]) === "function") {
                                movieElement[i] = null;
                            }
                        } catch (ex1) {}
                    }
                    try {
                        movieElement.parentNode.removeChild(movieElement);
                    } catch (ex) {}
                }
                window[this.movieName] = null;
                SWFUpload.instances[this.movieName] = null;
                delete SWFUpload.instances[this.movieName];
                this.movieElement = null;
                this.settings = null;
                this.customSettings = null;
                this.eventQueue = null;
                this.movieName = null;
                return true;
            } catch (ex2) {
                return false;
            }
        };
        SWFUpload.prototype.displayDebugInfo = function() {
            this.debug(["---SWFUpload Instance Info---\n", "Version: ", SWFUpload.version, "\n", "Movie Name: ", this.movieName, "\n", "Settings:\n", "\t", "upload_url:               ", this.settings.upload_url, "\n", "\t", "flash_url:                ", this.settings.flash_url, "\n", "\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n", "\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n", "\t", "http_success:             ", this.settings.http_success.join(", "), "\n", "\t", "assume_success_timeout:   ", this.settings.assume_success_timeout, "\n", "\t", "file_post_name:           ", this.settings.file_post_name, "\n", "\t", "post_params:              ", this.settings.post_params.toString(), "\n", "\t", "file_types:               ", this.settings.file_types, "\n", "\t", "file_types_description:   ", this.settings.file_types_description, "\n", "\t", "file_size_limit:          ", this.settings.file_size_limit, "\n", "\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n", "\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n", "\t", "debug:                    ", this.settings.debug.toString(), "\n", "\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n", "\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n", "\t", "button_placeholder:       ", (this.settings.button_placeholder ? "Set" : "Not Set"), "\n", "\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n", "\t", "button_width:             ", this.settings.button_width.toString(), "\n", "\t", "button_height:            ", this.settings.button_height.toString(), "\n", "\t", "button_text:              ", this.settings.button_text.toString(), "\n", "\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n", "\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n", "\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n", "\t", "button_action:            ", this.settings.button_action.toString(), "\n", "\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n", "\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n", "Event Handlers:\n", "\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n", "\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n", "\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n", "\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n", "\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n", "\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n", "\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n", "\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n", "\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n", "\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"].join(""));
        };
        SWFUpload.prototype.addSetting = function(name, value, default_value) {
            if (value == undefined) {
                return (this.settings[name] = default_value);
            } else {
                return (this.settings[name] = value);
            }
        };
        SWFUpload.prototype.getSetting = function(name) {
            if (this.settings[name] != undefined) {
                return this.settings[name];
            }
            return "";
        };
        SWFUpload.prototype.callFlash = function(functionName, argumentArray) {
            argumentArray = argumentArray || [];
            var movieElement = this.getMovieElement();
            var returnValue, returnString;
            try {
                returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
                returnValue = eval(returnString);
            } catch (ex) {
                throw "Call to " + functionName + " failed";
            }
            if (returnValue != undefined && typeof returnValue.post === "object") {
                returnValue = this.unescapeFilePostParams(returnValue);
            }
            return returnValue;
        };
        SWFUpload.prototype.selectFile = function() {
            this.callFlash("SelectFile");
        };
        SWFUpload.prototype.selectFiles = function() {
            this.callFlash("SelectFiles");
        };
        SWFUpload.prototype.startUpload = function(fileID) {
            this.callFlash("StartUpload", [fileID]);
        };
        SWFUpload.prototype.cancelUpload = function(fileID, triggerErrorEvent) {
            if (triggerErrorEvent !== false) {
                triggerErrorEvent = true;
            }
            this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
        };
        SWFUpload.prototype.stopUpload = function() {
            this.callFlash("StopUpload");
        };
        SWFUpload.prototype.getStats = function() {
            return this.callFlash("GetStats");
        };
        SWFUpload.prototype.setStats = function(statsObject) {
            this.callFlash("SetStats", [statsObject]);
        };
        SWFUpload.prototype.getFile = function(fileID) {
            if (typeof(fileID) === "number") {
                return this.callFlash("GetFileByIndex", [fileID]);
            } else {
                return this.callFlash("GetFile", [fileID]);
            }
        };
        SWFUpload.prototype.addFileParam = function(fileID, name, value) {
            return this.callFlash("AddFileParam", [fileID, name, value]);
        };
        SWFUpload.prototype.removeFileParam = function(fileID, name) {
            this.callFlash("RemoveFileParam", [fileID, name]);
        };
        SWFUpload.prototype.setUploadURL = function(url) {
            this.settings.upload_url = url.toString();
            this.callFlash("SetUploadURL", [url]);
        };
        SWFUpload.prototype.setPostParams = function(paramsObject) {
            this.settings.post_params = paramsObject;
            this.callFlash("SetPostParams", [paramsObject]);
        };
        SWFUpload.prototype.addPostParam = function(name, value) {
            this.settings.post_params[name] = value;
            this.callFlash("SetPostParams", [this.settings.post_params]);
        };
        SWFUpload.prototype.removePostParam = function(name) {
            delete this.settings.post_params[name];
            this.callFlash("SetPostParams", [this.settings.post_params]);
        };
        SWFUpload.prototype.setFileTypes = function(types, description) {
            this.settings.file_types = types;
            this.settings.file_types_description = description;
            this.callFlash("SetFileTypes", [types, description]);
        };
        SWFUpload.prototype.setFileSizeLimit = function(fileSizeLimit) {
            this.settings.file_size_limit = fileSizeLimit;
            this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
        };
        SWFUpload.prototype.setFileUploadLimit = function(fileUploadLimit) {
            this.settings.file_upload_limit = fileUploadLimit;
            this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
        };
        SWFUpload.prototype.setFileQueueLimit = function(fileQueueLimit) {
            this.settings.file_queue_limit = fileQueueLimit;
            this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
        };
        SWFUpload.prototype.setFilePostName = function(filePostName) {
            this.settings.file_post_name = filePostName;
            this.callFlash("SetFilePostName", [filePostName]);
        };
        SWFUpload.prototype.setUseQueryString = function(useQueryString) {
            this.settings.use_query_string = useQueryString;
            this.callFlash("SetUseQueryString", [useQueryString]);
        };
        SWFUpload.prototype.setRequeueOnError = function(requeueOnError) {
            this.settings.requeue_on_error = requeueOnError;
            this.callFlash("SetRequeueOnError", [requeueOnError]);
        };
        SWFUpload.prototype.setHTTPSuccess = function(http_status_codes) {
            if (typeof http_status_codes === "string") {
                http_status_codes = http_status_codes.replace(" ", "").split(",");
            }
            this.settings.http_success = http_status_codes;
            this.callFlash("SetHTTPSuccess", [http_status_codes]);
        };
        SWFUpload.prototype.setAssumeSuccessTimeout = function(timeout_seconds) {
            this.settings.assume_success_timeout = timeout_seconds;
            this.callFlash("SetAssumeSuccessTimeout", [timeout_seconds]);
        };
        SWFUpload.prototype.setDebugEnabled = function(debugEnabled) {
            this.settings.debug_enabled = debugEnabled;
            this.callFlash("SetDebugEnabled", [debugEnabled]);
        };
        SWFUpload.prototype.setButtonImageURL = function(buttonImageURL) {
            if (buttonImageURL == undefined) {
                buttonImageURL = "";
            }
            this.settings.button_image_url = buttonImageURL;
            this.callFlash("SetButtonImageURL", [buttonImageURL]);
        };
        SWFUpload.prototype.setButtonDimensions = function(width, height) {
            this.settings.button_width = width;
            this.settings.button_height = height;
            var movie = this.getMovieElement();
            if (movie != undefined) {
                movie.style.width = width + "px";
                movie.style.height = height + "px";
            }
            this.callFlash("SetButtonDimensions", [width, height]);
        };
        SWFUpload.prototype.setButtonText = function(html) {
            this.settings.button_text = html;
            this.callFlash("SetButtonText", [html]);
        };
        SWFUpload.prototype.setButtonTextPadding = function(left, top) {
            this.settings.button_text_top_padding = top;
            this.settings.button_text_left_padding = left;
            this.callFlash("SetButtonTextPadding", [left, top]);
        };
        SWFUpload.prototype.setButtonTextStyle = function(css) {
            this.settings.button_text_style = css;
            this.callFlash("SetButtonTextStyle", [css]);
        };
        SWFUpload.prototype.setButtonDisabled = function(isDisabled) {
            this.settings.button_disabled = isDisabled;
            this.callFlash("SetButtonDisabled", [isDisabled]);
        };
        SWFUpload.prototype.setButtonAction = function(buttonAction) {
            this.settings.button_action = buttonAction;
            this.callFlash("SetButtonAction", [buttonAction]);
        };
        SWFUpload.prototype.setButtonCursor = function(cursor) {
            this.settings.button_cursor = cursor;
            this.callFlash("SetButtonCursor", [cursor]);
        };
        SWFUpload.prototype.queueEvent = function(handlerName, argumentArray) {
            if (argumentArray == undefined) {
                argumentArray = [];
            } else if (!(argumentArray instanceof Array)) {
                argumentArray = [argumentArray];
            }
            var self = this;
            if (typeof this.settings[handlerName] === "function") {
                this.eventQueue.push(function() {
                    this.settings[handlerName].apply(this, argumentArray);
                });
                setTimeout(function() {
                    self.executeNextEvent();
                }, 0);
            } else if (this.settings[handlerName] !== null) {
                throw "Event handler " + handlerName + " is unknown or is not a function";
            }
        };
        SWFUpload.prototype.executeNextEvent = function() {
            var f = this.eventQueue ? this.eventQueue.shift(): null;
            if (typeof(f) === "function") {
                f.apply(this);
            }
        };
        SWFUpload.prototype.unescapeFilePostParams = function(file) {
            var reg = /[$]([0-9a-f]{4})/i;
            var unescapedPost = {};
            var uk;
            if (file != undefined) {
                for (var k in file.post) {
                    if (file.post.hasOwnProperty(k)) {
                        uk = k;
                        var match;
                        while ((match = reg.exec(uk)) !== null) {
                            uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
                        }
                        unescapedPost[uk] = file.post[k];
                    }
                }
                file.post = unescapedPost;
            }
            return file;
        };
        SWFUpload.prototype.testExternalInterface = function() {
            try {
                return this.callFlash("TestExternalInterface");
            } catch (ex) {
                return false;
            }
        };
        SWFUpload.prototype.flashReady = function() {
            var movieElement = this.getMovieElement();
            if (!movieElement) {
                this.debug("Flash called back ready but the flash movie can't be found.");
                return;
            }
            this.cleanUp(movieElement);
            this.queueEvent("swfupload_loaded_handler");
        };
        SWFUpload.prototype.cleanUp = function(movieElement) {
            try {
                if (this.movieElement && typeof(movieElement.CallFunction) === "unknown") {
                    this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
                    for (var key in movieElement) {
                        try {
                            if (typeof(movieElement[key]) === "function") {
                                movieElement[key] = null;
                            }
                        } catch (ex) {}
                    }
                }
            } catch (ex1) {}
            window["__flash__removeCallback"] = function(instance, name) {
                try {
                    if (instance) {
                        instance[name] = null;
                    }
                } catch (flashEx) {}
            };
        };
        SWFUpload.prototype.fileDialogStart = function() {
            this.queueEvent("file_dialog_start_handler");
        };
        SWFUpload.prototype.fileQueued = function(file) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("file_queued_handler", file);
        };
        SWFUpload.prototype.fileQueueError = function(file, errorCode, message) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
        };
        SWFUpload.prototype.fileDialogComplete = function(numFilesSelected, numFilesQueued, numFilesInQueue) {
            this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued, numFilesInQueue]);
        };
        SWFUpload.prototype.uploadStart = function(file) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("return_upload_start_handler", file);
        };
        SWFUpload.prototype.returnUploadStart = function(file) {
            var returnValue;
            if (typeof this.settings.upload_start_handler === "function") {
                file = this.unescapeFilePostParams(file);
                returnValue = this.settings.upload_start_handler.call(this, file);
            } else if (this.settings.upload_start_handler != undefined) {
                throw "upload_start_handler must be a function";
            }
            if (returnValue === undefined) {
                returnValue = true;
            }
            returnValue=!!returnValue;
            this.callFlash("ReturnUploadStart", [returnValue]);
        };
        SWFUpload.prototype.uploadProgress = function(file, bytesComplete, bytesTotal) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
        };
        SWFUpload.prototype.uploadError = function(file, errorCode, message) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_error_handler", [file, errorCode, message]);
        };
        SWFUpload.prototype.uploadSuccess = function(file, serverData, responseReceived) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_success_handler", [file, serverData, responseReceived]);
        };
        SWFUpload.prototype.uploadComplete = function(file) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_complete_handler", file);
        };
        SWFUpload.prototype.debug = function(message) {
            this.queueEvent("debug_handler", message);
        };
        SWFUpload.prototype.debugMessage = function(message) {
            if (this.settings.debug) {
                var exceptionMessage, exceptionValues = [];
                if (typeof message === "object" && typeof message.name === "string" && typeof message.message === "string") {
                    for (var key in message) {
                        if (message.hasOwnProperty(key)) {
                            exceptionValues.push(key + ": " + message[key]);
                        }
                    }
                    exceptionMessage = exceptionValues.join("\n") || "";
                    exceptionValues = exceptionMessage.split("\n");
                    exceptionMessage = "EXCEPTION: " + exceptionValues.join("\nEXCEPTION: ");
                    SWFUpload.Console.writeLine(exceptionMessage);
                } else {
                    SWFUpload.Console.writeLine(message);
                }
            }
        };
        SWFUpload.Console = {};
        SWFUpload.Console.writeLine = function(message) {
            var console, documentForm;
            try {
                console = document.getElementById("SWFUpload_Console");
                if (!console) {
                    documentForm = document.createElement("form");
                    document.getElementsByTagName("body")[0].appendChild(documentForm);
                    console = document.createElement("textarea");
                    console.id = "SWFUpload_Console";
                    console.style.fontFamily = "monospace";
                    console.setAttribute("wrap", "off");
                    console.wrap = "off";
                    console.style.overflow = "auto";
                    console.style.width = "700px";
                    console.style.height = "350px";
                    console.style.margin = "5px";
                    documentForm.appendChild(console);
                }
                console.value += message + "\n";
                console.scrollTop = console.scrollHeight - console.clientHeight;
            } catch (ex) {
                alert("Exception: " + ex.name + " Message: " + ex.message);
            }
        };
        window.SWFUpload = SWFUpload;
        return new window.SWFUpload(option);
    };
    function $time33(str) {
        for (var i = 0, len = str.length, hash = 5381; i < len; ++i) {
            hash += (hash<<5) + str.charAt(i).charCodeAt();
        };
        return hash & 0x7fffffff;
    };
    var $txTpl = (function() {
        var cache = {};
        return function(str, data, startSelector, endSelector, isCache) {
            var fn, d = data, valueArr = [], isCache = isCache != undefined ? isCache: true;
            if (isCache && cache[str]) {
                for (var i = 0, list = cache[str].propList, len = list.length; i < len; i++) {
                    valueArr.push(d[list[i]]);
                }
                fn = cache[str].parsefn;
            } else {
                var propArr = [], formatTpl = (function(str, startSelector, endSelector) {
                    if (!startSelector) {
                        var startSelector = '<%';
                    }
                    if (!endSelector) {
                        var endSelector = '%>';
                    }
                    var tpl = str.indexOf(startSelector)==-1 ? document.getElementById(str).innerHTML: str;
                    return tpl.replace(/\\/g, "\\\\").replace(/[\r\t\n]/g, " ").split(startSelector).join("\t").replace(new RegExp("((^|" + endSelector + ")[^\t]*)'", "g"), "$1\r").replace(new RegExp("\t=(.*?)" + endSelector, "g"), "';\n s+=$1;\n s+='").split("\t").join("';\n").split(endSelector).join("\n s+='").split("\r").join("\\'");
                })(str, startSelector, endSelector);
                for (var p in d) {
                    propArr.push(p);
                    valueArr.push(d[p]);
                }
                fn = new Function(propArr, " var s='';\n s+='" + formatTpl + "';\n return s");
                isCache && (cache[str] = {
                    parsefn: fn,
                    propList: propArr
                });
            }
            try {
                return fn.apply(null, valueArr);
            } catch (e) {
                function globalEval(strScript) {
                    var ua = navigator.userAgent.toLowerCase(), head = document.getElementsByTagName("head")[0], script = document.createElement("script");
                    if (ua.indexOf('gecko')>-1 && ua.indexOf('khtml')==-1) {
                        window['eval'].call(window, fnStr);
                        return
                    }
                    script.innerHTML = strScript;
                    head.appendChild(script);
                    head.removeChild(script);
                }
                var fnName = 'txTpl' + new Date().getTime(), fnStr = 'var ' + fnName + '=' + fn.toString();
                globalEval(fnStr);
                window[fnName].apply(null, valueArr);
            }
        }
    })();
    function $xss(str, type) {
        if (!str) {
            return str === 0 ? "0" : "";
        }
        switch (type) {
        case"none":
            return str + "";
            break;
        case"html":
            return str.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function(r) {
                return "&#" + r.charCodeAt(0) + ";"
            }).replace(/ /g, "&nbsp;").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
            break;
        case"htmlEp":
            return str.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g, function(r) {
                return "&#" + r.charCodeAt(0) + ";"
            });
            break;
        case"url":
            return escape(str).replace(/\+/g, "%2B");
            break;
        case"miniUrl":
            return str.replace(/%/g, "%25");
            break;
        case"script":
            return str.replace(/[\\"']/g, function(r) {
                return "\\" + r;
            }).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
            break;
        case"reg":
            return str.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g, function(a) {
                return "\\" + a;
            });
            break;
        default:
            return escape(str).replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function(r) {
                return "&#" + r.charCodeAt(0) + ";"
            }).replace(/ /g, "&nbsp;").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
            break;
        }
    };
    var Stock = {
        init: function(option) {
            var opt = {
                metaId: 0,
                stockSwitch: "0",
                stockList: null,
                saleAttrStr: "",
                stockPicStr: ""
            }
            $extend(opt, option);
            if (opt.stockList && opt.stockList.length) {
                for (var i = 0; i < opt.stockList.length; i++) {
                    var stock = opt.stockList[i];
                    stock.price = (stock.price * 0.01) + "";
                    stock.num = (stock.num * 1) + "";
                }
            }
            if (opt.saleAttrStr) {
                opt.saleAttrStr = opt.saleAttrStr.replace("version=1,", "").replace("^", "");
            }
            if (opt.stockPicStr) {
                opt.stockPicStr = opt.stockPicStr.replace(/\|(?!http)/g, "|http://img2.paipaiimg.com/");
            }
            var stockSwitcher = $id("ckbStockSwitch");
            var stockArea = $id("divStockArea");
            if (!stockSwitcher ||!stockArea) {
                alert("dom节点ckbStockSwitch或divStockArea不存在，无法初始化！");
                return false;
            }
            var that = this;
            function displayStockManager(isStockMode) {
                if (!isStockMode) {
                    if (that.stockManager) {
                        if (that.stockManager.getSaleAttrStr()) {
                            opt.saleAttrStr = that.stockManager.getSaleAttrStr();
                        }
                        opt.stockList = that.stockManager.getStockList();
                    }
                    that.stockManager = $stockManageNew({
                        dom: stockArea,
                        metaId: opt.metaId,
                        stockList: null,
                        isAttrMode: true,
                        saleAttrStr: opt.saleAttrStr,
                        onChange: function() {
                            return;
                        }
                    });
                } else {
                    that.stockManager = $stockManageNew({
                        dom: stockArea,
                        metaId: opt.metaId,
                        stockList: opt.stockList,
                        stockImgStr: opt.stockPicStr,
                        saleAttrStr: opt.saleAttrStr,
                        onChange: function() {
                            return;
                        }
                    });
                }
            }
            stockSwitcher.onclick = function() {
                displayStockManager(this.checked);
            };
            stockArea.innerHTML = $xss('<p align="center"><img src="http://static.paipaiimg.com/assets/common/loading2.gif" /><br />数据加载中……</p>', "none");
            stockSwitcher.checked = (opt.stockSwitch == "1");
            displayStockManager((opt.stockSwitch == "1"));
            $id("initRetVal").value = "0";
        },
        check: function() {
            if (this.stockManager) {
                var ret = this.stockManager.check();
                $id("saleAttrRetVal").value = this.stockManager.getSaleAttrStr();
                if ($id("ckbStockSwitch").checked) {
                    $id("stockSwitchRetVal").value = "1";
                    $id("stockPicRetVal").value = this.stockManager.getStockPicStr();
                    $id("priceRetVal").value = this.stockManager.getMaxPrice();
                    $id("totalRetVal").value = this.stockManager.getTotalNum();
                    var stockList = this.stockManager.getStockList() || [];
                    for (var i = 0; i < stockList.length; i++) {
                        stockList[i].price = parseInt(stockList[i].price * 100, 10) + "";
                    }
                    eval("var tmpStr='" + JSON.stringify(stockList) + "';");
                    $id("stockRetVal").value = tmpStr;
                } else {
                    $id("stockSwitchRetVal").value = "0";
                    $id("stockPicRetVal").value = "";
                    $id("priceRetVal").value = "";
                    $id("totalRetVal").value = "";
                    $id("stockRetVal").value = "";
                }
                if (ret.err) {
                    $id("checkRetVal").value = (ret.err == 2 ? "2" : "1");
                    $id("checkErrMsgVal").value = ret.errMsg;
                    return false;
                } else {
                    $id("checkRetVal").value = "0";
                    $id("checkErrMsgVal").value = "";
                    return true;
                }
            } else {
                $id("checkRetVal").value = "1";
                return false;
            }
        }
    };
    window['PP.c2cPub.stockManage'] = '21569:20130917:20130917152738';
    window['PP.c2cPub.stockManage.time'] && window['PP.c2cPub.stockManage.time'].push(new Date()); /*  |xGv00|e5a12e8e978d161266bee72c78109d00 */
