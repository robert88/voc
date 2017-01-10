$(function () {

    /*报障*/
    $(".bz-page").on("ready", function () {

         //1、画地图
        var $this = $(this);
        addCSS3Animate($(".bz-ditu")).done(function () {

            //2、画随机点
            var canvasAnimate = new CanvasAnimate({c: $(".bz-canvas")[0]});
            $this.data("animate",canvasAnimate);
            canvasAnimate.pushAnimate(new Object2d({
                data: [{"x":369,"y":32,color:"#40d3e5"},{"x":381,"y":21,color:"#40d3e5"},{"x":454,"y":52,color:"#40d3e5"},{"x":517,"y":53},{"x":530,"y":89},{"x":512,"y":113},{"x":559,"y":123},{"x":618,"y":158},{"x":521,"y":166},{"x":584,"y":196},{"x":636,"y":206},{"x":525,"y":253},{"x":481,"y":298},{"x":500,"y":361},{"x":597,"y":372},{"x":608,"y":474},{"x":715,"y":534},{"x":648,"y":583},{"x":518,"y":538},{"x":527,"y":517}],
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
                        }, 100)
                    }


                    //根据可画的点来画线，并且根据点来确定线是否ok
                    var drawData = this.drawData;
                    var len = drawData.length;



                    for (var i = 0; i < len; i++) {
                                            //100ms一次来画点
                        canvasObj.ctx.shadowColor = drawData[i].color||"rgb(127,184,203)";
                        canvasObj.ctx.shadowOffsetX = 0;
                        canvasObj.ctx.shadowOffsetY = 0;
                        canvasObj.ctx.shadowBlur = 10;
                        canvasObj.ctx.fillStyle = drawData[i].color||"rgb(127,184,203)";
                        drawData[i].flashTimer =  drawData[i].flashTimer||new AnimateCounter({start:4,end:6,rockback: true})
                        canvasObj.drawGroupDian(drawData[i], drawData[i].flashTimer )
                    }


                    //如果所有的线都画完了，表示这个可以过度到下一动画
                    if (orgLen == len) {
                        this.promise.resolve();
                    }
                    return true;
                }
            }))

            //3、画扫描
            canvasAnimate.pushAnimate(new Object2d({
                data: [{"x": 0, "y": 62, src: "./images/bz/bz_shaomiao.png", start: 0, end: 360}
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
                                    duration: 5000
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
                        return true;
                    }
                }
            })).done(function () {

                //4、盾牌
                addCSS3Animate($(".bz-dunpai")).done(function () {
                    addCSS3Animate($(".bz-flash"), {timingFunction: "cubic-bezier(.47,-0.05,.69,1.69)"}).done(function () {
                        // waitGoNextPage($this, $this.next(), 7000);
                    })
                })

                //5、扫描出来的点
                var dur = {duration: ".3s"}
                addCSS3Animate($(".bz-dian4"),{delay: ".1s"}).done(function () {
                    $(".bz-dian4").addClass("animate-shake")
                    addCSS3Animate($(".bz-dian5"),{delay: ".8s"}).done(function () {
                        $(".bz-dian5").addClass("animate-shake")
                        addCSS3Animate($(".bz-dian6"),{delay: ".6s"}).done(function () {
                            $(".bz-dian6").addClass("animate-shake")
                            addCSS3Animate($(".bz-dian7"),{delay: ".6s"}).done(function () {
                                $(".bz-dian7").addClass("animate-shake")
                                addCSS3Animate($(".bz-dian1"),{delay: ".3s"}).done(function () {
                                    $(".bz-dian1").addClass("animate-shake")
                                    addCSS3Animate($(".bz-dian2"),{delay: ".3s"}).done(function () {
                                        $(".bz-dian2").addClass("animate-shake")
                                        addCSS3Animate($(".bz-dian3"),{delay: ".3s"}).done(function () {
                                            $(".bz-dian3").addClass("animate-shake")
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
