$(function () {

    /*平台*/
    $(".pt-page").on("ready", function () {
        var $this = $(this);

        //1、画地图
        addCSS3Animate($(".pt-ditu")).done(function () {
            //2、画圈
            var canvasAnimate = new CanvasAnimate({c: $(".pt-canvas")[0]});

            $this.data("animate",canvasAnimate);
            canvasAnimate.pushAnimate(new Object2d({
                data: [{"x": 90, "y": 0, src: "./images/pt/pt_quan1.png", start: 0, end: 360},
                    {"x": 90, "y": 0, src: "./images/pt/pt_quan2.png", start: 360, end: 0},
                    {"x": 90, "y": 0, src: "./images/pt/pt_quan3.png", start: 0, end: 360},
                    {"x": 90, "y": 0, src: "./images/pt/pt_quan4.png", start: 360, end: 0}
                ],
                render: function (canvasObj) {
                    var count = 0;
                    for (var i = 0; i < this.copyData.length; i++) {
                        var copyData = this.copyData[i];

                        if (copyData.image.status == "ready") {
                            canvasObj.ctx.save();
                            copyData.showAnimate = copyData.showAnimate || new AnimateCounter({
                                    start: 0,
                                    end: 1,
                                    duration: 500
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
                                    duration: 3000
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
                        this.promise.resolve();
                    }
                    return true;
                }
            })).done(function () {
                //3、画1点
                addCSS3Animate($(".pt-dian1")).done(function () {
                    canvasAnimate.pushAnimate(new Object2d({
                        data: [{"x":498,"y":164.22665405273438}],
                        render: function (canvasObj) {
                            var drawData = this.copyData;
                            var len = drawData.length;
                            //100ms一次来画点
                            canvasObj.ctx.fillStyle = "rgba(237,122,65,.5)";
                            for (var i = 0; i < len; i++) {
                                drawData[i].flashTimer =  drawData[i].flashTimer||new AnimateCounter({start:10,end:18,rockback: true,duration:1000})
                                canvasObj.drawGroupDian(drawData[i], drawData[i].flashTimer )
                            }
                            return true;
                        }
                    }))
                    //4、画4线
                    addCSS3Animate($(".pt-line1,.pt-line2,.pt-line3,.pt-line4")).done(function () {
                        //4、画4点
                        addCSS3Animate($(".pt-dian2,.pt-dian3,.pt-dian4,.pt-dian5")).done(function () {
                            canvasAnimate.pushAnimate(new Object2d({
                                data: [{"x":266.4,"y":128,start:5,end:13},
                                    {"x":173,"y":220,start:7,end:15},
                                    {"x":348,"y":214,start:3,end:11},
                                    {"x":380,"y":336,start:6,end:14}],
                                render: function (canvasObj) {
                                    var drawData = this.copyData;
                                    var len = drawData.length;
                                    //100ms一次来画点
                                    canvasObj.ctx.fillStyle = "rgba(226,188,29,.5)";
                                    for (var i = 0; i < len; i++) {
                                        drawData[i].flashTimer =  drawData[i].flashTimer||new AnimateCounter({start:drawData[i].start,end:drawData[i].end,rockback: true,duration:1000})
                                        canvasObj.drawGroupDian(drawData[i], drawData[i].flashTimer )
                                    }
                                    return true;
                                }
                            }))
                        })
                    })
                })
            })

        })
    });


})
