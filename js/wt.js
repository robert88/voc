$(function () {


    /*问题*/
    $(".wt-page").on("ready", function () {
        //1、画地图
        var $this = $(this);
        addJqueryAnimate($(".wt-ditu")).done(function () {
            //2、画光
            addCSS3Animate($(".wt-liubian,.wt-liubian-light"), {duration: "1s"}).done(function () {

                //3、画随机点
                var canvasAnimate = new CanvasAnimate({c: $(".wt-canvas")[0]});

                $(".wt-canvas").data("animate",canvasAnimate);

                canvasAnimate.pushAnimate(new Object2d({
                    data: [{"x":176.33331298828125,"y":120,"index":0},{"x":255.33331298828125,"y":75,"index":1},{"x":281.33331298828125,"y":120,"index":2},{"x":334.33331298828125,"y":121,"index":3},{"x":360.33331298828125,"y":75,"index":4},{"x":412.33331298828125,"y":75,"index":5},{"x":437.33331298828125,"y":120,"index":6},{"x":492.33331298828125,"y":120,"index":7},{"x":515.3333129882812,"y":75,"index":8},{"x":567.3333129882812,"y":74,"index":9},{"x":595.3333129882812,"y":119,"index":10},{"x":673.3333129882812,"y":162,"index":11},{"x":568.3333129882812,"y":165,"index":12},{"x":570.3333129882812,"y":256,"index":13},{"x":515.3333129882812,"y":165,"index":14},{"x":489.33331298828125,"y":211,"index":15},{"x":517.3333129882812,"y":255,"index":16},{"x":412.33331298828125,"y":166,"index":17},{"x":437.33331298828125,"y":211,"index":18},{"x":410.33331298828125,"y":256,"index":19},{"x":437.33331298828125,"y":302,"index":20},{"x":357.33331298828125,"y":257,"index":21},{"x":331.33331298828125,"y":210,"index":22},{"x":358.33331298828125,"y":165,"index":23},{"x":279.33331298828125,"y":210,"index":24},{"x":201.33331298828125,"y":255,"index":25},{"x":174.33331298828125,"y":210,"index":26},{"x":98.33331298828125,"y":165,"index":27},{"x":122.33331298828125,"y":120,"index":28},{"x":201.33331298828125,"y":165,"index":29},{"x":254.33331298828125,"y":165,"index":30},{"x":333.33331298828125,"y":300,"index":31},{"x":254.33331298828125,"y":254,"index":32}],
                    render: function (canvasObj) {
                        //原始长度
                        var orgLen = this.opts.data.length;

                        //拷贝的长度
                        var copyLen = this.copyData.length;

                        //产出随机画的点的数据 100ms一次
                        if (copyLen) {
                            this.pll(function () {
                                var randomIndex = Math.floor(copyLen * Math.random());
                                var delData = this.copyData.splice(randomIndex, 1);
                                if (delData && delData[0]) {
                                    this.drawData.push(delData[0]);
                                }
                            }, 50)
                        }


                        //根据可画的点来画线，并且根据点来确定线是否ok
                        var drawData = this.drawData;
                        var len = drawData.length;

                        //100ms一次来画点
                        canvasObj.ctx.shadowColor = "#ffffff";
                        canvasObj.ctx.shadowOffsetX = 0;
                        canvasObj.ctx.shadowOffsetY = 0;
                        canvasObj.ctx.shadowBlur = 10;
                        canvasObj.ctx.fillStyle = "#ffffff"
                        for (var i = 0; i < len; i++) {
                            drawData[i].flashTimer =  drawData[i].flashTimer||new AnimateCounter({start:2,end:6,rockback: true})
                            canvasObj.drawGroupDian(drawData[i], drawData[i].flashTimer )
                        }


                        //如果所有的线都画完了，表示这个可以过度到下一动画
                        if (orgLen == len) {
                            this.promise.resolve();
                            return true;
                        }
                    }
                }))

                //4、画人物
                addJqueryAnimate($(".wt-renwu2")).done(function () {
                    addJqueryAnimate($(".wt-renwu3")).done(function () {
                        addJqueryAnimate($(".wt-renwu8")).done(function () {
                            addJqueryAnimate($(".wt-renwu1")).done(function () {
                                addJqueryAnimate($(".wt-renwu6")).then(function () {
                                    addJqueryAnimate($(".wt-renwu7")).done(function () {
                                        addJqueryAnimate($(".wt-renwu5")).then(function () {
                                            addJqueryAnimate($(".wt-renwu4")).done(function () {
                                                // waitGoNextPage($this, $this.next(), 7000);
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
