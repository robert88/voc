/*自适应处理*/
;
(function () {

    var maxHeight = 889;
    var minHeight = 500;

    /*
     * 等比
     *
     * */
    function getResize(max, min, cur, maxCur, minCur) {
        return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
    }

    /*
     * 获取范围
     *
     * */
    function getRagen(val, max, min) {
        return (val <= min) ? min : ((val <= max) ? val : max);
    }


    /*
     * 填充形参
     *
     * */
    String.prototype.tpl = function () {
        var arg = arguments;
        var that = this;
        for (var i = 0; i < arg.length; i++) {
            that = that.replace(new RegExp('\\{' + i + '\\}', "g"), arg[i]);
        }
        return that;
    };

    /*
     * 转换为float
     *
     * */
    String.prototype.toFloat = function(a){return parseFloat(this,10)||a||0}

    /*
     * 设置rem的根大小
     *
     * */
    var preh;

    function changeRootrem() {
        var h = getRagen($(window).height(), maxHeight, minHeight);
        var remroot = getResize(maxHeight, minHeight, h, 100, 75)
        if (preh == h) {
            return remroot;
        }
        preh = h;
        /*12/16=0.75,20/16=1.25*/
        $("html").css("font-size", remroot + "%");
        return remroot;
    }


    /**
     * 自适应
     *
     * */
    function resizeLayout() {

        var h = getRagen($(window).height(), maxHeight, minHeight);
        var map = {
            'O': '-o-',
            'Moz': '-moz-',
            'Webkit': '-webkit-',
            'Ms': '-ms-',
        }
        var x = getResize(maxHeight, minHeight, h, 17, 2);
        var y = getResize(maxHeight, minHeight, h, 13, 0);
        var s = getResize(maxHeight, minHeight, h, 1, 0.6);
        $(".pageAniGroup").css((map[CSS3FLAG] || "") + "transform", "translate(" + x + "%," + y + "%) scale(" + s + ")");

    }
    /**
     *
     * 监听resize事件
     *
     * */
    $(window).resize(function () {
        resizeLayout();
        changeRootrem()
    })

    /**
     *
     * 提前设置根大小
     *
     * */
    changeRootrem();

    /**
     *
     *
     * page动画处理
     *
     *
     * */

    $(function () {
        /**
         *
         *
         * 启动自适应
         *
         *
         * */
        resizeLayout();


        /**
         *
         * 累加效果
         *
         * */
        var animateId = 0;
        function animateCountUp($target) {
            var options = {
                useEasing: true, // toggle easing
                useGrouping: true, // 1,000,000 vs 1000000
                separator: ',', // character to use as a separator*
                decimal: '.' // character to use as a decimal
            };
            var vals = [];
            $target.each(function () {
                if (!$(this).attr("id")) {
                    $(this).attr("id", "countupid" + animateId);
                    animateId++
                }
                vals.push({
                    id: $(this).attr("id"),
                    count: $(this).data("num") * 1
                })
            })
            var len = vals.length;
            while (len--) {
                var ret = vals[len];
                new countUp(ret.id, 0, (ret.count || 0), 0, 2, options).start();
            }
        }

        /**
         *
         * 每个页面启动动画事件
         *
         * */


        function clearPage() {

            $(".animate-show").off(css3AnimateEndEvent).removeClass("animate-show");
            $(".animate-rotate").removeClass("animate-rotate")
            $(".animate-shake").removeClass("animate-shake")
            $(".animate-rotate-rev").removeClass("animate-rotate-rev")
            $(".animate-move").removeClass("animate-move")
            $(".animate-move-v-2").removeClass("animate-move-v-2")
            $(".animate-move-h").removeClass("animate-move-h")
            $(".animate-opacity").removeClass("animate-move-h")

            $(".page").data("lock", true).data("lockAutoNext",false).removeClass("current");
            clearTimeout( $(".page").data("timer2"));
            clearTimeout( $(".page").data("timer"));
            var canvas =  $(".page").find("canvas").each(function () {
                this.width = this.width;
                var canvasAnimate = $(this).parents(".page").data("animate");
                if(canvasAnimate){
                    canvasAnimate.lock = true;
                    cancelAnimationFrame(canvasAnimate.timer);
                }
            });
        }

        function goNextPage($curpage, $nextpage, time, callback) {
            var $children = $curpage.parent().children();

            //最后一页，或者只有一页的情况处理
            if (!$nextpage || $nextpage.length == 0) {
                if ($children.length == 1) {
                    return;
                }
                $nextpage = $children.eq(0);
            }

            clearPage($curpage);

            if ($nextpage.data("ready")) {
                goNext();
            } else {
                loadoneimg($nextpage, $nextpage.data("bg"), goNext)
            }
            function goNext() {
                $curpage.removeClass("current")
                $nextpage.addClass("current");
                $(window).trigger("resize");
                initpage();
            }
        }

        /*切换到下一页*/
        function waitGoNextPage($curpage, $nextpage, time, callback) {
            clearTimeout($curpage.data("timer2"));
            $curpage.data("timer2", setTimeout(function () {
                if($(".page").data("lockAutoNext")){
                    return;
                }
                if (vSwiper.activeIndex == 4) {
                    vSwiper._slideTo(0)
                } else {
                    vSwiper._slideNext();
                }
            }, time))
        }

        /*初始化页面*/
        function initpage(initBg) {
            var $curpage = $(".page.current").length==0? $(".page").eq(0):$(".page.current");
            var index = $curpage.index();
            // if(index==0){
            //     $(".arrow-left").css("cursor","not-allowed")
            // }else{
            //     $(".arrow-left").css("cursor","pointer")
            // }
            // if(index==($(".page").length-1)){
            //     $(".arrow-right").css("cursor","not-allowed")
            // }else{
            //     $(".arrow-right").css("cursor","pointer")
            // }

            animateCountUp($curpage.find(".animateCountUp"))
                $(".animate-rotate-one").removeClass("animate-rotate-one")
            addCSS3Animate($curpage.find(".quan").addClass("animate-rotate-one"))
            if (!$curpage.data("ready")) {
                loadpage($curpage, initBg);
            } else {
                $curpage.trigger("ready");
            }
        }

        /*下载一个图片回调*/
        function loadoneimg($target, src, callback) {
            var img = new Image;
            img.onload = function () {
                $target.css("background-image", "url(" + src + ")")
                if (typeof  callback == "function") {
                    callback();
                }
            }
            img.onerror = function () {
                if (typeof  callback == "function") {
                    callback();
                }
            }
            img.src = src;
        }

        /*下载多个图片回调*/
        function loadimg($page, $target, src, deepObj, len, initBg) {
            var img = new Image;
            img.onload = function () {
                $target.css("background-image", "url(" + src + ")")
                checkloadComplete($page, deepObj, len, initBg);
            }
            img.onerror = function () {
                checkloadComplete($page, deepObj, len, initBg);
            }
            img.src = src;
        }

        /*校验触发ready事件*/
        function checkloadComplete($page, deepObj, len, initBg) {
            deepObj.count++;
            if (deepObj.count == len) {
                if (typeof initBg == "function") {
                    initBg();
                }

                $page.trigger("ready").data("ready", true);
            }
        }

        /*加载图*/
        function loadpage($curpage, initBg) {
            var imgArr = [];
            $curpage.find("[data-img]").each(function () {
                imgArr.push({
                    $target: $(this),
                    src: $(this).data("img")
                })
            });
            imgArr.splice(0, 0, {
                $target: $curpage,
                src: $curpage.data("bg")
            });
            var len = imgArr.length;
            var deepObj = {count: 0}
            for (var i = 0; i < len; i++) {
                loadimg($curpage, imgArr[i].$target, imgArr[i].src, deepObj, len, initBg);
            }
        }
        /*加载完第一页之后，加载其他页的底图*/
        function initAllbg() {
            $(".page").each(function (idx) {
                var src = $(this).data("bg")
                if (idx > 0) {
                    $(this).css("background-image", "url(" + src + ")")
                }
            })
        }

        var perSildeIndex;
        var carsouselTimer
        /*轮播效果*/
       $(".swiper-container").carousel({
            prev: ".arrow-right",
            next: ".arrow-left",
            item: ".swiper-slide",
            itemWrap: ".swiper-wrapper",
            time: 200,
            fixArrow:false,
            loop: true,
            autoPlay: true,
            autoPlayTime: 7000,
            dir: "left",
            changeCallBack: function (activeIndex) {
                clearTimeout(carsouselTimer);
                carsouselTimer = setTimeout(function () {
                    perSildeIndex = perSildeIndex||$(".page.current").index()||0;
                    $(".page").data("lockAutoNext",true)
                    goNextPage($(".page").eq(perSildeIndex), $(".page").eq(activeIndex));
                    perSildeIndex = activeIndex;
                },200);
            }
        });
       var vSwiper = $(".swiper-container").data("carousel")
        $(".stopAutoPlay").hover(function(){
            vSwiper.autoPlay = false
            vSwiper.stop();
        },function(){
            vSwiper.autoPlay = true
            vSwiper.start();
        })
        initpage(initAllbg);

    })
})();
