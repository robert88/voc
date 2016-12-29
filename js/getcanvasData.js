
            var count = 0;
            window.curIndex = 0;
            window.dians = []
            window.pcount = 0;

            var c = $("canvas.wt-dian")[0];//画布
            var ctx = $("canvas.wt-dian")[0].getContext("2d");//画布

            function draw(x, y,index) {

                //开始一个新的绘制路径
                ctx.beginPath();
                ctx.fillStyle = "#0000ff";
                var circle = {
                    x: x,    //圆心的x轴坐标值
                    y: y,    //圆心的y轴坐标值
                    r: 1      //圆的半径
                };
                //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
                ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false);
                ctx.fill()
                ctx.beginPath();
                ctx.font = "12px Arial";
                ctx.fillStyle = "#ff00ff";
                ctx.fillText(index, circle.x + 5, circle.y + 5);
            }

            function drawAll() {
                c.width = c.width
                for (var i = 0; i < dians.length; i++) {
                    draw(dians[i].x, dians[i].y,i)
                }
            }


            $("canvas.wt-dian").click(function (e) {
                var x = e.pageX - $(this).offset().left;
                var y = e.pageY - $(this).offset().top;
                var len = dians.length;
                dians.push({x: x, y: y, index: len});
                window.curIndex = count
                count++
                drawAll()
            })

            window.cd = function (str) {
                console.log("set dian", pcount)
                if (str) {
                    dians[pcount].lineTo = str;
                }
                pcount++;
                console.log("next dian", pcount)
            }

            $.when(addCSS3Animate($(".wt-dian")))

            $(document).on("keydown", function (e) {
                console.log("当前" + window.curIndex)
                if (e.key == "ArrowRight") {
                    dians[curIndex].x++
                    drawAll()
                    return false;
                } else if (e.key == "ArrowLeft") {
                    dians[curIndex].x--
                    drawAll()
                    return false;
                }
                else if (e.key == "ArrowUp") {
                    dians[curIndex].y--
                    drawAll()
                    return false;
                }
                else if (e.key == "ArrowDown") {
                    dians[curIndex].y++
                    drawAll()
                    return false;
                }
            })