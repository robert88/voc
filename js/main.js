/*自适应处理*/
;
(function () {

    var maxHeight = 889;
    var minHeight = 500;

    //等比
    function getResize(max, min, cur, maxCur, minCur) {
        return (cur - min) * (maxCur - minCur) / (max - min) + minCur;
    }

    //获取范围
    function getRagen(val, max, min) {
        return (val <= min) ? min : ((val <= max) ? val : max);
    }

    function getMedia(minh, maxh) {
        var str = [
            '',
            '.height1-6{',
            'height:{0}rem;',
            '}',
            '.height1-6.mid{',
            'line-height:{0}rem;',
            "}",
            '.height1-12{',
            'height: {1}rem;',
            '}',
            '.height1-12.mid{',
            'line-height:{1}rem;',
            "}",
            '.height1-3{',
            'height: {2}rem;',
            '}',
            '.height1-3.mid{',
            'line-height:{2}rem;',
            "}",
            '.height1-4{',
            'height: {3}rem;',
            '}',
            '.height1-4.mid{',
            'line-height:{3}rem;',
            "}",
            '.height1-8{',
            'height: {4}rem;',
            '}',
            '.height1-8.mid{',
            'line-height:{4}rem;',
            "}",
            "}"
        ]
        if (minh && !maxh) {
            str[0] = '@media screen and (max-height: {0}px){'.tpl(minh);
        } else if (minh && maxh) {
            str[0] = '@media screen and (min-height: {0}px) and (max-height: {1}px) {'.tpl(minh, maxh);
        } else {
            str[0] = '@media screen and (min-height: {0}px)  {'.tpl(maxh);
        }
        var curh = (maxh || minh);
        var remroot = getResize(800, 350, curh, 125, 75);
        var setH = curh / (remroot / 100 * 16);

        return str.join("").tpl(setH / 6, setH / 12, setH / 3, setH / 4, setH / 8);

    }


    function initStyle() {
        var styleStr = [
            getMedia(350, null)
        ]

        for (var i = 350; i < 800; i += 50) {
            styleStr.push(getMedia(i, i + 50))
        }
        styleStr.push(getMedia(null, 800))
        $("head").append("<style>{0}</style>".tpl(styleStr.join("")));
    }


    var preh;

    function changeRootrem() {
        var h = getRagen($(window).height(), 1080, 500);
        var remroot = getResize(800, 500, h, 125, 75)
        if (preh == h) {
            return remroot;
        }
        preh = h;
        /*12/16=0.75,20/16=1.25*/
        $("html").css("font-size", remroot + "%");
        return remroot;
    }


    /*left自适应*/
    function resizeLeft($targe, h) {
        var paddingTop = getResize(maxHeight, minHeight, h, 120, 0);
        $targe.css("padding-top", paddingTop + "px");
    }

    /*header自适应*/
    function resizeHeader($targe, h) {
        var headerHeight = getResize(maxHeight, minHeight, h, 100, 70);
        var lineHeight = getResize(maxHeight, minHeight, h, 120, 80);
        $targe.css({height: headerHeight + "px", lineHeight: lineHeight + "px"});
    }

    /*pageAniGroup自适应*/
    function resizePageAniGroup($targe, h) {
        var max = $targe.data("max-top")
        var min = $targe.data("min-top")
        var top = getResize(maxHeight, minHeight, h, max, min);
        $targe.css({top: top + "px"});
    }

    function resizePageAniGroupByScale($targe, h) {
        var lineHeight = getResize(maxHeight, minHeight, h, 120, 80);
    }

    /*自适应*/
    function resizeLayout() {

        var h = getRagen($(window).height(), maxHeight, minHeight);
        var $curpage = $(".page.current");
        resizeLeft($curpage.find(".pageleft"), h);
        resizeHeader($("header"), h);
        resizePageAniGroup($curpage.find(".pageAniGroup"), h)
        resizePageAniGroupByScale($curpage.find(".pageAniGroup"), h)
    }

    $(window).resize(function () {
        // resizeLayout();
        changeRootrem()
    })
    changeRootrem();
    $(function () {
        // resizeLayout()
    });
})();

