$(function () {


    /*竞品*/
    $(".jp-page").on("ready", function () {

        /**
         *
         *
         *
         * 初始化框中的信息
         *
         *
         * */
        function initKuang(dianInfo) {
            var baseY = 112;
            var baseH = 9;
            var baseSpace = 3;
            var baseBigSpace = 9;
            for (var i = 0; i < dianInfo.length; i++) {
                if (i == 0 || (i == dianInfo.length / 2)) {
                    dianInfo[i].y = baseY;
                } else {
                    if (i % 2) {
                        dianInfo[i].y = dianInfo[i - 1].y + baseSpace + baseH;
                    } else {
                        dianInfo[i].y = dianInfo[i - 1].y + baseBigSpace + baseH;
                    }
                }
                dianInfo[i].h = baseH;
            }
            return dianInfo
        }

        //1、画框
        var $this = $(this);
        addJqueryAnimate($(".jp-kuang")).then(function () {
            $(".jp-light1>img").addClass("animate-move")
            $(".jp-light3>img").addClass("animate-move-v-2")
            $(".jp-light2>img").addClass("animate-move-h")
            //2、文字
            addJqueryAnimate($(".jp-info")).done(function () {
                //3、人物
                addJqueryAnimate($(".jp-people")).done(function () {
                    //4、柱形
                    addCSS3Animate($(".jp-zhu2,.jp-zhu1")).done(function () {
                        //5、画随机点
                        var canvasAnimate = new CanvasAnimate({c: $(".jp-canvas")[0]});

                        $(".jp-canvas").data("animate",canvasAnimate);

                        canvasAnimate.pushAnimate(new Object2d({
                            data:initKuang([{"x":50.760009765625,"w":56},{"x":50.760009765625,"w":147},{"x":50.760009765625,"w":233},{"x":50.760009765625,"w":190},{"x":50.760009765625,"w":34},{"x":50.760009765625,"w":74},{"x":50.760009765625,"w":102},{"x":50.760009765625,"w":97},{"x":50.760009765625,"w":137},{"x":50.760009765625,"w":125},{"x":50.760009765625,"w":56},{"x":50.760009765625,"w":79},{"x":426.760009765625,"w":73},{"x":426.760009765625,"w":110},{"x":426.760009765625,"w":162},{"x":426.760009765625,"w":124},{"x":426.760009765625,"w":149},{"x":426.760009765625,"w":142},{"x":426.760009765625,"w":105},{"x":426.760009765625,"w":97},{"x":426.760009765625,"w":51},{"x":426.760009765625,"w":42},{"x":426.760009765625,"w":47},{"x":426.760009765625,"w":79}])
                            ,
                            render: function (canvasObj) {
                                var copyDataArr = this.copyData;

                                var maxLen =  Math.floor(copyDataArr.length/2);
                                copyDataArr.turnAnimate = copyDataArr.turnAnimate||new AnimateCounter({start:0,end:maxLen,animateType:"linear",duration:1000});
                                var len = copyDataArr.turnAnimate.getCount();
                                canvasObj.ctx.fillStyle="#9b96ff"
                                for (var i = 0; i < len; i++) {
                                    var copyData = copyDataArr[i];
                                    copyData.rectAnimate = copyData.rectAnimate||new AnimateCounter({start:0,end:copyData.w,animateType:"linear",rockback:true,duration:1000});
                                    canvasObj.drawRect(copyData, copyData.rectAnimate);

                                    var copyData2 = copyDataArr[i+maxLen];
                                    copyData2.rectAnimate = copyData2.rectAnimate||new AnimateCounter({start:0,end:copyData2.w,animateType:"linear",rockback:true,duration:1000});
                                    canvasObj.drawRect(copyData2, copyData2.rectAnimate);
                                }

                                if (len == maxLen ) {
                                    this.promise.resolve();
                                    return true;
                                }
                            }
                        }))
                    })
                })
            })
        })
    })


})
