$(function () {



    /*舆情*/
    $(".yq-page").on("ready", function () {

      var $this = $(this);
        var canvasAnimate = new CanvasAnimate({c: $(".yq-canvas")[0]});
        $this.data("animate",canvasAnimate);
        //1、画外圈和内圈
        canvasAnimate.pushAnimate(new Object2d({
            data: [{"x": 30, "y": 30, src: "./images/yq/yq_quan1.png", start: 0, end: 360},
                {"x": 30, "y": 30, src: "./images/yq/yq_quan2.png", start: 360, end: 0},
            ],
            render: function (canvasObj) {
                var count = 0;
                for (var i = 0; i < this.copyData.length; i++) {
                    var copyData = this.copyData[i];

                    if (copyData.image.status == "ready") {
                        canvasObj.ctx.save();
                        copyData.showAnimate = copyData.showAnimate || new AnimateCounter({
                                start: 0,
                                end: 1
                            });

                        if (copyData.showAnimate.getCount() == 1) {
                            count++;
                        }
                        canvasObj.show(copyData.showAnimate);

                        copyData.rotateAnimate = copyData.rotateAnimate || new AnimateCounter({
                                start: copyData.start,
                                end: copyData.end,
                                loop: true,
                                animateType: "linear",
                                duration: 11000
                            });
                        canvasObj.rotate(copyData.rotateAnimate, {
                            x: copyData.x,
                            y: copyData.y,
                            width: copyData.image.width,
                            height: copyData.image.height
                        });

                        canvasObj.drawImage(copyData);
                        canvasObj.ctx.restore()
                    }
                }
                if (count == this.copyData.length) {
                    this.promise.resolve()
                    return true;
                }
            }
        })).done(function () {
            //2、画地球
            addCSS3Animate($(".yq-diqiu")).done(function () {
                //3、画随机点和线
                var dianInfo = [{"x":238.33331298828125,"y":172,"index":0,"lineTo":"18,17,19,20,1"},{"x":320.33331298828125,"y":154,"index":1,"lineTo":"0,20,22,2"},{"x":400.33331298828125,"y":196,"index":2,"lineTo":"1,22,12,3"},{"x":440.33331298828125,"y":274,"index":3,"lineTo":"2,12,11,13"},{"x":374.33331298828125,"y":248,"index":4,"lineTo":"12,22,21,5,30,11"},{"x":326.33331298828125,"y":272,"index":5,"lineTo":"21,4,30,6,7"},{"x":266.33331298828125,"y":266,"index":6,"lineTo":"5,21,19,23,7,9"},{"x":298.33331298828125,"y":324,"index":7,"lineTo":"5,6,9,8,31,30"},{"x":270.33331298828125,"y":370.03125,"index":8,"lineTo":"7,9,24,27,31"},{"x":234.33331298828125,"y":322.03125,"index":9,"lineTo":"6,23,15,24,8,7"},{"x":388.33331298828125,"y":358.03125,"index":10,"lineTo":"30,31,29,13,11"},{"x":416.33331298828125,"y":298.03125,"index":11,"lineTo":"3,12,4,30,10,13"},{"x":414.33331298828125,"y":234.03125,"index":12,"lineTo":"2,3,11,4,22"},{"x":422.33331298828125,"y":354.03125,"index":13,"lineTo":"11,3,10,14"},{"x":380.33331298828125,"y":402.03125,"index":14,"lineTo":"13,29"},{"x":180.33331298828125,"y":312.03125,"index":15,"lineTo":"16,17,23,9,24,25"},{"x":162.33331298828125,"y":290.03125,"index":16,"lineTo":"18,17,15,25"},{"x":186.33331298828125,"y":236.03125,"index":17,"lineTo":"18,0,19,23,15,16"},{"x":190.33331298828125,"y":212.03125,"index":18,"lineTo":"0,17,16"},{"x":244.33331298828125,"y":212.03125,"index":19,"lineTo":"0,20,21,6,23,17"},{"x":292.33331298828125,"y":172.03125,"index":20,"lineTo":"0,1,22,21,19"},{"x":312.33331298828125,"y":216.03125,"index":21,"lineTo":"20,22,4,5,6,19"},{"x":362.33331298828125,"y":188.03125,"index":22,"lineTo":"1,2,12,4,21,20"},{"x":214.33331298828125,"y":266.03125,"index":23,"lineTo":"17,19,6,9,15"},{"x":218.33331298828125,"y":376.03125,"index":24,"lineTo":"9,15,25,26,27,8"},{"x":182.33331298828125,"y":358.03125,"index":25,"lineTo":"16,15,24,26"},{"x":234.33331298828125,"y":412.03125,"index":26,"lineTo":"25,24,27,28"},{"x":286.33331298828125,"y":414.03125,"index":27,"lineTo":"26,24,8,31,29,28"},{"x":310.33331298828125,"y":432.03125,"index":28,"lineTo":"26,27,29"},{"x":364.33331298828125,"y":408.03125,"index":29,"lineTo":"28,27,31,10,13,14"},{"x":362.33331298828125,"y":316.03125,"index":30,"lineTo":"4,5,7,31,10,11"},{"x":334.33331298828125,"y":374.03125,"index":31,"lineTo":"30,10,29,7,8,27"}],
                    len=dianInfo.length;
                while(len--){
                    dianInfo[len].x =  dianInfo[len].x+30
                    dianInfo[len].y =  dianInfo[len].y+30
                }

                canvasAnimate.pushAnimate(new Object2d({
                    data:dianInfo,
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
                            }, 30)
                        }


                        //根据可画的点来画线，并且根据点来确定线是否ok
                        var drawData = this.drawData;
                        var len = drawData.length;
                        var lineokNum = 0;
                        canvasObj.ctx.strokeStyle = "rgba(255,255,255,0.8)";
                        for (var i = 0; i < len; i++) {
                            canvasObj.drawGroupLine(drawData[i], this);
                            if (drawData[i].lineok) {
                                lineokNum++;
                            }
                        }

                        //100ms一次来画点
                        canvasObj.ctx.shadowColor = "#65b4ec";
                        canvasObj.ctx.shadowOffsetX = 0;
                        canvasObj.ctx.shadowOffsetY = 0;
                        canvasObj.ctx.shadowBlur = 2;
                        canvasObj.ctx.fillStyle = "#65b4ec";
                        for (var i = 0; i < len; i++) {
                            drawData[i].flashTimer =  drawData[i].flashTimer||new AnimateCounter({start:1,end:4,rockback: true})
                            canvasObj.drawGroupDian(drawData[i], drawData[i].flashTimer )
                        }


                        //如果所有的线都画完了，表示这个可以过度到下一动画
                        if (orgLen == lineokNum) {
                            this.promise.resolve();
                            return true;
                        }
                    }
                }))
            })
        })

    })
})