/*page动画处理*/

$(function () {

    /*css3动画promise*/
    var css3AnimateEndEvent;
    var css3Transition;
    (function () {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }
        for (t in transitions) {
            if (el.style[t] !== undefined) {
                css3AnimateEndEvent = transitions[t];
                css3Transition = t;
                return;
            }
        }
        css3AnimateEndEvent = "transitionend";
        css3Transition = "transition";
    })();
    var g_cont=0;
    function removeCss3Animate($target){
        $target.data("css3",false).css(css3Transition, ["none", 0, "ease", 0].join(" "));
    }
    function addCSS3Animate($target, aniOpt,callBack) {
        var dtd = $.Deferred(); // 新建一个deferred对象
        var len = $target.length;
        var count = 0;
        g_cont++
        var def = {
            duration: ".1s",
            property: "all",
            timingFunction: "ease-in-out",
            delay: ".1s",
            klass: "animate-show"
        }
        if(typeof aniOpt=="function"){
            callBack = aniOpt;
            aniOpt = null;
        }
        var opt = $.extend({}, def, aniOpt);
        var initCont=g_cont;
        $target.each(function () {
             $(this).off(css3AnimateEndEvent).on(css3AnimateEndEvent, function () {
                 if($(this).parents(".page").data("status")=="stop"){
                     $(this).off(css3AnimateEndEvent);
                     return;
                 }
                 $(this).off(css3AnimateEndEvent);
                 count++;
                 if(count==len){
                     dtd.resolve(); // 改变deferred对象的执行状态
                 }
            })
            if(!$(this).data("css3")){
                $(this).data("css3",true).css(css3Transition, [opt.property, opt.duration, opt.timingFunction, opt.delay].join(" "));
            }


        });


        //需要等待Deferred完全处理，另开线程
        if(typeof  callBack=="function"){
            callBack($target);
        }else{
            $target.addClass(opt.klass);
        }
        return dtd.promise();
    }
    var animateId=0;
    function animateCountUp($target){
        var options = {
               useEasing: true, // toggle easing
               useGrouping: true, // 1,000,000 vs 1000000
               separator: ',', // character to use as a separator*
               decimal: '.' // character to use as a decimal
           };
        var vals = [];
        $target.each(function () {
            if(!$(this).attr("id")){
                $(this).attr("id","countupid"+animateId);
                animateId++
            }
            vals.push({
            id:$(this).attr("id"),
                count:$(this).data("num")*1
            })
        })
        var len = vals.length;
        while(len--){
            var ret = vals[len];
            new countUp(ret.id, 0, (ret.count || 0), 0, 2, options).start();
        }
    }

    /*随机显示点*/
    function getRomand(dianInfo) {

        var romand = [];
        /*添加随机权重*/
        $.each(dianInfo,function (idx,val) {
            var order = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop";
            var orderlette = Math.floor(Math.random()*order.length);
            val.order = order.slice(orderlette,orderlette+1);
            romand.push(val);
        })
        /*按权重排序*/
        romand.sort(function (a1,a2) {
            return a1.order-a2.order;
        })
        return romand;
    }

    /*循环计数*/
    function rollBack(obj, max, min) {
        if (obj.start == max) {
            obj.count--;
            if (obj.count == min) {
                obj.start = min;
            }
        } else {
            obj.count++;
            if (obj.count == max) {
                obj.start = max;
            }
        }
        return obj.count;
    }
    /*线性增长计数*/
    function rollUp(obj, max) {
        obj.count++;
        if (obj.count > max) {
            obj.count = max;
        }
        return obj.count;
    }

    /*---------------------循环画点和线--------------------------------------*/
    function initCanvasAnimate(romand,dianInfo,opts){

        var len = rollUp(opts,romand.length);
        if(romand.length==len&&opts.status=="lineOk"){
            opts.dtd.resolve(); // 改变deferred对象的执行状态
        }

        opts.c.width = opts.c.width;

        var lineokNum=0;
        for(var i=0;i<len;i++){
            initCanvasLine(romand[i],dianInfo,opts)
            if(romand[i].lineok){
                lineokNum++;
            }
        }
        if(romand.length==lineokNum){
            opts.status="lineOk";
        }

        for(var i=0;i<len;i++){
            initCanvasDian(romand[i],dianInfo,opts)
        }
        /*计算器清不掉，resolve就会触发*/
        if(opts.canvasTimer.data("lock")){
            opts.c.width = opts.c.width;
            console.log("clear")
            return;
        }
        clearTimeout(opts.canvasTimer.data("timer"))
        opts.canvasTimer.data("timer",setTimeout(initCanvasAnimate,80,romand,dianInfo,opts));
    }

    //已经显示的点才可以连线
    function initCanvasLine(dian,dianInfo,opts){
        dian.visibility = true;
        var lineTos = dian.lineTo.split(",");
        var count=0;
        for(var i=0;i<lineTos.length;i++){
            var dian2 = dianInfo[(lineTos[i]*1)||0];
            drawLine(dian,dian2,opts);
            drawLine(dian,dian2,opts);
            drawLine(dian,dian2,opts);
            drawLine(dian,dian2,opts);
            var lineId = "dian"+dian.index+"dian"+dian2.index;
            if(dian[lineId]&&dian[lineId].lineok){
                count++
            }
        }
        if(count>=lineTos.length){
            dian.lineok = true;
        }
    }

    function initCanvasDian(dian,dianInfo,opts){
        var c = opts.c;
        var ctx = opts.ctx;
        //开始一个新的绘制路径
        ctx.beginPath();
        //设置弧线的颜色为蓝色

        dian.count = dian.count||0;
        dian.start = dian.start||0;
        r =  rollBack(dian,4,2);
        ctx.shadowColor = "#65b4ec";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 2;
        ctx.fillStyle="#65b4ec";
        //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
        ctx.arc(dian.x, dian.y, r, 0, Math.PI *2, false);
        ctx.fill()
    }
    /*画线*/
    function drawLine(dian1,dian2,opts){
        var c = opts.c;
        var ctx = opts.ctx;
        if(!dian1||!dian2||!dian1.visibility||!dian2.visibility){
            return;
        }
        ctx.beginPath();
        ctx.strokeStyle="rgba(255,255,255,0.8)";
        ctx.moveTo(dian1.x,dian1.y);
        var lineId = "dian"+dian1.index+"dian"+dian2.index;
        var line = dian1[lineId] =  dian1[lineId]||{count:0};
        var x,y;
        x = dian1.x+(dian2.x-dian1.x)/Math.abs(dian1.x-dian2.x)*rollUp(dian1[lineId],Math.abs(dian1.x-dian2.x))

        if(dian1.x==dian2.x){
            y = dian1.y+(dian2.y-dian1.y)/Math.abs(dian1.y-dian2.y)*rollUp(dian1[lineId],Math.abs(dian1.y-dian2.y))
        }else{
            y = (x-dian2.x)/(dian1.x-dian2.x)*(dian1.y-dian2.y)+dian2.y;
        }
        /*误差在0.5之内算ok*/
        if(Math.abs(y-dian2.y)<0.5){
            dian1[lineId].lineok = true;
        }

        ctx.lineTo(x,y);
        ctx.stroke();
    }

    /*canvas动画*/
    function canvasAnimate(opts,dianInfo){
        var romand = getRomand(dianInfo);
        initCanvasAnimate(romand, dianInfo, opts)
        return opts.dtd;
    }

    /*---------------------循环画点--------------------------------------*/
    /*canvas动画*/
    function canvasAnimate2(opts,dianInfo){
        var romand = getRomand(dianInfo);
        initCanvasAnimate2(romand, dianInfo, opts)
        return opts.dtd;
    }
    function initCanvasAnimate2(romand,dianInfo,opts){

        var len = rollUp(opts,romand.length);
        if(romand.length==len&&!opts.end){
            opts.end=true
            opts.dtd.resolve(); // 改变deferred对象的执行状态
        }

        opts.c.width = opts.c.width;

        for(var i=0;i<len;i++){
            initCanvasDian2(romand[i],dianInfo,opts)
        }
        /*计算器清不掉，resolve就会触发*/
        if(opts.canvasTimer.data("lock")){
            opts.c.width = opts.c.width;
            console.log("clear")
            return;
        }
        clearTimeout(opts.canvasTimer.data("timer"))
        opts.canvasTimer.data("timer",setTimeout(initCanvasAnimate2,40,romand,dianInfo,opts)) ;
    }

    function initCanvasDian2(dian,dianInfo,opts){
        var c = opts.c;
        var ctx = opts.ctx;
        //开始一个新的绘制路径
        ctx.beginPath();
        //设置弧线的颜色为蓝色

        dian.count = dian.count||0;
        dian.start = dian.start||0;
        r =  rollBack(dian,6,2);
        ctx.shadowColor = "#ffffff";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 10;
        ctx.fillStyle="#ffffff";
        //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
        ctx.arc(dian.x, dian.y, r, 0, Math.PI *2, false);
        ctx.fill()
    }

    /*动画和页面切换*/
    function initPageEvent() {

        /*平台*/
        $(".pt-page").on("ready", function () {
            var $this = $(this);
            addCSS3Animate($(".pt-ditu")).done(function () {
                addCSS3Animate($(".pt-quan1,.pt-quan2,.pt-quan3,.pt-quan4")).done(function () {
                    $(".pt-quan1,.pt-quan3").addClass("animate-infinite");
                    $(".pt-quan2,.pt-quan4").addClass("animate-infinite-rev");
                    addCSS3Animate($(".pt-dian1")).done(function () {
                        addCSS3Animate($(".pt-line1,.pt-line2,.pt-line3,.pt-line4")).done(function () {
                            addCSS3Animate($(".pt-dian2,.pt-dian3,.pt-dian4,.pt-dian5")).done(function () {
                                /*切换到下一页*/
                                return;
                                waitGoNextPage($this, $this.next(),7000);
                            })
                        })
                    })
                })
            })
        });


        /*舆情*/
        $(".yq-page").on("ready", function () {
            var dianInfo =[{"x":238.33331298828125,"y":172,"index":0,"lineTo":"18,17,19,20,1"},{"x":320.33331298828125,"y":154,"index":1,"lineTo":"0,20,22,2"},{"x":400.33331298828125,"y":196,"index":2,"lineTo":"1,22,12,3"},{"x":440.33331298828125,"y":274,"index":3,"lineTo":"2,12,11,13"},{"x":374.33331298828125,"y":248,"index":4,"lineTo":"12,22,21,5,30,11"},{"x":326.33331298828125,"y":272,"index":5,"lineTo":"21,4,30,6,7"},{"x":266.33331298828125,"y":266,"index":6,"lineTo":"5,21,19,23,7,9"},{"x":298.33331298828125,"y":324,"index":7,"lineTo":"5,6,9,8,31,30"},{"x":270.33331298828125,"y":370.03125,"index":8,"lineTo":"7,9,24,27,31"},{"x":234.33331298828125,"y":322.03125,"index":9,"lineTo":"6,23,15,24,8,7"},{"x":388.33331298828125,"y":358.03125,"index":10,"lineTo":"30,31,29,13,11"},{"x":416.33331298828125,"y":298.03125,"index":11,"lineTo":"3,12,4,30,10,13"},{"x":414.33331298828125,"y":234.03125,"index":12,"lineTo":"2,3,11,4,22"},{"x":422.33331298828125,"y":354.03125,"index":13,"lineTo":"11,3,10,14"},{"x":380.33331298828125,"y":402.03125,"index":14,"lineTo":"13,29"},{"x":180.33331298828125,"y":312.03125,"index":15,"lineTo":"16,17,23,9,24,25"},{"x":162.33331298828125,"y":290.03125,"index":16,"lineTo":"18,17,15,25"},{"x":186.33331298828125,"y":236.03125,"index":17,"lineTo":"18,0,19,23,15,16"},{"x":190.33331298828125,"y":212.03125,"index":18,"lineTo":"0,17,16"},{"x":244.33331298828125,"y":212.03125,"index":19,"lineTo":"0,20,21,6,23,17"},{"x":292.33331298828125,"y":172.03125,"index":20,"lineTo":"0,1,22,21,19"},{"x":312.33331298828125,"y":216.03125,"index":21,"lineTo":"20,22,4,5,6,19"},{"x":362.33331298828125,"y":188.03125,"index":22,"lineTo":"1,2,12,4,21,20"},{"x":214.33331298828125,"y":266.03125,"index":23,"lineTo":"17,19,6,9,15"},{"x":218.33331298828125,"y":376.03125,"index":24,"lineTo":"9,15,25,26,27,8"},{"x":182.33331298828125,"y":358.03125,"index":25,"lineTo":"16,15,24,26"},{"x":234.33331298828125,"y":412.03125,"index":26,"lineTo":"25,24,27,28"},{"x":286.33331298828125,"y":414.03125,"index":27,"lineTo":"26,24,8,31,29,28"},{"x":310.33331298828125,"y":432.03125,"index":28,"lineTo":"26,27,29"},{"x":364.33331298828125,"y":408.03125,"index":29,"lineTo":"28,27,31,10,13,14"},{"x":362.33331298828125,"y":316.03125,"index":30,"lineTo":"4,5,7,31,10,11"},{"x":334.33331298828125,"y":374.03125,"index":31,"lineTo":"30,10,29,7,8,27"}]
            var $this = $(this);
            var opts = {
                count: 0,//随机计数
                dtd: $.Deferred(),// 新建一个deferred对象
                c: $(".yq-dian")[0],//画布
                ctx: $(".yq-dian")[0].getContext("2d"),//画布
                canvasTimer: $this.data("lock",false)
            }
            addCSS3Animate($(".yq-quan1")).done(function () {
                addCSS3Animate($(".yq-quan2")).done(function () {
                    $(".yq-quan1").addClass("animate-infinite");
                    $(".yq-quan2").addClass("animate-infinite-rev");
                    addCSS3Animate($(".yq-diqiu")).done(function () {
                        canvasAnimate(opts,dianInfo).done(function () {
                            return;
                            /*切换到下一页*/
                            waitGoNextPage($this, $this.next(),7000);
                        })
                    })
                })
            })
        })


        /*问题*/
        $(".wt-page").on("ready", function () {
            var $this = $(this);
            var dianInfo = [{"x":176.33331298828125,"y":120,"index":0},{"x":255.33331298828125,"y":75,"index":1},{"x":281.33331298828125,"y":120,"index":2},{"x":334.33331298828125,"y":121,"index":3},{"x":360.33331298828125,"y":75,"index":4},{"x":412.33331298828125,"y":75,"index":5},{"x":437.33331298828125,"y":120,"index":6},{"x":492.33331298828125,"y":120,"index":7},{"x":515.3333129882812,"y":75,"index":8},{"x":567.3333129882812,"y":74,"index":9},{"x":595.3333129882812,"y":119,"index":10},{"x":673.3333129882812,"y":162,"index":11},{"x":568.3333129882812,"y":165,"index":12},{"x":570.3333129882812,"y":256,"index":13},{"x":515.3333129882812,"y":165,"index":14},{"x":489.33331298828125,"y":211,"index":15},{"x":517.3333129882812,"y":255,"index":16},{"x":412.33331298828125,"y":166,"index":17},{"x":437.33331298828125,"y":211,"index":18},{"x":410.33331298828125,"y":256,"index":19},{"x":437.33331298828125,"y":302,"index":20},{"x":357.33331298828125,"y":257,"index":21},{"x":331.33331298828125,"y":210,"index":22},{"x":358.33331298828125,"y":165,"index":23},{"x":279.33331298828125,"y":210,"index":24},{"x":201.33331298828125,"y":255,"index":25},{"x":174.33331298828125,"y":210,"index":26},{"x":98.33331298828125,"y":165,"index":27},{"x":122.33331298828125,"y":120,"index":28},{"x":201.33331298828125,"y":165,"index":29},{"x":254.33331298828125,"y":165,"index":30},{"x":333.33331298828125,"y":300,"index":31},{"x":254.33331298828125,"y":254,"index":32}]
            var opts = {
                count: 10,//随机计数
                dtd: $.Deferred(),// 新建一个deferred对象
                c: $(".wt-dian")[0],//画布
                ctx: $(".wt-dian")[0].getContext("2d"),//画布
                canvasTimer: $this.data("lock",false)
            }

            $this.data("status")=="animating"
            addCSS3Animate($(".wt-ditu")).done(function () {
                addCSS3Animate($(".wt-liubian,.wt-liubian-light"),{duration:"1s"}).done(function () {
                    canvasAnimate2(opts,dianInfo).done(function () {
                        addCSS3Animate($(".wt-renwu2"),{duration:".2s"}).done(function () {
                            addCSS3Animate($(".wt-renwu3")).done(function () {
                                addCSS3Animate($(".wt-renwu8"),{duration:".3s"}).done(function () {
                                    addCSS3Animate($(".wt-renwu1")).done(function () {
                                        addCSS3Animate($(".wt-renwu6")).then(function () {
                                            addCSS3Animate($(".wt-renwu7")).done(function () {
                                                addCSS3Animate($(".wt-renwu5"),{duration:".2s"}).then(function () {
                                                    addCSS3Animate($(".wt-renwu4")).done(function () {
                                                        return;
                                                        waitGoNextPage($this, $this.next(), 7000);
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })

        /*报障*/
        $(".bz-page").on("ready", function () {
            var $this = $(this);
            $this.data("status")=="animating"
            addCSS3Animate($(".bz-ditu")).done(function () {
                addCSS3Animate($(".bz-neiquan")).done(function () {
                    $(".bz-neiquan").addClass("animate-infinite-rev");
                    addCSS3Animate($(".bz-dunpai")).done(function () {
                        addCSS3Animate($(".bz-flash"),{timingFunction:"cubic-bezier(.47,-0.05,.69,1.69)"}).done(function () {
                            return;
                            waitGoNextPage($this, $this.next(),7000);
                        })
                    })
                })
            })
        })

        /*竞品*/
        $(".jp-page").on("ready", function () {
            var $this = $(this);
            $this.data("status")=="animating"
            addCSS3Animate($(".jp-item1 .jp-kuang")).then(function () {
                $(".jp-item1 .jp-light1>img").addClass("animate-move")
                $(".jp-item1 .jp-light3>img").addClass("animate-move-v-2")
                $(".jp-item1 .jp-light2>img").addClass("animate-move-h")
                addCSS3Animate($(".jp-item1 .jp-info")).done(function () {
                    addCSS3Animate($(".jp-item1 .jp-people")).done(function () {
                        addCSS3Animate($(".jp-item1 .jp-zhu1")).done(function () {
                            addCSS3Animate($(".jp-item2 .jp-kuang")).then(function () {
                                $(".jp-item2 .jp-light1>img").addClass("animate-move")
                                $(".jp-item2 .jp-light3>img").addClass("animate-move-v-2")
                                $(".jp-item2 .jp-light2>img").addClass("animate-move-h")
                                addCSS3Animate($(".jp-item2 .jp-info")).done(function () {
                                    addCSS3Animate($(".jp-item2 .jp-people")).done(function () {
                                        addCSS3Animate($(".jp-item2 .jp-zhu2")).done(function () {
                                            return;

                                            waitGoNextPage($this, $this.next(),7000);
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    function clearPage($curpage){
        $curpage.data("lock",true);
        clearTimeout($curpage.data("timer2"));
       clearTimeout($curpage.data("timer")) ;
      var canvas =   $curpage.find("canvas");
      if(canvas.length){
          canvas[0].width = canvas[0].width;
      }
        $curpage.find(".animate-show").off(css3AnimateEndEvent).removeClass("animate-show");
        $(".animate-infinite").removeClass("animate-infinite")
        $(".animate-infinite-rev").removeClass("animate-infinite-rev")
        $(".animate-move").removeClass("animate-move")
        $(".animate-move-v-2").removeClass("animate-move-v-2")
        $(".animate-move-h").removeClass("animate-move-h")
    }
    function goNextPage($curpage, $nextpage,time,callback){
        var $children = $curpage.parent().children();

        //最后一页，或者只有一页的情况处理
        if (!$nextpage || $nextpage.length == 0) {
            if ($children.length == 1) {
                return;
            }
            $nextpage = $children.eq(0);
        }

        clearPage($curpage);

        if($nextpage.data("ready")){
            goNext();
        }else{
            loadoneimg($nextpage,$nextpage.data("bg"),goNext)
        }
        function  goNext() {
            $curpage.removeClass("current")
            $nextpage.addClass("current");
            $(window).trigger("resize");
            initpage();
        }
    }
    /*切换到下一页*/
    function waitGoNextPage($curpage, $nextpage,time,callback) {
        clearTimeout($curpage.data("timer2"));
        $curpage.data("timer2", setTimeout(function () {
            if( vSwiper.activeIndex==4){
                vSwiper._slideTo(0)
            }else{
                vSwiper._slideNext();
            }
        }, time))
    }

    /*初始化页面*/
    function initpage(initBg) {
        var $curpage = $(".page.current") || $(".page").eq(0);

        animateCountUp($curpage.find(".animateCountUp"))
        if (!$curpage.data("ready")) {
            loadpage($curpage,initBg);
        } else {
            $curpage.trigger("ready");
        }
    }

    /*下载一个图片回调*/
    function loadoneimg($target,src, callback) {
        var img = new Image;
        img.onload = function () {
            $target.css("background-image", "url(" + src + ")")
            if(typeof  callback =="function"){
                callback();
            }
        }
        img.onerror = function () {
            if(typeof  callback =="function"){
                callback();
            }
        }
        img.src = src;
    }

    /*下载多个图片回调*/
    function loadimg($page, $target, src, deepObj, len,initBg) {
        var img = new Image;
        img.onload = function () {
            $target.css("background-image", "url(" + src + ")")
            checkloadComplete($page, deepObj, len,initBg);
        }
        img.onerror = function () {
            checkloadComplete($page, deepObj, len,initBg);
        }
        img.src = src;
    }

    /*校验触发ready事件*/
    function checkloadComplete($page, deepObj, len,initBg) {
        deepObj.count++;
        if (deepObj.count == len) {
            if(typeof initBg=="function"){
                initBg();
            }

            $page.trigger("ready").data("ready", true);
        }
    }

    /*加载图*/
    function loadpage($curpage,initBg) {
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
            loadimg($curpage, imgArr[i].$target, imgArr[i].src, deepObj, len,initBg);
        }
    }
    var vSwiper = new Swiper('.swiper-container',{
        speed: 1000,
        parallax:true,
        initialSlide:1,
        nextButton: '.arrow-right',
        prevButton: '.arrow-left',
        paginationClickable: true,
        pagination:".swiper-pagination",
        onSlideChangeStart:function () {
            if(vSwiper){
                goNextPage($(".page").eq(vSwiper.previousIndex),$(".page").eq(vSwiper.activeIndex));
            }
        }
    })

    function initAllbg() {
        console.log("page1")
        $(".page").each(function (idx) {
            var src= $(this).data("bg")
            if(idx>0){
                $(this).css("background-image", "url(" + src + ")")
            }
        })
    }
    initpage(initAllbg);
    initPageEvent()
})
