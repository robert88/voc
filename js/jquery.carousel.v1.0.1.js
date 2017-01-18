;(function () {

    var settings = {
        prev: ".cs-prev",
        next: ".cs-next",
        item: ">li",
        itemWrap: ">ul",
        itemType: "LI",
        wrap: null,
        itemNum: 1,

        paddingTop: 0,
        paddingLeft: 0,
        curIndex: 0,
        paginationText:false,
        items_per_page:10,
        num_display_entries:2,

        autoPlay: true,
        loop: true,
        nextLoop:false,//直接下一个页面，没有首尾之分
        time: "swing",
        lazyLoad: true,
        switchType: "slide",
        autoPlayTime: 5000,

        dir: "left",
        fixArrow:true,
        changeCallBack: null
    };


    function getPrev(idx, len, loop) {
        if (idx == 0) {
            if (loop) {
                return len - 1
            } else {
                return idx
            }
        } else {
            return idx - 1
        }
    }

    function getNext(idx, len, loop) {
        if (idx >= len - 1) {
            if (loop) {
                return 0
            } else {
                return idx
            }
        } else {
            return idx + 1
        }
    }

    function checkAbsolute(str) {
        return /absolute|relative/i.test(str);

    }

    function Carousel(option) {

        $.extend(this, option);


        this.fixPosition();

        this.updatePageFooter();

        if (this.autoPlay) {
            this.start();
        }
    };

    Carousel.prototype.fixPosition=function(){

        this.itemHeight = this.height;

        this.itemWidth = this.width;

        if (this.switchType == "slide") {
            this.fixSlideSize();
        }

        this.total = Math.ceil(this.$item.length / this.itemNum);//子项组总数

        this.fixItemWrap();
        this.fixItem();
        if (this.switchType == "slide") {
            this.fixSlideItem();
        }
        if(this.fixArrow){
            this.fixNext();
            this.fixPrev();
        }


        this.fixWrap();
    }

    /*分页器*/
    Carousel.prototype.setPageFooter = function (m, d, z, a, k, n) {
        function w(c) {
            return Math.floor(c) || 0
        }

        function y(c) {
            return Math.ceil(c) || 0
        }

        function q(c, f) {
            f = parseInt(f, 10) || 0;
            return parseInt(c, 10) || f
        }

        for (var t = 1; t < arguments.length; t++) {
            if (t != 3) {
                arguments[t] = q(arguments[t], 1)
            }
        }
        if (d < 2) {
            return m.html("")
        }
        if (z > d) {
            z = d
        }
        var h = k || 2;
        var b = n || 10;
        var v = w(b / 2);
        (h > v) && (h = v);
        var l = h + 1;
        var g = b - h * 2;
        var u = [];
        if (d <= b) {
            b = d;
            for (var t = 0; t < b; t++) {
                u.push(t + 1)
            }
        } else {
            if (z > v) {
                u[h] = "...";
                g--;
                l = z - w(g / 2)
            }
            if ((d - z) > v) {
                u[b - h - 1] = "..."
            } else {
                l = d - g - h + 1
            }
            if (l < h + 1) {
                l = h + 1
            }
            for (var t = 0, s = 0; t < b; t++) {
                if (!u[t]) {
                    if (t < h) {
                        u[t] = t + 1
                    } else {
                        if (t < b - h) {
                            u[t] = l + s;
                            s++
                        } else {
                            u[t] = d + 1 + t - b
                        }
                    }
                }
            }
        }
        var o = z - 1;
        var r = z + 1;
        o = o > 0 ? o : 1;
        r = r < d ? r : d;
        var x = ["<span>&nbsp;</span>"];
        if (z == 1) {
            x.push('<a href="' + o + '" class="pageMove tMuted" style="cursor:not-allow">&lt;</a>')
        } else {
            x.push('<a href="' + o + '" class="pageMove">&lt;</a>')
        }
        for (var t = 0; t < u.length; t++) {
            if (u[t] == "...") {
                x.push("<span >" + u[t] + "</span>")
            } else {
                if (u[t] == z) {
                    if(this.paginationText){
                        x.push('<a class="active" href="' + u[t] + '">' + u[t] + "</a>")
                    }else{
                        x.push('<a class="active" href="' + u[t] + '">' + "</a>")
                    }
                } else {
                    if(this.paginationText){
                        x.push('<a href="' + u[t] + '">' + u[t] + "</a>")
                    }else{
                        x.push('<a href="' + u[t] + '">' +  "</a>")
                    }
                }
            }
        }
        if (z == d) {
            x.push('<a href="' + r + '" class="pageMove tMuted" style="cursor:not-allow">&gt;</a>')
        } else {
            x.push('<a href="' + r + '" class="pageMove">&gt;</a>')
        }
        x.push("<span>&nbsp;</span>");
        m.html(x.join(""));
        m.off("click", "a").on("click", "a", function (f) {
            var c = $(this);
            if (c.hasClass("active") || c.hasClass("tMuted")) {
                return false
            }
            // c.html('<img style="width:100%;vertical-align:middle;" src="/public/img/loader.gif" />');
            if (typeof a == "function") {
                a(c.attr("href"))
            }
            return false
        })
    };
    Carousel.prototype.updatePageFooter = function () {
        var that = this;
        this.setPageFooter(this.$pageFooter, this.total, this.curIndex+1 ,function(idx){
            that.nextIndex = idx-1;
            that.play();
        },this.num_display_entries, this.items_per_page);

    };

    Carousel.prototype.fixSlideSize = function () {

        if (/up|down/.test(this.dir)) {
            this.fixVerticalSlideSize();
        } else {
            this.fixHorizontalSlideSize();
        }

    };


    Carousel.prototype.fixVerticalSlideSize = function () {
        this.sildeSize(this.itemNum, 1);

    };


    Carousel.prototype.fixHorizontalSlideSize = function () {
        this.sildeSize(1, this.itemNum);
    };


    Carousel.prototype.sildeSize = function (VerticalNum, HorizontalNum) {
        this.itemHeight = ( this.height - this.paddingTop ) / VerticalNum - this.paddingTop;

        if (this.itemHeight < 0) {
            this.itemHeight = this.height / this.itemNum;
            this.paddingTop = 0;
        }

        this.itemWidth = ( this.width - this.paddingLeft ) / HorizontalNum - this.paddingLeft;

        if (this.itemWidth < 0) {
            this.itemWidth = this.width / this.itemNum;
            this.paddingLeft = 0;
        }
    };

    Carousel.prototype.fixWrap = function () {
        var $this = this.$wrap;
        if ($this.length == 0) {
            console.error("no $wrap");
            return;
        }
        if (checkAbsolute($this.css("position")) == false) {
            $this.css("position", "relative");
        }
        if(this.adjustWrapHeight){
            $this.css({
                height: this.height
            });
        }

    };

    Carousel.prototype.fixSlideItem = function () {

        if (this.dir == "left") {

            this.fixLeftSlideItem();

        } else if (this.dir == "right") {

            this.fixRightSlideItem();

        } else if (this.dir == "up") {

            this.fixUpSlideItem();

        } else if (this.dir == "down") {

            this.fixDownSlideItem();

        }
    };

    Carousel.prototype.fixLeftSlideItem = function () {

        var $this = this.$item;
        var curOffset = this.curIndex * (this.paddingLeft + this.itemWidth);

        for (var i = 0; i < $this.length; i += this.itemNum) {
            for (var j = 0; j < this.itemNum; j++) {
                var left = ( this.paddingLeft + this.itemWidth ) * j + this.paddingLeft + this.width * i-curOffset;
                $this.eq(i + j).stop(true,true).data("animateTargetLeft",left).css({left:left })
            }
        }

        $this.css({top: this.paddingTop})
    };

    Carousel.prototype.fixRightSlideItem = function () {

    };
    Carousel.prototype.fixUpSlideItem = function () {

    };
    Carousel.prototype.fixDownSlideItem = function () {

    };

    Carousel.prototype.fixItemWrap = function () {
        var $this = this.$itemWrap;
        if ($this.length == 0) {
            console.error("no $contain");
            return;
        }
        if (checkAbsolute($this.css("position")) == false) {
            $this.css("position", "relative");
        }
        $this.css({
            height: this.height,
            width: this.width
        });

        if(this.switchType == "slide"){
            $this.css({overflow:"hidden"})
        }
    }

    Carousel.prototype.fixItem = function () {
        var $this = this.$item;
        if ($this.length == 0) {
            console.error("fixItem no $item");
            return;
        }

        $this.css({
            position: "absolute",
            height: this.itemHeight,
            width: this.itemWidth
        });
    }


    Carousel.prototype.fixPrev = function () {

        var $prev = this.$prev;

        if ($prev.length == 0) {
            console.error("no $prev");
            return;
        }
        //上翻
        $prev.css({
            position: "absolute",
            left: "0px",
            top: (this.height - $prev.height()) / 2,
            cursor: "pointer"
        });

    };

    Carousel.prototype.fixNext = function () {

        var $next = this.$next;

        if ($next.length == 0) {

            console.error("no $next");

            return;

        }

        //下翻
        $next.css({

            position: "absolute",

            right: "0px",

            top: (this.height - $next.height()) / 2,

            cursor: "pointer"

        });
    };

    Carousel.prototype.updateLimitStyle = function (nextStyle, prevStle) {

        this.$next.css("cursor", nextStyle);

        this.$prev.css("cursor", prevStle);

    }

    Carousel.prototype.handleLazy = function (idx) {

        var itemNum = this.itemNum;

        this.$item.each(function (curIdx) {

            if (curIdx >= idx * itemNum && curIdx <= idx * (itemNum + 1)) {

                var $img = $(this).find("img[data-src]");
                if($img.length==0){
                    return
                }
                var src = $img.attr("src") || "";

                if (!src.trim()) {

                    var newSrc = $img.data("src");

                    if (newSrc) {

                        $img.attr("src", newSrc).removeAttr("data-src");

                    } else {

                        console.error("cant find img");

                    }
                }
            }
        })
    }

    Carousel.prototype.setPosition=function(idx,flag){
        for (var j = 0; j < this.itemNum; j++) {
            var left = ( this.paddingLeft + this.itemWidth ) * j + this.paddingLeft + this.width *flag;
            this.$item.eq(idx + j).stop(true,true).css({left: left}).data("animateTargetLeft",left)
        }
    }

    Carousel.prototype.in = function (idx) {

        var total = this.total;

        var loop = this.loop;

        if (( idx < 0 ) || ( idx > ( total - 1 ) ) || this.lock) {

            console.log("参数不对或者change已锁。");

            return;

        }

        //不循环
        if (!loop) {
            if (total == 1) {

                this.updateLimitStyle("not-allowed", "not-allowed")

            } else if (idx == total - 1) {

                this.updateLimitStyle("pointer", "not-allowed");

            } else if (idx == 0) {

                this.updateLimitStyle("not-allowed","pointer");

            } else {

                this.updateLimitStyle("pointer", "pointer");

            }
        }


        // this.lock = true;

        if( this.switchType == "slide" ){

            if(this.dir == "left"){

                var animateLeft
                var that = this;
                var nextLeft,curLeft;
               if(this.nextLoop){
                   this.fixLeftSlideItem()
                   if(this.nextIndex==0&&(this.curIndex==this.total-1)){
                       this.setPosition(this.nextIndex,1);
                   }else if(this.curIndex==0&&(this.nextIndex==this.total-1)){
                       this.setPosition(this.nextIndex,-1);
                   }else{
                        nextLeft = this.$item.eq(this.nextIndex).data("animateTargetLeft");
                        curLeft = this.$item.eq(this.curIndex).data("animateTargetLeft");
                   }
               }
                if(typeof nextLeft == "undefined"){
                    nextLeft = this.$item.eq(this.nextIndex).css("left").toFloat()
                }
                if(typeof curLeft == "undefined"){
                    curLeft = this.$item.eq(this.curIndex).css("left").toFloat()
                }
                 animateLeft= nextLeft-curLeft  ;
                this.$item.not(this.$item.eq(this.curIndex)).each(function(){
                    var $this = $(this);
                    startAniamteBySilde($this,animateLeft,that)
                });
                //去掉间隙
                startAniamteBySilde(this.$item.eq(this.curIndex),animateLeft,that,function () {
                    if(typeof that.changeCallBack == "function"){
                        that.changeCallBack(that.curIndex);
                    }
                })




            }

        }

        if (this.lazyLoad) {

            this.handleLazy(idx);

        }

    };

    function startAniamteBySilde($this,animateLeft,that,callback) {
        var left =$this.data("animateTargetLeft")
        if(typeof left == "undefined"){
            left = $this.css("left").toFloat();
        }
        $this.stop(true,true).css({left:(left)+"px"}).animate({ left: (left- animateLeft)+"px" }, that.time,callback).data("animateTargetLeft",(left- animateLeft) );
    }

    Carousel.prototype.out = function (idx) {

        if( this.switchType == "slide" ){

            if(this.dir == "left"){
                this.$item.eq( idx ).animate({left: (this.left - this.width)+"px"}, this.time, this.callBack);
            }

        }

    };


    Carousel.prototype.stop = function () {

        clearTimeout(this.timer);

    };

    Carousel.prototype.play = function ( ) {

        this.stop();

        if( this.switchType == "slide" ){

            this.in( this.nextIndex );

        }else{
            this.in( this.nextIndex );

            this.out( this.curIndex );

        }


        this.curIndex = this.nextIndex;

        this.nextIndex = getNext( this.curIndex, this.total, this.loop );

        var that = this;

        this.updatePageFooter();

        if(this.autoPlay){
            this.timer = setTimeout(function () {

                that.play();

            }, this.autoPlayTime);
        }


    }


    Carousel.prototype.start = function () {

        this.stop();

        var that = this;

        this.timer = setTimeout(function () {

            that.nextIndex = getNext(that.curIndex, that.total, that.loop);

            that.play();

        }, this.autoPlayTime);

    };

    Carousel.prototype.goPrev = function () {

        if(this.dir=="left"){
            this.nextIndex = getNext(this.curIndex, this.total, this.loop);
        }else{
            this.nextIndex = getPrev(this.curIndex, this.total, this.loop);
        }


        this.play();

    };

    Carousel.prototype.goNext = function () {
        if(this.dir=="left"){
            this.nextIndex = getPrev(this.curIndex, this.total, this.loop);
        }else{
            this.nextIndex = getNext(this.curIndex, this.total, this.loop);
        }
        this.play();

    };


    function template(data, callBack, itemTempl) {

        var html = [];

        for (var i = 0; i < data.length; i++) {

            var temp = data[i];

            if ($.type(callBack) == "function") {

                html.push(itemTempl.templ(callBack(temp, i)));

            }
        }

        return html.join("");

    }

    if ($.fn.carousel) {

        console.error("name space conflig of $.fn.causousel!");

    }

    $.fn.extend({
        carousel: function (param) {

            return this.each(function () {

                var opts = $.extend(true, {}, settings, param);

                var $this = $(this);

                if (opts.wrap) {
                    opts.$wrap = $(opts.wrap);
                } else {
                    opts.$wrap = $this;
                }
                /*如果wrap为ul表示不符合caousel结构*/
                if (/^UL|OL|DL$/.test(opts.$wrap[0].nodeName)) {
                    opts.$wrap = $("<div class='cs-wrap'></div>");
                    $this.wrap(opts.$wrap);
                }

                /*动态添加子项*/
                if (opts.data && opts.template) {

                    var templ;

                    if (opts.itemType == "LI") {

                        opts.$itemWrap = $("<ul class='cs-itemWrap'></ul>");
                        templ = template(opts.data, opts.template, "<li class='cs-item'>{0}</li>");
                        opts.$wrap.append(opts.$itemWrap.append(templ));
                        opts.$item = opts.$itemWrap.find(">li");
                        opts.item = ">li";

                    } else {
                        opts.itemType = "DIV";
                        opts.$itemWrap = $("<div  class='cs-itemWrap'></div>");
                        templ = template(opts.data, opts.template, "<div  class='cs-item'>{0}</div>");
                        opts.$wrap.append(opts.$itemWrap.append(templ));
                        opts.$item = opts.$itemWrap.find(">div");
                        opts.item = ">div";

                    }

                }

                if (!opts.$itemWrap || opts.$itemWrap.length == 0) {
                    opts.$itemWrap = opts.$wrap.find(opts.itemWrap);
                }

                if (!opts.$item || opts.$item.length == 0) {
                    opts.$item = opts.$itemWrap.find(opts.item);
                    if (opts.$item.length == 0) {
                        opts.$itemWrap.children();
                    }
                }

                opts.$prev = $this.find(opts.prev);//上翻

                if (opts.$prev.length == 0) {
                    opts.$prev = $("<div class='cs-prev'> < </div>");
                    opts.prev = ".cs-prev";
                    opts.$wrap.append(opts.$prev);

                }

                opts.$next = $this.find(opts.next);//上翻

                if (opts.$next.length == 0) {
                    opts.$next = $("<div class='cs-next'> > </div>");
                    opts.next = ".cs-next";
                    opts.$wrap.append(opts.$next);
                }

                if(opts.width||$this.width()==0){
                    opts.adjustWrapWidth = true;
                }
                if(opts.height||$this.height()==0){
                    opts.adjustWrapHeight = true;
                }
                opts.width = opts.width || $this.width() || 960;//外容器宽

                opts.height = opts.height || $this.height() || 300;//外容器高

                opts.$pageFooter = opts.$wrap.find(".tPageFooter");
                if(opts.$pageFooter.length ==0){
                    opts.$pageFooter =$("<div class='tPageFooter'></div>");
                    opts.$wrap.append( opts.$pageFooter  );
                }

                var carousel = new Carousel(opts);

                opts.$wrap.delegate(opts.prev, "click", function () {

                    carousel.goPrev();

                    return false;

                });

                opts.$wrap.delegate(opts.next, "click", function (e) {

                    carousel.goNext();

                    return false;

                });
                var perWrapContainWidth,perWrapContainHeight;
                $(window).on("resize",function () {
                    var wrapContainWidth = opts.$wrap.width();
                    var wrapContainHeight = opts.$wrap.height();
                    if(wrapContainWidth!=perWrapContainWidth || wrapContainHeight!=perWrapContainHeight){
                        carousel.width = wrapContainWidth;
                        carousel.height =  wrapContainHeight;
                        carousel.stop();
                        carousel.fixPosition();
                        if (carousel.autoPlay) {
                            carousel.start();
                        }
                        perWrapContainWidth = wrapContainWidth;
                        perWrapContainHeight = wrapContainHeight;
                    }

                })
                $this.data("carousel",carousel);
            })
        }
    })

})();
